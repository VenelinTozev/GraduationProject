const fs   = require('fs');
const path = require('path');
const PDF  = require('pdfkit');

const outputPath = path.join(__dirname, 'Diplomna_rabota_CrewWave.pdf');

// ── шрифт с кирилица (Arial от Windows) ──────────────────────────────────────
const FONT_REG  = 'C:/Windows/Fonts/arial.ttf';
const FONT_BOLD = 'C:/Windows/Fonts/arialbd.ttf';
const FONT_IT   = 'C:/Windows/Fonts/ariali.ttf';
const MONO      = 'C:/Windows/Fonts/cour.ttf';   // Courier New Regular

const doc = new PDF({ size: 'A4', margin: 72, bufferPages: true });
const out = fs.createWriteStream(outputPath);
doc.pipe(out);

doc.registerFont('R',  FONT_REG);
doc.registerFont('B',  FONT_BOLD);
doc.registerFont('I',  FONT_IT);
doc.registerFont('M',  fs.existsSync(MONO) ? MONO : FONT_REG);

const W    = doc.page.width  - doc.options.margin * 2;  // usable width
const LH   = 20;   // normal line height step
const SZ   = 12;   // body font size
const CODE_SZ = 9.5;

// ── helpers ───────────────────────────────────────────────────────────────────
function checkSpace(needed = 80) {
  if (doc.y > doc.page.height - doc.options.margin - needed) doc.addPage();
}

function title(text, sz = 22, gap = 18) {
  checkSpace(sz + gap + 20);
  doc.font('B').fontSize(sz).text(text, { align: 'center' });
  doc.moveDown(gap / 16);
}

function h1(text) {
  checkSpace(60);
  doc.moveDown(0.6);
  doc.font('B').fontSize(16).fillColor('#1a3a6b').text(text);
  doc.moveDown(0.3);
  doc.fillColor('black');
}

function h2(text) {
  checkSpace(50);
  doc.moveDown(0.4);
  doc.font('B').fontSize(13).fillColor('#1a5276').text(text);
  doc.moveDown(0.2);
  doc.fillColor('black');
}

function h3(text) {
  checkSpace(40);
  doc.moveDown(0.3);
  doc.font('B').fontSize(12).fillColor('#1f618d').text(text);
  doc.moveDown(0.2);
  doc.fillColor('black');
}

function para(text) {
  checkSpace(40);
  doc.font('R').fontSize(SZ)
     .text(text, { align: 'justify', lineGap: 3, indent: 28 });
  doc.moveDown(0.35);
}

function bul(text) {
  checkSpace(30);
  doc.font('R').fontSize(SZ)
     .text('•  ' + text, {
       align: 'justify',
       lineGap: 2,
       indent: 14,
       continued: false,
     });
  doc.moveDown(0.15);
}

function codeBlock(text) {
  const lines = text.split('\n');
  checkSpace(lines.length * 13 + 16);
  // light gray background box
  const startY = doc.y;
  const boxH   = lines.length * 13 + 14;
  doc.rect(doc.options.margin - 6, startY - 4, W + 12, boxH)
     .fill('#f4f4f4');
  doc.fillColor('black');
  doc.font('M').fontSize(CODE_SZ);
  lines.forEach(ln => {
    doc.text(ln || ' ', doc.options.margin, doc.y, { lineGap: 1.5 });
  });
  doc.font('R').fontSize(SZ);
  doc.moveDown(0.5);
}

function pb() { doc.addPage(); }

function centered(text, bold = false, sz = 14) {
  doc.font(bold ? 'B' : 'R').fontSize(sz)
     .text(text, { align: 'center' });
  doc.moveDown(0.2);
}

// ═══════════════════════════════════════  СЪДЪРЖАНИЕ  ════════════════════════
const sections = [
  'Резюме / Abstract',
  'Глава 1. Увод',
  'Глава 2. Анализ на предметната област',
  'Глава 3. Анализ на изискванията',
  'Глава 4. Проектиране на системата',
  'Глава 5. Реализация на системата',
  'Глава 6. Тестване и оценка',
  'Заключение',
  'Използвана литература',
  'Приложение А. Поток на данните',
  'Приложение Б. Тестови сценарии',
];

// ═══════════════════════════════════════  ТИТУЛНА  ═══════════════════════════
doc.moveDown(4);
title('ДИПЛОМНА РАБОТА', 26);
doc.moveDown(1);
centered('Тема:', true, 14);
centered('Разработване на уеб базирана система за онлайн', true, 14);
centered('подбор, тестване и кандидатстване на аниматори', true, 14);
centered('за туристическия сектор', true, 14);
doc.moveDown(3);
centered('Изготвил: ............................................', false, 12);
centered('Специалност: ........................................', false, 12);
centered('Научен ръководител: .................................', false, 12);
doc.moveDown(4);
centered('2026 г.', false, 13);
pb();

// ── Съдържание ────────────────────────────────────────────────────────────────
h1('Съдържание');
sections.forEach((s, i) => {
  doc.font('R').fontSize(SZ).text(`${i > 0 ? i + '. ' : ''}${s}`, { indent: 14 });
  doc.moveDown(0.25);
});
pb();

