require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const fsSync = require('fs');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CV uploads folder ---
const uploadsDir = path.join(__dirname, 'uploads', 'cv');
if (!fsSync.existsSync(uploadsDir)) fsSync.mkdirSync(uploadsDir, { recursive: true });

const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uid  = req.session?.user?.id || 'anon';
    const ext  = path.extname(file.originalname).toLowerCase();
    cb(null, `cv_user${uid}_${Date.now()}${ext}`);
  }
});
const cvUpload = multer({
  storage: cvStorage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Само PDF, DOC, DOCX, JPG или PNG файлове са разрешени.'));
  }
});

// --- НАСТРОЙКИ ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// --- MIDDLEWARE ЗА ДОСТЪП ---
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login?error=auth');
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  return res.redirect('/?error=forbidden');
}

// --- ПЪТИЩА ЗА СТРАНИЦИТЕ (HTML) ---
app.get('/', (req, res) =>  {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => { 
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgot-password.html'));
});

app.get('/test-apply', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'test-apply.html'));
});

app.get('/child-animation', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'child-animation.html'));
});

app.get('/sport-animation', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sport-animation.html'));
});

app.get('/child-test', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'child-test.html'));
});

app.get('/sport-test', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sport-test.html'));
});

// Кандидатстване след успешен тест
app.get('/post-test-apply', requireAuth, (req, res) => {
  const u = req.session.user;
  let html = require('fs').readFileSync(path.join(__dirname, 'views', 'post-test-apply.html'), 'utf8');
  html = html
    .replace('{{FIRST_NAME}}', u.first_name || '')
    .replace('{{LAST_NAME}}',  u.last_name  || '')
    .replace('{{EMAIL}}',      u.email      || '');
  res.send(html);
});

// ✅ Пример: защитена страница (само за логнати)
app.get('/profile', requireAuth, (req, res) => {
  res.send(`
    <h1>Профил</h1>
    <p>Потребител: <b>${req.session.user.username}</b></p>
    <p>Роля: <b>${req.session.user.role}</b></p>
    <p><a href="/logout">Изход</a></p>
  `);
});

// ✅ Admin панел (реален HTML файл)
app.get('/admin', requireAuth, requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// --- ЛОГИКА (API) ---
// 1) Кандидатстване (стар маршрут)
app.post('/api/apply', (req, res) => {
  const { firstName, lastName, email, phone, city, isAdult } = req.body;

  if (!firstName || !lastName || !email || !phone || !city || !isAdult) {
    return res.send('<h1>Моля попълнете всички полета.</h1><a href="/test-apply">Назад</a>');
  }

  const languages = JSON.stringify({
    en: req.body.lang_en || null,
    de: req.body.lang_de || null,
    ru: req.body.lang_ru || null,
    fr: req.body.lang_fr || null
  });

  const fullName = `${firstName} ${lastName}`;

  const sql = `
    INSERT INTO applications (full_name, email, phone, city, age_check, languages)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [fullName, email, phone, city, (isAdult === 'yes'), languages], (err) => {
    if (err) {
      console.error(err);
      return res.send('<h1>Грешка при изпращане. Моля опитайте отново.</h1><a href="/test-apply">Назад</a>');
    }

    return res.send(
      '<h1 style="color:green; text-align:center; margin-top:50px;">Успешно изпратихте вашата кандидатура!</h1>' +
      '<p style="text-align:center;"><a href="/">Върни се в началото</a></p>'
    );
  });
});

// 1б) Кандидатстване след тест → пренасочва към сертификат
app.post('/api/post-apply', requireAuth, cvUpload.single('cv'), (req, res) => {
  const { firstName, lastName, email, phone, city, isAdult, testCode, testScore, testDate, testName,
          motivation, hasExperience, experienceDetail, availFrom, availTo, driverLicense } = req.body;

  if (!firstName || !lastName || !email || !phone || !city || !isAdult) {
    return res.redirect('/post-test-apply?error=missing');
  }

  const languages = JSON.stringify({
    en: req.body.lang_en || null,
    de: req.body.lang_de || null,
    ru: req.body.lang_ru || null,
    fr: req.body.lang_fr || null,
    ro: req.body.lang_ro || null,
    tr: req.body.lang_tr || null
  });

  const skills = JSON.stringify({
    dance:  req.body.skill_dance  ? true : false,
    sport:  req.body.skill_sport  ? true : false,
    music:  req.body.skill_music  ? true : false,
    acting: req.body.skill_acting ? true : false,
    other:  req.body.skill_other  ? true : false
  });

  const fullName   = `${firstName} ${lastName}`;
  const code       = testCode || 'child';
  const score      = testScore || '0';
  const date       = testDate || new Date().toLocaleDateString('bg-BG');
  const test       = testName || '';
  const cvPath     = req.file ? req.file.filename : null;
  const availability = [availFrom, availTo].filter(Boolean).join(' - ') || null;

  const sql = `INSERT INTO applications
    (full_name, email, phone, city, age_check, languages, motivation, has_experience, experience_detail, availability, driver_license, skills, cv_filename)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    fullName, email, phone, city, (isAdult === 'yes'),
    languages,
    motivation || null,
    (hasExperience === 'yes') ? 1 : 0,
    experienceDetail || null,
    availability || null,
    (driverLicense === 'yes') ? 1 : 0,
    skills,
    cvPath
  ], (err) => {
    if (err) console.error('Application save error:', err.message);
    return res.redirect(
      `/result?code=${encodeURIComponent(code)}&name=${encodeURIComponent(fullName)}&test=${encodeURIComponent(test)}&score=${encodeURIComponent(score)}&date=${encodeURIComponent(date)}`
    );
  }); 
});