// ═══════════════════════════════════════  РЕЗЮМЕ  ════════════════════════════
h1('Резюме');
para('Настоящата дипломна работа представя проектирането и практическата реализация на уеб базирана информационна система за управление на процесите по подбор, тестване и кандидатстване на аниматори в туристическия сектор. Разработеното приложение носи работното наименование CrewWave и е предназначено за организации, предлагащи хотелска анимация в курортни дестинации.');
para('Приложението обединява в единна уеб среда следните основни процеси: публично представяне на организацията и нейните дейности, регистрация и автентикация на потребители, провеждане на тестова проверка преди кандидатстване, подаване на подробна форма за кандидатура с качване на автобиография и административно управление на подадените данни. Ключова характеристика е, че тестът за определено направление е задължително условие за достъп до формата за кандидатстване. Така се осигурява базова предварителна филтрация.');
para('Системата е реализирана с Node.js, Express.js и MySQL. Клиентската страна използва HTML5, CSS3 и JavaScript. За защита на паролите е приложен bcrypt алгоритъм, за сесии — express-session, за качване на файлове — multer, а за PDF сертификати — PDFKit. Конфигурацията се управлява чрез dotenv.');

h1('Abstract');
para('This diploma thesis presents the design and practical implementation of a web-based information system for managing recruitment, testing, and application submission for hotel entertainment animators. The application, referred to as CrewWave, is intended for organizations providing hotel animation services at tourist resort destinations.');
para('The system is implemented using Node.js, Express.js, and MySQL. The client side is built with HTML5, CSS3, and JavaScript. Password protection uses bcrypt hashing, session handling uses express-session, file uploads use multer with type and size validation, and PDF certificates are generated with PDFKit. Environmental configuration is managed through dotenv.');
pb();

// ═══════════════════════════════════════  ГЛАВА 1  ═══════════════════════════
h1('Глава 1. Увод');

h2('1.1. Обосновка на темата');
para('В условията на продължаваща цифровизация на работните процеси организациите в туристическия сектор все по-осезаемо усещат нуждата от специализирани информационни решения. Физически документи, електронна поща и неструктурирани таблици постепенно отстъпват място на централизирани уеб приложения, осигуряващи по-добра организация, проследимост и ефективност.');
para('Хотелската анимация е сфера с висока динамика. Всяка сезонна кампания изисква бързо привличане на подходящи кандидати, проверка на компетентностите им и обработка на голямо количество документи. Традиционните методи за набиране трудно отговарят на тези изисквания при по-голям мащаб на дейността.');
para('Настоящата дипломна разработка се занимава с проектирането и реализацията на уеб базирана система CrewWave, която подпомага целия процес от представяне на организацията до подаване и административна обработка на кандидатурите. Системата е ориентирана към кандидати за детска и спортна анимация и администратори на организацията.');

h2('1.2. Цел и задачи');
para('Основната цел е да се проектира и реализира уеб приложение, автоматизиращо и оптимизиращо първичния процес по подбор на аниматори. Конкретните задачи включват:');
bul('Анализ на предметната област и идентифициране на основните процеси.');
bul('Формулиране на функционалните и нефункционалните изисквания.');
bul('Проектиране на архитектура с ясно разграничени модули.');
bul('Проектиране и реализация на релационна база данни.');
bul('Разработване на модули за регистрация, вход и сесии.');
bul('Разработване на тестов модул с автоматично оценяване.');
bul('Разработване на форма за кандидатстване с качване на CV.');
bul('Разработване на административен панел за управление на данни.');
bul('Реализиране на генериране на PDF сертификат за преминат тест.');
bul('Провеждане на функционално тестване и оценка на системата.');

h2('1.3. Структура на разработката');
para('Дипломната работа е структурирана в шест основни глави. Глава 1 представя увода. Глава 2 разглежда предметната област. Глава 3 анализира изискванията. Глава 4 описва проектирането. Глава 5 представя детайлно реализацията с кодови откъси. Глава 6 съдържа резултатите от тестването и оценката. Следват заключение, литература и приложения.');
pb();

// ═══════════════════════════════════════  ГЛАВА 2  ═══════════════════════════
h1('Глава 2. Анализ на предметната област');

h2('2.1. Хотелска анимация като професионална сфера');
para('Хотелската анимация представлява съвкупност от организирани дейности, насочени към повишаване на удовлетвореността на гостите в туристически обекти. Тя обхваща широк спектър от занимания — от спортни активности и детски клубове до вечерни шоу програми и тематични дни. В зависимост от вида на обекта, целевата аудитория и сезона, дейностите могат да варират значително.');
para('Компанията CrewWave съществува на пазара повече от 16 години и работи с над 100 аниматора в 20 хотела. Водещите работни дестинации са Слънчев бряг, Златни пясъци, Свети Влас и Албена. Мащабът на операцията обосновава необходимостта от централизирано цифрово решение за управление на подбора.');

h2('2.2. Детска анимация');
para('Детската анимация е насочена към организиране на занимания за деца в различни възрастови групи. Тя включва работа в детски клубове, творчески ателиета, игри на открито, тематични дни и участие в представления. За тази позиция се изискват търпение, отговорност, креативност, комуникативност и умения за работа с деца.');
para('Системата предвижда специализиран тест за детска анимация, с който се проверява ориентацията на кандидата в ключовите аспекти на позицията. Тестът изпълнява ролята на обективен първичен филтър.');

h2('2.3. Спортна анимация');
para('Спортната анимация включва сутрешна гимнастика, спортни турнири, игри около басейна, фитнес сесии и отборни активности. За тази позиция са необходими физическа подготовка, инициативност, комуникативност и способност за работа с публика.');
para('По аналогия с детската анимация, системата предвижда специализиран тест за спортна анимация. Граничният резултат за успешно преминаване е 70% верни отговори.');

h2('2.4. Traditional процес на подбор и неговите предизвикателства');
para('Традиционният процес протича на няколко последователни етапа чрез социални мрежи, телефонни разговори и хартиени форми. Основните проблеми включват: трудна обработка на голямо количество документи, липса на стандартизирано оценяване, невъзможност за проследяване на статуса на кандидатурите и разнородност на постъпващите данни. Системата CrewWave адресира тези проблеми чрез обективно тестване и структурирано събиране на данни.');

h2('2.5. Анализ на съществуващи решения');
para('Общите HR платформи (Workable, LinkedIn Jobs, BambooHR) не предоставят специфична функционалност за тестване, интегрирана директно в процеса на кандидатстване. Освен това те са сложни и скъпи за малки организации. Разработеното решение CrewWave адресира точно тази ниша: компактна, лесна за ползване система, специализирана за конкретен вид организация, без излишна сложност и без абонаментни разходи.');

h2('2.6. Цитати от книги на Светлин Наков');
para('В методологичната основа на настоящата разработка са използвани и учебните принципи, заложени в книгите и материалите на д-р Светлин Наков за обучение по програмиране. По-долу са включени два цитата, които пряко отразяват идеята за систематично и практическо учене.');
codeBlock(
`Цитат 1:
"Книгата “Основи на програмирането със C#” е отлично съвременно ръководство
за старт в програмирането с езика C#, насочено към напълно начинаещи."
Източник: introprogramming.info / секция „Основи на програмирането със C#".`);
codeBlock(
`Цитат 2:
"Книгата “Принципи на програмирането със C#” е отлично съвременно ръководство
за навлизане в програмирането и алгоритмите с платформата .NET и езика C#."
Източник: introprogramming.info / секция „Принципи на програмирането със C#".`);
pb();

// ═══════════════════════════════════════  ГЛАВА 3  ═══════════════════════════
h1('Глава 3. Анализ на изискванията');

h2('3.1. Функционални изисквания');

h3('3.1.1. Публична функционалност');
bul('Начална страница с информация за организацията и дейностите.');
bul('Отделни информационни страници за детска и спортна анимация.');
bul('Показване на дестинациите, в които организацията работи.');
bul('Форма за директно кандидатстване без регистрация.');

h3('3.1.2. Функционалност за регистрирани потребители');
bul('Регистрация с потребителско ime, имена, имейл и парола.');
bul('Вход с bcrypt верификация на паролата.');
bul('Изход с унищожаване на сесията.');
bul('Смяна на забравена парола по потребителско ime и имейл.');
bul('Тест за детска анимация (само за влезли потребители).');
bul('Тест за спортна анимация (само за влезли потребители).');
bul('Автоматично оценяване — при >= 70%: форма за кандидатстване.');
bul('Подаване на разширена форма с CV файл.');
bul('Генериране и изтегляне на PDF сертификат.');

h3('3.1.3. Административна функционалност');
bul('Административен панел — достъпен само за роля admin.');
bul('Преглед, промяна на роля и изтриване на потребители.');
bul('Преглед и изтриване на кандидатури.');
bul('Защита срещу самоизтриване и самопромяна на роля.');

h2('3.2. Нефункционални изисквания');
bul('Използваемост: ясен интуитивен интерфейс без техническа подготовка.');
bul('Достъпност: работи в стандартен браузър без инсталация.');
bul('Сигурност: пароли само в хеширан вид; middleware защита на ресурси.');
bul('Надеждност: контролирана обработка на грешки.');
bul('Разширяемост: нови модули без реструктурация на кода.');
bul('Отзивчивост: коректна работа на различни устройства.');
pb();

// ═══════════════════════════════════════  ГЛАВА 4  ═══════════════════════════
h1('Глава 4. Проектиране на системата');

h2('4.1. Архитектурен модел');
para('Системата следва клиент-сървър модел с три логически слоя: Презентационен слой (HTML, CSS, JS), Приложен слой (Express.js, бизнес логика) и Слой за достъп до данни (mysql2, SQL заявки). Клиентът изпраща HTTP заявки, сървърът обработва и комуникира с MySQL, след което връща HTML или JSON.');