// 2) Регистрация (✅ човешки грешки)
app.post('/auth/register',  async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;

  if (!username || !first_name || !last_name || !email || !password) {
    return res.redirect('/register?error=missing');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (username, first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?, 'user')`;

    db.query(sql, [username, first_name, last_name, email, hashedPassword], (err) => {
      if (err) {
        console.error("REGISTER DB ERROR:", err);

        // ✅ ако username/email са заети
        if (err.code === 'ER_DUP_ENTRY') {
          const msg = (err.sqlMessage && err.sqlMessage.includes('users.email'))
            ? 'Този имейл вече е използван. Опитай с друг или влез в профила си.'
            : 'Това потребителско име вече е заето. Избери друго.';

          return res.redirect('/register?error=duplicate&msg=' + encodeURIComponent(msg));
        }

        return res.redirect('/register?error=server');
      }

      return res.redirect('/login?success=registered');
    });

  } catch (e) {
    console.error(e);
    return res.redirect('/register?error=server');
  }
});

// ✅ (3) Forgot password logic (НОВО)
app.post('/auth/forgot-password', async (req, res) => {
  const { username, email, newPassword, confirmPassword } = req.body;

  if (!username || !email || !newPassword || !confirmPassword) {
    return res.redirect('/forgot-password?error=missing');
  }

  if (newPassword !== confirmPassword) {
    return res.redirect('/forgot-password?error=nomatch');
  }

  try {
    const hash = await bcrypt.hash(newPassword, 10);

    const sql = `UPDATE users SET password=? WHERE username=? AND email=?`;
    db.query(sql, [hash, username, email], (err, result) => {
      if (err) {
        console.error(err);
        return res.redirect('/forgot-password?error=server');
      }

      if (result.affectedRows === 0) {
        return res.redirect('/forgot-password?error=notfound');
      }

      return res.redirect('/login?success=reset');
    });

  } catch (e) {
    console.error(e);
    return res.redirect('/forgot-password?error=server');
  }
});

// 3) Вход
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/login?error=missing');
  }

  const sql = `SELECT id, username, first_name, last_name, email, password, role FROM users WHERE username = ? LIMIT 1`;

  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.redirect('/login?error=server');
    }

    if (!results || results.length === 0) {
      return res.redirect('/login?error=invalid');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.redirect('/login?error=invalid');
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email,
      role: user.role
    };

    return res.redirect('/?success=login');
  });
}); 

// 4) Изход
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/?success=logout');
  });
});

app.get('/api/me', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ loggedIn: true, user: req.session.user });
  }
  return res.json({ loggedIn: false });
});

// --- Protected video routes (only for logged-in users) ---
function streamVideo(req, res, videoPath) {
  const fs = require('fs');
  if (!fsSync.existsSync(videoPath)) return res.status(404).send('Not found');
  const stat = fsSync.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = (end - start) + 1;
    const file = fsSync.createReadStream(videoPath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });
    file.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });
    fsSync.createReadStream(videoPath).pipe(res);
  }
}

app.get('/videos/child-animation.mp4', requireAuth, (req, res) => {
  streamVideo(req, res, path.join(__dirname, 'videos', 'child-animation.mp4'));
});

app.get('/videos/sport-animation.mp4', requireAuth, (req, res) => {
  streamVideo(req, res, path.join(__dirname, 'videos', 'sport-animation.mp4'));
});

app.get('/admin/api/users', requireAuth, requireAdmin, (req, res) => {
  const sql = `SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/admin/api/users/role', requireAuth, requireAdmin, (req, res) => {
  const { id, role } = req.body;
  if (!id || !['user', 'admin'].includes(role)) return res.json({ ok: false, error: 'Невалидни данни.' });
  if (id == req.session.user.id) return res.json({ ok: false, error: 'Не можеш да промениш собствената си роля.' });
  db.query(`UPDATE users SET role = ? WHERE id = ?`, [role, id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

app.delete('/admin/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  const id = req.params.id;
  if (id == req.session.user.id) return res.json({ ok: false, error: 'Не можеш да изтриеш собствения си акаунт.' });
  db.query(`DELETE FROM users WHERE id = ?`, [id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

app.get('/admin/api/applications', requireAuth, requireAdmin, (req, res) => {
  const sql = `SELECT id, full_name, email, phone, city, age_check, languages, created_at FROM applications ORDER BY created_at DESC`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.delete('/admin/api/applications/:id', requireAuth, requireAdmin, (req, res) => {
  db.query(`DELETE FROM applications WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

// --- ВЪПРОСИ ---
app.get('/admin/api/tests', requireAuth, requireAdmin, (req, res) => {
  db.query(`SELECT id, code, title FROM tests ORDER BY id`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/admin/api/questions/:testId', requireAuth, requireAdmin, (req, res) => {
  db.query(`SELECT * FROM questions WHERE test_id = ? ORDER BY id`, [req.params.testId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/admin/api/questions', requireAuth, requireAdmin, (req, res) => {
  const { test_id, question_text, option_a, option_b, option_c, option_d, correct_answer } = req.body;
  if (!test_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
    return res.json({ ok: false, error: 'Моля попълнете всички полета.' });
  }
  const sql = `INSERT INTO questions (test_id, question_text, option_a, option_b, option_c, option_d, correct_answer) VALUES (?,?,?,?,?,?,?)`;
  db.query(sql, [test_id, question_text, option_a, option_b, option_c, option_d, correct_answer], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

app.delete('/admin/api/questions/:id', requireAuth, requireAdmin, (req, res) => {
  db.query(`DELETE FROM questions WHERE id = ?`, [req.params.id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

// --- ПРАВИЛНИ ОТГОВОРИ ЗА ТЕСТОВЕТЕ ---
const TEST_ANSWERS = {
  child: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'b', q8:'a', q9:'a', q10:'a' },
  sport: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a', q6:'a', q7:'b', q8:'a', q9:'a', q10:'a' }
};

function scoreTest(testCode, body) {
  const correct = TEST_ANSWERS[testCode];
  const total = Object.keys(correct).length;
  let correctCount = 0;
  for (const [key, val] of Object.entries(correct)) {
    if (body[key] === val) correctCount++;
  }
  const scorePercent = Math.round((correctCount / total) * 100);
  return { correctCount, total, scorePercent, passed: scorePercent >= 70 };
}

app.post('/submit-child-test', requireAuth, (req, res) => {
  const result = scoreTest('child', req.body);
  const userId = req.session.user.id;
  const u = req.session.user;
  const date = new Date().toLocaleDateString('bg-BG');

  // Запис в БД ако е възможно (не блокира резултата)
  db.query(`SELECT id FROM tests WHERE code = 'child' LIMIT 1`, (err, rows) => {
    if (!err && rows && rows.length) {
      const testId = rows[0].id;
      db.query(
        `INSERT INTO results (user_id, test_id, score_percent, correct_count, total_count, passed) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, testId, result.scorePercent, result.correctCount, result.total, result.passed],
        (err2) => { if (err2) console.error('Резултат не е записан:', err2.message); }
      );
    }
  });

  if (result.passed) {
    return res.redirect(`/post-test-apply?code=child&test=${encodeURIComponent('Детска анимация')}&score=${result.scorePercent}&date=${encodeURIComponent(date)}`);
  } else {
    return res.redirect(`/child-test?fail=1&score=${result.correctCount}&total=${result.total}`);
  }
});

app.post('/submit-sport-test', requireAuth, (req, res) => {
  const result = scoreTest('sport', req.body);
  const userId = req.session.user.id;
  const u = req.session.user;
  const date = new Date().toLocaleDateString('bg-BG');

  // Запис в БД ако е възможно
  db.query(`SELECT id FROM tests WHERE code = 'sport' LIMIT 1`, (err, rows) => {
    if (!err && rows && rows.length) {
      const testId = rows[0].id;
      db.query(
        `INSERT INTO results (user_id, test_id, score_percent, correct_count, total_count, passed) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, testId, result.scorePercent, result.correctCount, result.total, result.passed],
        (err2) => { if (err2) console.error('Резултат не е записан:', err2.message); }
      );
    }
  });

  if (result.passed) {
    return res.redirect(`/post-test-apply?code=sport&test=${encodeURIComponent('Спортна анимация')}&score=${result.scorePercent}&date=${encodeURIComponent(date)}`);
  } else {
    return res.redirect(`/sport-test?fail=1&score=${result.correctCount}&total=${result.total}`);
  }
});

const PDFDocument = require('pdfkit');
const fs = require('fs');

// Страницата за резултат (HTML)
app.get('/result', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'result.html'));
});

// PDF Сертификат
app.get('/certificate/:testCode/download', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const testCode = req.params.testCode;

  const sql = `
    SELECT r.score_percent, r.created_at, u.username, u.first_name, u.last_name, t.title, t.code
    FROM results r
    JOIN users u ON u.id = r.user_id
    JOIN tests t ON t.id = r.test_id
    WHERE r.user_id = ? AND t.code = ? AND r.passed = 1
    ORDER BY r.created_at DESC
    LIMIT 1
  `;

  db.query(sql, [userId, testCode], (err, rows) => {
    if (err) return res.status(500).send('DB error');
    if (!rows.length) return res.status(403).send('Нямаш успешно преминат тест за този сертификат.');

    const data = rows[0];
    const dateStr = new Date(data.created_at).toLocaleDateString('bg-BG');
    const displayName = (data.first_name && data.last_name) ? `${data.first_name} ${data.last_name}` : data.username;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${data.code}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 60 });
    doc.pipe(res);

    // Регистрираме Windows шрифтове за кирилица
    const arialPath      = 'C:/Windows/Fonts/arial.ttf';
    const arialBoldPath  = 'C:/Windows/Fonts/arialbd.ttf';
    const arialItalPath  = 'C:/Windows/Fonts/ariali.ttf';
    const georgiaPath    = 'C:/Windows/Fonts/georgia.ttf';
    const georgiaBoldPath= 'C:/Windows/Fonts/georgiab.ttf';
    const segoeScriptPath= 'C:/Windows/Fonts/segoescb.ttf'; // Segoe Script Bold

    const hasArial   = fs.existsSync(arialPath);
    const hasGeorgia = fs.existsSync(georgiaBoldPath);
    const hasSig     = fs.existsSync(segoeScriptPath);

    if (hasArial) {
      doc.registerFont('CF',  arialPath);
      doc.registerFont('CFB', arialBoldPath);
      if (fs.existsSync(arialItalPath)) doc.registerFont('CFI', arialItalPath);
    }
    if (hasGeorgia) {
      doc.registerFont('CG',  georgiaPath);
      doc.registerFont('CGB', georgiaBoldPath);
    }
    if (hasSig) doc.registerFont('CSIG', segoeScriptPath);

    const F    = hasArial   ? 'CF'   : 'Helvetica';
    const FB   = hasArial   ? 'CFB'  : 'Helvetica-Bold';
    const FI   = (hasArial && fs.existsSync(arialItalPath)) ? 'CFI' : F;
    const FT   = hasGeorgia ? 'CGB'  : FB;   // Georgia Bold for title
    const FSIG = hasSig     ? 'CSIG' : FB;   // Segoe Script Bold for signature

    const W = 595, H = 842;
    const m = 30; // margin

    // Бял фон
    doc.rect(0, 0, W, H).fill('#ffffff');

    // Двойна рамка (double border)
    doc.rect(m, m, W - m*2, H - m*2).lineWidth(6).stroke('#1a1a1a');
    doc.rect(m+8, m+8, W - m*2 - 16, H - m*2 - 16).lineWidth(1.5).stroke('#1a1a1a');

    let y = m + 40;

    // Организация
    doc.font(FB).fontSize(9).fillColor('#1a1a1a')
       .text('CREWWAVE — ПРОФЕСИОНАЛНО ОБУЧЕНИЕ НА АНИМАТОРИ', m+20, y, { width: W - m*2 - 40, align: 'center', characterSpacing: 1 });

    y += 20;
    doc.moveTo(m+20, y).lineTo(W - m - 20, y).lineWidth(1).stroke('#1a1a1a');
    y += 16;

    // Заглавие СЕРТИФИКАТ — Georgia Bold (елегантен сериф, като HTML)
    doc.font(FT).fontSize(38).fillColor('#000000')
       .text('СЕРТИФИКАТ', m+20, y, { width: W - m*2 - 40, align: 'center', characterSpacing: 6 });
    y += 52;

    doc.moveTo(m+20, y).lineTo(W - m - 20, y).lineWidth(1).stroke('#1a1a1a');
    y += 28;

    // Номер
    const now = new Date(data.created_at);
    const certNum = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

    doc.font(F).fontSize(12).fillColor('#1a1a1a')
       .text(`№ ${certNum}`, m+40, y);
    doc.text(`от  ${dateStr}`, m+40, y, { width: W - m*2 - 80, align: 'right' });
    y += 32;

    // за преминато обучение по
    doc.font(F).fontSize(13).fillColor('#1a1a1a')
       .text('за преминато обучение по  »', m+40, y, { continued: true })
       .font(FB).text(` ${data.title} `, { continued: true })
       .font(F).text('«');
    y += 40;

    // на
    doc.font(F).fontSize(13).fillColor('#555')
       .text('на', m+40, y);
    y += 22;

    // Име
    const nameX = m + 40;
    const nameW = W - m*2 - 80;
    doc.font(FB).fontSize(22).fillColor('#000')
       .text(displayName, nameX, y, { width: nameW, align: 'center' });
    y += 28;
    doc.moveTo(nameX, y).lineTo(nameX + nameW, y).lineWidth(0.8).stroke('#333');
    y += 36;

    // Описание
    doc.font(F).fontSize(11).fillColor('#333')
       .text(
         `През периода на обучението кандидатът успешно завърши програмата по »${data.title}« с резултат ${data.score_percent}%.`,
         nameX, y, { width: nameW, align: 'justify', lineGap: 4 }
       );
    y += 56;

    // Подпис — същия ред като HTML: курсив → линия → Ръководител → CrewWave
    const sigX = W - m - 210;
    const sigW = 190;

    // 1. Ръкописен подпис "Вз" — Segoe Script Bold
    doc.font(FSIG).fontSize(36).fillColor('#1a1a1a')
       .text('Вз', sigX, H - m - 95, { width: sigW, align: 'center', lineBreak: false });

    // 2. Хоризонтална линия
    doc.moveTo(sigX, H - m - 50).lineTo(sigX + sigW, H - m - 50).lineWidth(0.8).stroke('#333');

    // 3. Надпис "Ръководител на обучението"
    doc.font(F).fontSize(9).fillColor('#333')
       .text('Ръководител на обучението', sigX, H - m - 42, { width: sigW, align: 'center' });

    // 4. Организация в курсив
    doc.font(FI).fontSize(9).fillColor('#555')
       .text('CrewWave', sigX, H - m - 27, { width: sigW, align: 'center' });

    doc.end();
  });
});

// Стар маршрут за обратна съвместимост (стар URL)
app.get('/certificate/:testCode', requireAuth, (req, res) => {
  res.redirect(`/certificate/${req.params.testCode}/download`);
});

// --- START ---
app.listen(PORT, () => {
  console.log(`🚀 Сървърът работи: http://localhost:${PORT}`);
  console.log('✅ Registered: /child-animation, /sport-animation, /child-test, /sport-test, /debug-routes');
});