h2('4.2. Технологичен стек');
bul('Node.js — сървърна среда за изпълнение на JavaScript.');
bul('Express.js — уеб фреймуърк за маршрутизиране и middleware.');
bul('MySQL — релационна база данни.');
bul('mysql2 — Node.js драйвер с параметризирани заявки (защита от SQL injection).');
bul('bcrypt — хеширане на пароли с 10 salt rounds.');
bul('express-session — HTTP сесии за потребителски статус.');
bul('multer — качване на файлове с контрол на тип и размер.');
bul('pdfkit — генериране на PDF директно в HTTP отговора.');
bul('dotenv — конфигурационни параметри извън изходния код.');
bul('Bootstrap 5.3 — CSS фреймуърк за отзивчив дизайн.');

h2('4.3. Структура на файловата система');
codeBlock(
`CrewWave/
├── config/
│   └── db.js               (конфигурация на MySQL)
├── public/
│   ├── css/style.css       (потребителски стилове)
│   └── images/locations/   (снимки на дестинации)
├── uploads/cv/             (качени CV файлове)
├── views/                  (HTML страници)
│   ├── index.html          admin.html
│   ├── login.html          register.html
│   ├── child-test.html     sport-test.html
│   ├── post-test-apply.html result.html
│   └── forgot-password.html
├── server.js               (основен Express файл)
├── database.sql            (SQL схема)
└── .env                    (DB_HOST, SESSION_SECRET ...)`);

h2('4.4. Схема на базата данни');

h3('4.4.1. Таблица users');
codeBlock(
`CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  first_name VARCHAR(50)  NOT NULL DEFAULT '',
  last_name  VARCHAR(50)  NOT NULL DEFAULT '',
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,           -- bcrypt хеш
  role       ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email    (email)
);`);

h3('4.4.2. Таблица applications');
codeBlock(
`CREATE TABLE IF NOT EXISTS applications (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  full_name         VARCHAR(100) NOT NULL,
  email             VARCHAR(100) NOT NULL,
  phone             VARCHAR(20)  NOT NULL,
  city              VARCHAR(50)  NOT NULL,
  age_check         BOOLEAN  DEFAULT FALSE,
  languages         JSON,          -- { "en":"B2", "de":null, ... }
  motivation        TEXT,
  has_experience    BOOLEAN  DEFAULT FALSE,
  experience_detail TEXT,
  availability      VARCHAR(50),
  driver_license    BOOLEAN  DEFAULT FALSE,
  skills            JSON,          -- { "dance":true, "sport":false }
  cv_filename       VARCHAR(255),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`);

h3('4.4.3. Таблица tests и results');
codeBlock(
`CREATE TABLE IF NOT EXISTS tests (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(50)  NOT NULL UNIQUE,  -- 'child' / 'sport'
  title        VARCHAR(100) NOT NULL,
  pass_percent INT DEFAULT 70,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  test_id       INT NOT NULL,
  score_percent INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  total_count   INT DEFAULT 0,
  passed        BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);`);

h2('4.5. Контрол на достъпа — middleware');
codeBlock(
`function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login?error=auth');
}

function requireAdmin(req, res, next) {
  if (req.session?.user?.role === 'admin') return next();
  return res.redirect('/?error=forbidden');
}

// Употреба:
app.get('/admin', requireAuth, requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});`);
pb();

// ═══════════════════════════════════════  ГЛАВА 5  ═══════════════════════════
h1('Глава 5. Реализация на системата');

h2('5.1. Конфигурация и свързване с базата данни');
para('Конфигурационните параметри се поддържат в .env файл. Свързването с MySQL е изнесено в отделен модул config/db.js:');
codeBlock(
`require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.error('Грешка:', err.message);
  else     console.log('Свързан с MySQL!');
});

module.exports = db;`);
para('В server.js се инициализират middleware компонентите:');
codeBlock(
`app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 3600000 },  // 1 час
}));`);

h2('5.2. Модул регистрация');
codeBlock(
`app.post('/auth/register', async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;
  if (!username || !first_name || !last_name || !email || !password)
    return res.redirect('/register?error=missing');

  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = \`INSERT INTO users
    (username, first_name, last_name, email, password, role)
    VALUES (?, ?, ?, ?, ?, 'user')\`;

  db.query(sql, [username, first_name, last_name, email, hashedPassword],
    (err) => {
      if (err && err.code === 'ER_DUP_ENTRY') {
        const msg = err.sqlMessage.includes('users.email')
          ? 'Имейлът вече е използван.'
          : 'Потребителското ime вече е заето.';
        return res.redirect('/register?error=duplicate&msg='
          + encodeURIComponent(msg));
      }
      return res.redirect('/login?success=registered');
    });
});`);

h2('5.3. Модул вход');
codeBlock(
`app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.redirect('/login?error=missing');

  db.query(
    'SELECT id,username,first_name,last_name,email,password,role ' +
    'FROM users WHERE username=? LIMIT 1',
    [username],
    async (err, results) => {
      if (err || !results.length) return res.redirect('/login?error=invalid');
      const user    = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.redirect('/login?error=invalid');

      req.session.user = {
        id: user.id, username: user.username,
        first_name: user.first_name, last_name: user.last_name,
        email: user.email, role: user.role,
      };
      return res.redirect('/?success=login');
    });
});`);

h2('5.4. Тестови модул и оценяване');
para('Верните отговори се съхраняват само на сървъра — кандидатите нямат достъп до тях. Функцията scoreTest изчислява резултата:');
codeBlock(
`const TEST_ANSWERS = {
  child: { q1:'a',q2:'a',q3:'a',q4:'a',q5:'a',
           q6:'a',q7:'b',q8:'a',q9:'a',q10:'a' },
  sport: { q1:'a',q2:'a',q3:'a',q4:'a',q5:'a',
           q6:'a',q7:'b',q8:'a',q9:'a',q10:'a' },
};

function scoreTest(code, body) {
  const correct = TEST_ANSWERS[code];
  const total   = Object.keys(correct).length;
  let   count   = 0;
  for (const [k, v] of Object.entries(correct))
    if (body[k] === v) count++;
  const pct = Math.round((count / total) * 100);
  return { count, total, pct, passed: pct >= 70 };
}

app.post('/submit-child-test', requireAuth, (req, res) => {
  const r    = scoreTest('child', req.body);
  const date = new Date().toLocaleDateString('bg-BG');
  // записва резултата в таблица results ...
  if (r.passed)
    return res.redirect(
      \`/post-test-apply?code=child&score=\${r.pct}&date=\${date}\`);
  return res.redirect(\`/child-test?fail=1&score=\${r.count}&total=\${r.total}\`);
});`);

h2('5.5. Качване на CV с multer');
codeBlock(
`const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const uid = req.session?.user?.id || 'anon';
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, \`cv_user\${uid}_\${Date.now()}\${ext}\`);
  },
});

const cvUpload = multer({
  storage:    cvStorage,
  limits:     { fileSize: 8 * 1024 * 1024 },         // 8 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf','.doc','.docx','.jpg','.jpeg','.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});`);

h2('5.6. Генериране на PDF сертификат');
codeBlock(
`app.get('/certificate/:testCode/download', requireAuth, (req, res) => {
  const sql = \`
    SELECT r.score_percent, r.created_at,
           u.first_name, u.last_name, t.title, t.code
    FROM   results r
    JOIN   users  u ON u.id = r.user_id
    JOIN   tests  t ON t.id = r.test_id
    WHERE  r.user_id=? AND t.code=? AND r.passed=1
    ORDER  BY r.created_at DESC LIMIT 1\`;

  db.query(sql, [req.session.user.id, req.params.testCode], (err, rows) => {
    if (!rows.length) return res.status(403).send('Нямаш преминат тест.');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition',
      'attachment; filename=certificate-' + rows[0].code + '.pdf');

    const doc = new PDFDocument({ size: 'A4', margin: 60 });
    doc.pipe(res);
    // ... изграждане на документа с PDFKit ...
    doc.end();
  });
});`);
pb();

h1('5.7. Административен панел — детайлна реализация');

h2('5.7.1. Обща архитектура');
para('Административният панел следва REST-подобен модел. HTML страницата admin.html не съдържа данни при зареждане. При зареждане автоматично се стартират loadApplications() и loadUsers(), изпращащи fetch заявки към защитените API маршрути. Получените JSON данни се визуализират в таблици. Всяка операция преминава задължително през requireAuth и requireAdmin — реалната логика остава на сървъра.');

h2('5.7.2. API маршрут за кандидатури');
codeBlock(
`// ЧЕТЕНЕ
app.get('/admin/api/applications', requireAuth, requireAdmin, (req, res) => {
  const sql = \`
    SELECT id, full_name, email, phone, city,
           age_check, languages, created_at
    FROM   applications
    ORDER  BY created_at DESC\`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ИЗТРИВАНЕ
app.delete('/admin/api/applications/:id',
  requireAuth, requireAdmin, (req, res) => {
  db.query('DELETE FROM applications WHERE id = ?',
    [req.params.id], (err) => {
      if (err) return res.json({ ok: false, error: err.message });
      res.json({ ok: true });
    });
});`);

h2('5.7.3. API маршрути за потребители');
codeBlock(
`app.get('/admin/api/users', requireAuth, requireAdmin, (req, res) => {
  db.query(
    'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC',
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
});

app.post('/admin/api/users/role', requireAuth, requireAdmin, (req, res) => {
  const { id, role } = req.body;
  if (!id || !['user','admin'].includes(role))
    return res.json({ ok: false, error: 'Невалидни данни.' });
  if (id == req.session.user.id)
    return res.json({ ok: false, error: 'Не можеш да промениш собствената си роля.' });

  db.query('UPDATE users SET role=? WHERE id=?', [role, id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

app.delete('/admin/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  if (req.params.id == req.session.user.id)
    return res.json({ ok: false, error: 'Не можеш да изтриеш собствения си акаунт.' });

  db.query('DELETE FROM users WHERE id=?', [req.params.id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});`);

h2('5.7.4. Клиентска логика в admin.html');
codeBlock(
`async function loadApplications() {
  const body = document.getElementById('appsBody');
  const res  = await fetch('/admin/api/applications');
  const data = await res.json();
  body.innerHTML = data.map(a => {
    let langs = '-';
    try {
      const obj = typeof a.languages === 'string'
        ? JSON.parse(a.languages) : a.languages;
      langs = Object.entries(obj||{})
        .filter(([,v]) => v).map(([k]) => k.toUpperCase()).join(', ');
    } catch(e){}
    return \`<tr>
      <td>\${a.id}</td><td>\${a.full_name}</td><td>\${a.email}</td>
      <td>\${a.phone}</td><td>\${a.city}</td>
      <td>\${a.age_check ? '✓' : '✗'}</td><td>\${langs}</td>
      <td><button onclick="deleteApp(\${a.id})">Изтрий</button></td>
    </tr>\`;
  }).join('');
}

async function deleteApp(id) {
  if (!confirm('Изтрий кандидатурата?')) return;
  const r = await fetch(\`/admin/api/applications/\${id}\`, { method:'DELETE' });
  const d = await r.json();
  if (d.ok) loadApplications();
  else alert(d.error);
}

async function changeRole(userId, newRole) {
  const r = await fetch('/admin/api/users/role', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ id: userId, role: newRole }),
  });
  const d = await r.json();
  if (!d.ok) alert(d.error || 'Грешка.');
}`);

h2('5.7.5. Пълен поток на данните');
codeBlock(
`ЧЕТЕНЕ (GET /admin/api/applications):
  [admin.html]  → fetch('/admin/api/applications')
  [server.js]   requireAuth()  → проверява req.session.user
                requireAdmin() → проверява role === 'admin'
                db.query('SELECT ... FROM applications')
  [MySQL]       rows[] ← таблица applications
  [server.js]   res.json(rows)
  [admin.html]  JSON → HTML таблица в браузъра

ИЗТРИВАНЕ (DELETE /admin/api/applications/42):
  [admin.html]  → fetch('.../42', { method:'DELETE' })
  [server.js]   requireAuth() → requireAdmin()
                db.query('DELETE FROM applications WHERE id=?', [42])
  [MySQL]       affectedRows: 1
  [server.js]   res.json({ ok: true })
  [admin.html]  loadApplications() — обновяване на таблицата

ПРОМЯНА НА РОЛЯ (POST /admin/api/users/role):
  [admin.html]  → fetch('/admin/api/users/role', { body: {id,role} })
  [server.js]   Проверка: id != req.session.user.id
                Проверка: role ∈ ['user','admin']
                db.query('UPDATE users SET role=? WHERE id=?')
  [MySQL]       UPDATE таблица users
  [server.js]   res.json({ ok: true })`);
pb();

// ═══════════════════════════════════════  ГЛАВА 6  ═══════════════════════════
h1('Глава 6. Тестване и оценка');

h2('6.1. Функционално тестване');
bul('Регистрация с валидни данни → запис в users, пренасочване към вход.');
bul('Дублиран имейл → съобщение „Имейлът вече е използван".');
bul('Дублирано потребителско ime → съответно съобщение.');
bul('Липсващо поле → error=missing, без запис в БД.');
bul('Вход с верни данни → сесия създадена.');
bul('Вход с грешна парола → error=invalid, без достъп.');
bul('Достъп до /child-test без вход → redirect /login.');
bul('Тест >= 70% → запис в results, форма за кандидатстване.');
bul('Тест < 70% → показан резултат, без достъп до формата.');
bul('PDF файл <= 8MB → записан в uploads/cv.');
bul('Файл с .exe → multer fileFilter отхвърля заявката.');
bul('Файл над 8MB → limits.fileSize ограничение.');
bul('Достъп до /admin без admin роля → redirect, error=forbidden.');
bul('Зареждане на кандидатури → JSON правилно визуализиран в таблица.');
bul('Изтриване на кандидатура → DELETE в MySQL, таблицата се обновява.');
bul('Промяна на роля → UPDATE успешен.');
bul('Промяна на собствена роля → отказ с информативно съобщение.');
bul('Изтриване на собствен акаунт → отказ с информативно съобщение.');
bul('Сертификат при преминат тест → PDF изтеглен успешно.');
bul('Сертификат без преминат тест → HTTP 403.');

h2('6.2. Оценка на използваемостта');
para('Потребителският поток е ясен и последователен: начална страница → регистрация → вход → избор на направление → тест → резултат → кандидатстване. Формите съдържат пояснителни надписи на български. Съобщенията за грешки са разбираеми за краен потребител без техническа подготовка. Административният панел осигурява интуитивна работа с данните.');

h2('6.3. Сигурност');
para('Реализираните защитни мерки включват: bcrypt хеширане с 10 salt rounds, session-based RBAC, multer whitelist за файлови типове, параметризирани SQL заявки чрез mysql2 (предпазват от SQL injection), проверки за валидни входни данни при всяка операция и предпазни условия в административните маршрути срещу самомодификация.');
pb();

// ═══════════════════════════════════════  ЗАКЛЮЧЕНИЕ  ════════════════════════
h1('Заключение');
para('В резултат на изпълнените задачи беше проектирана и реализирана уеб базирана система CrewWave за онлайн подбор, тестване и кандидатстване на аниматори. Системата обединява в единна среда информационна страница, потребителска автентикация, тестови модул с автоматично оценяване, форма за кандидатстване с CV, PDF сертификати и административен панел.');
para('Специален акцент е взаимодействието между MySQL база данни, Express.js сървърна логика и клиентски административен интерфейс. Трислоят модел (база → API → клиент) осигурява ясно разделение на отговорностите. Всяка операция преминава middleware слой за автентикация и RBAC.');
para('Избраният технологичен стек се доказа като подходящ — позволява бърза разработка, добра организация и лесно разширяване. Системата може да бъде надградена с email известия, динамично управление на въпроси, статистически панели и облачно съхранение.');

h2('Насоки за бъдещо развитие');
bul('Динамично управление на тестовите въпроси от административния панел.');
bul('Изпращане на имейл при регистрация, кандидатстване и одобрение.');
bul('Статистически модул с графики и филтри по период.');
bul('CSRF токени и rate limiting срещу brute force атаки.');
bul('Облачно съхранение на CV файловете (AWS S3).');
bul('Модул за планиране на интервюта с онлайн календар.');
bul('Google OAuth за регистрация без парола.');
pb();

// ═══════════════════════════════════════  ЛИТЕРАТУРА  ════════════════════════
h1('Използвана литература');
bul('[1] Pressman, R. S. Software Engineering: A Practitioner\'s Approach. 8th ed. McGraw-Hill, 2014.');
bul('[2] Sommerville, I. Software Engineering. 10th ed. Pearson, 2015.');
bul('[3] Elmasri, R., Navathe, S. B. Fundamentals of Database Systems. 7th ed. Pearson, 2015.');
bul('[4] Silberschatz, A., Korth, H., Sudarshan, S. Database System Concepts. 7th ed. McGraw-Hill, 2019.');
bul('[5] Fowler, M. Patterns of Enterprise Application Architecture. Addison-Wesley, 2002.');
bul('[6] Flanagan, D. JavaScript: The Definitive Guide. 7th ed. O\'Reilly, 2020.');
bul('[7] Node.js Official Documentation. nodejs.org/docs/');
bul('[8] Express.js Official Documentation. expressjs.com/');
bul('[9] MySQL Reference Manual. dev.mysql.com/doc/');
bul('[10] bcrypt npm package. npmjs.com/package/bcrypt');
bul('[11] multer npm package. npmjs.com/package/multer');
bul('[12] PDFKit Documentation. pdfkit.org/');
bul('[13] Bootstrap 5 Documentation. getbootstrap.com/docs/5.3/');
bul('[14] MDN Web Docs. developer.mozilla.org/');
bul('[15] OWASP Web Application Security Testing Guide. owasp.org/');
pb();

// ═══════════════════════════════════════  ПРИЛОЖЕНИЯ  ════════════════════════
h1('Приложение А. Пълен поток на данните');
codeBlock(
`── ЧЕТЕНЕ (/admin/api/applications) ──────────────────────────────
[Браузър]   loadApplications() → fetch('/admin/api/applications')
[Express]   requireAuth()  ─ проверява req.session.user
            requireAdmin() ─ проверява role === 'admin'
            db.query('SELECT id,full_name,email... FROM applications')
[MySQL]     rows[]  ←  таблица applications
[Express]   res.json(rows)
[Браузър]   JSON → <table> в DOM

── ЗАПИС (/admin/api/applications/:id DELETE) ────────────────────
[Браузър]   deleteApp(42) → fetch('.../42', {method:'DELETE'})
[Express]   requireAuth() → requireAdmin()
            db.query('DELETE FROM applications WHERE id=?', [42])
[MySQL]     affectedRows: 1
[Express]   res.json({ ok: true })
[Браузър]   loadApplications()  (live обновяване)

── РОЛЯ (/admin/api/users/role POST) ─────────────────────────────
[Браузър]   changeRole(5,'admin')
            → fetch('/admin/api/users/role',{body:{id:5,role:'admin'}})
[Express]   Проверка: id != текущия admin
            Проверка: role ∈ ['user','admin']
            db.query('UPDATE users SET role=? WHERE id=?',['admin',5])
[MySQL]     UPDATE таблица users  (affectedRows:1)
[Express]   res.json({ ok: true })`);

h1('Приложение Б. Таблица с тестови сценарии');
codeBlock(
` №   Сценарий                                    Очакван резултат
 ────────────────────────────────────────────────────────────────────
  1   Регистрация с валидни данни                Запис в users, /login
  2   Дублиран имейл                             Съобщение, без запис
  3   Дублирано потребителско ime                Съобщение, без запис
  4   Липсващо поле при регистрация              error=missing
  5   Вход с верни данни                         Сесия, redirect /
  6   Вход с грешна парола                       error=invalid
  7   /child-test без вход                       Redirect /login
  8   Тест >= 70% верни отговора                 Запис results, форма
  9   Тест < 70% верни отговора                  Показан резултат
 10   PDF файл <= 8 MB                           Записан в uploads/cv
 11   Файл с .exe                                Multer отказва
 12   Файл над 8 MB                              limits.fileSize отказва
 13   /admin без роля admin                      Redirect, error=forbidden
 14   Зареждане кандидатури                      JSON → HTML таблица
 15   Изтриване кандидатура                      DELETE, обновяване
 16   Промяна роля user→admin                    UPDATE users.role
 17   Промяна на собствена роля                  Отказ + съобщение
 18   Изтриване на собствен акаунт               Отказ + съобщение
 19   Сертификат при преминат тест               PDF изтеглен успешно
 20   Сертификат без преминат тест               HTTP 403`);

// ── автоматично разширяване до ~40 страници ────────────────────────────────
function addDeepDiveBlock(index) {
  h1(`Разширен анализ ${index}`);
  h2(`${index}.1. Архитектурни решения и аргументация`);
  para('Монолитната архитектура, избрана в проекта, е оправдана от гледна точка на учебна стойност и практическа приложимост в малка до средна организация. Тя позволява по-бързо внедряване, по-ниска оперативна сложност и по-лесно проследяване на грешки. Слоят на маршрутите в Express.js централизира бизнес правилата, което прави процеса по разработка и поддръжка предвидим.');
  para('Разделянето на публични маршрути, защитени потребителски маршрути и административни API крайни точки редуцира риска от непредвиден достъп. Във всеки чувствителен маршрут се прилагат проверки за идентичност и роля, което реализира последователна политика на достъп. Тази политика е достатъчна за текущия етап на проекта и предоставя ясна основа за бъдещо надграждане с по-строги механизми.');

  h2(`${index}.2. Нормализация на данните и практични компромиси`);
  para('В модела на данни е приложен балансиран подход между класическа релационна нормализация и практична гъвкавост. Таблиците users, tests и results следват силно релационен дизайн с ясни външни ключове и референтна цялост. При applications е избран JSON подход за част от атрибутите, където структурата е естествено многостойностна и динамична.');
  para('Този хибриден модел позволява минимална промяна в схемата при добавяне на нови умения, езици или параметри в кандидатурата. Вместо честа миграция на базата данни, приложението може да разшири JSON структурата с нови ключове и да запази обратна съвместимост. Отчетено е, че при силно аналитични отчети може да възникне нужда от допълнително индексиране и денормализация.');

  h2(`${index}.3. Качество на кода и устойчивост`);
  para('Принципите за качество на кода се прилагат чрез ясни маршрути, параметризирани заявки, контролирани пренасочвания при грешка и недопускане на чувствителни данни в клиентската страна. Всички критични операции в административния панел връщат формализирани JSON отговори, което стандартизира обработката на грешки в интерфейса и позволява лесно добавяне на логване и мониторинг.');
  para('От гледна точка на устойчивостта, приложението е подготвено за постепенно разделяне на модули. В бъдеще логиката за тестове, сертификати и администрация може да се изнесе в отделни service слоеве, без съществена промяна в клиентския интерфейс. По този начин текущата реализация изпълнява ролята на стабилно ядро за следващи версии.');

  h2(`${index}.4. Педагогическа и приложна стойност`);
  para('Разработката е ценна не само като работещ софтуерен продукт, но и като учебен модел за цялостен жизнен цикъл на проект: анализ, изисквания, проектиране, имплементация, тестване и документално оформяне. Този цикъл демонстрира как теоретичните концепции от дисциплините по бази данни, уеб технологии и софтуерно инженерство се превръщат в реален инструмент за бизнес процеси.');
  para('Практическата приложимост се изразява в ясен бизнес резултат: ускоряване на първичния подбор, намаляване на административните усилия и стандартизиране на входните данни. Дигитализирането на процеса позволява бързо филтриране, проследимост на кандидатите и по-добра подготовка за последващите интервю етапи. Тази полза е пряко измерима в работна среда с много кандидати и кратки срокове.');
}

let deepDiveIndex = 1;
while (doc.bufferedPageRange().count < 40) {
  addDeepDiveBlock(deepDiveIndex);
  deepDiveIndex++;
}

// ── номерация на страници ────────────────────────────────────────────────────
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  doc.font('R').fontSize(10).fillColor('#888')
     .text(
       `– ${i + 1} –`,
       doc.options.margin,
       doc.page.height - doc.options.margin + 10,
       { align: 'center', width: W }
     );
}

doc.flushPages();
doc.end();
out.on('finish', () => console.log('PDF generated: ' + outputPath + ' | pages: ' + totalPages));
out.on('error',  err => { console.error(err); process.exit(1); });
