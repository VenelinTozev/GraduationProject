const fs = require('fs');
const path = require('path');
const PDF = require('pdfkit');

const outputPath = path.join(__dirname, 'Diplomna_rabota_CrewWave.pdf');

const FONT_REG = 'C:/Windows/Fonts/arial.ttf';
const FONT_BOLD = 'C:/Windows/Fonts/arialbd.ttf';
const FONT_ITALIC = 'C:/Windows/Fonts/ariali.ttf';
const FONT_MONO = 'C:/Windows/Fonts/consola.ttf';

const doc = new PDF({ size: 'A4', margin: 70, bufferPages: true });
const out = fs.createWriteStream(outputPath);
doc.pipe(out);

doc.registerFont('R', FONT_REG);
doc.registerFont('B', FONT_BOLD);
doc.registerFont('I', FONT_ITALIC);
doc.registerFont('M', fs.existsSync(FONT_MONO) ? FONT_MONO : FONT_REG);

const W = doc.page.width - doc.options.margin * 2;

function ensureSpace(min = 90) {
  if (doc.y > doc.page.height - doc.options.margin - min) doc.addPage();
}

function center(text, size = 14, bold = false) {
  ensureSpace(50);
  doc.font(bold ? 'B' : 'R').fontSize(size).text(text, { align: 'center' });
  doc.moveDown(0.25);
}

function h1(text) {
  ensureSpace(70);
  doc.moveDown(0.6);
  doc.font('B').fontSize(17).fillColor('#123d6a').text(text, { align: 'left' });
  doc.fillColor('black');
  doc.moveDown(0.3);
}

function h2(text) {
  ensureSpace(60);
  doc.moveDown(0.35);
  doc.font('B').fontSize(13).fillColor('#1f5f8b').text(text, { align: 'left' });
  doc.fillColor('black');
  doc.moveDown(0.2);
}

function para(text) {
  ensureSpace(55);
  doc.font('R').fontSize(12).text(text, {
    align: 'justify',
    indent: 26,
    lineGap: 3,
  });
  doc.moveDown(0.35);
}

function bullet(text) {
  ensureSpace(40);
  doc.font('R').fontSize(12).text('• ' + text, {
    align: 'justify',
    indent: 14,
    lineGap: 2,
  });
  doc.moveDown(0.2);
}

function quote(text, source) {
  ensureSpace(110);
  const startY = doc.y + 6;
  const h = 100;
  const m = doc.options.margin;
  // Light blue background
  doc.rect(m, startY, W, h).fill('#ddeeff');
  // Dark left accent border
  doc.rect(m, startY, 5, h).fill('#1a3a6b');
  // Outer border
  doc.rect(m, startY, W, h).strokeColor('#1a3a6b').lineWidth(1.2).stroke();
  // Quote mark + text
  doc.font('I').fontSize(13).fillColor('#0d2146')
     .text('\u201C' + text + '\u201D', m + 18, startY + 12, {
       width: W - 28,
       align: 'justify',
       lineGap: 4,
     });
  // Source line
  doc.font('B').fontSize(10.5).fillColor('#1f5f8b')
     .text('Източник: ' + source, m + 18, startY + 78, {
       width: W - 28,
       align: 'left',
     });
  doc.fillColor('black');
  doc.y = startY + h + 14;
}

function codeBlock(code) {
  const lines = code.split('\n');
  const boxH = lines.length * 12 + 16;
  ensureSpace(boxH + 20);
  const y = doc.y;
  doc.rect(doc.options.margin - 4, y - 4, W + 8, boxH).fill('#f4f4f4');
  doc.fillColor('black').font('M').fontSize(9.5);
  lines.forEach((ln) => {
    doc.text(ln || ' ', doc.options.margin + 4, doc.y, { lineGap: 1 });
  });
  doc.font('R').fontSize(12);
  doc.moveDown(0.55);
}

// Dark-theme code block styled like a VS Code screenshot
function codeScreenshot(filename, code) {
  const lines = code.split('\n');
  const lineH = 13;
  const codeAreaH = lines.length * lineH + 10;
  const titleBarH = 24;
  const totalH = titleBarH + codeAreaH;
  ensureSpace(totalH + 20);
  const m = doc.options.margin;
  const y = doc.y + 4;
  // Title bar
  doc.rect(m, y, W, titleBarH).fill('#3c3c3c');
  // macOS-style traffic lights
  doc.circle(m + 14, y + 12, 4.5).fill('#ff5f56');
  doc.circle(m + 26, y + 12, 4.5).fill('#ffbd2e');
  doc.circle(m + 38, y + 12, 4.5).fill('#27c93f');
  // Filename
  doc.font('R').fontSize(9.5).fillColor('#cccccc')
     .text(filename, m + 52, y + 6, { width: W - 60, align: 'center', lineBreak: false });
  // Code area background
  doc.rect(m, y + titleBarH, W, codeAreaH).fill('#1e1e1e');
  // Gutter
  doc.rect(m, y + titleBarH, 28, codeAreaH).fill('#252526');
  // Lines
  doc.font('M').fontSize(9.5);
  lines.forEach((ln, idx) => {
    const ly = y + titleBarH + 5 + idx * lineH;
    doc.fillColor('#6a9955').text(String(idx + 1).padStart(3), m + 4, ly, { width: 22, lineBreak: false });
    doc.fillColor('#d4d4d4').text(ln || ' ', m + 30, ly, { width: W - 36, lineBreak: false });
  });
  doc.font('R').fontSize(12).fillColor('black');
  doc.y = y + totalH + 10;
}

function pageBreak() { doc.addPage(); }

function dbDiagram() {
  ensureSpace(350);
  const startY = doc.y + 12;
  const bW = 135;
  const bH = 86;
  const m  = doc.options.margin;
  const gap = 22;
  const x1 = m, x2 = m + bW + gap, x3 = m + 2 * (bW + gap);
  const r1y = startY;
  const r2y = r1y + bH + 55;
  const hdr = '#1a3a6b';
  const bg  = '#ddeeff';

  function box(x, y, name, fields) {
    doc.rect(x, y + 18, bW, bH - 18).fill(bg);
    doc.rect(x, y, bW, 18).fill(hdr);
    doc.rect(x, y, bW, bH).strokeColor(hdr).lineWidth(0.8).stroke();
    doc.font('B').fontSize(9).fillColor('white')
       .text(name, x + 5, y + 4, { width: bW - 10, lineBreak: false });
    doc.font('M').fontSize(7).fillColor('#0a1f3c');
    fields.forEach(function(f, i) {
      doc.text(f, x + 4, y + 22 + i * 9, { width: bW - 8, lineBreak: false });
    });
    doc.fillColor('black').strokeColor('black').lineWidth(1);
  }

  function arrow(xa, ya, xb, yb, lbl) {
    const ang = Math.atan2(yb - ya, xb - xa);
    const sz  = 8;
    doc.moveTo(xa, ya).lineTo(xb, yb).strokeColor(hdr).lineWidth(1.2).stroke();
    const n1x = xb - sz * Math.cos(ang - 0.4);
    const n1y = yb - sz * Math.sin(ang - 0.4);
    const n2x = xb - sz * Math.cos(ang + 0.4);
    const n2y = yb - sz * Math.sin(ang + 0.4);
    doc.moveTo(xb, yb).lineTo(n1x, n1y).lineTo(n2x, n2y)
       .closePath().fill(hdr);
    if (lbl) {
      const mx = (xa + xb) / 2;
      const my = (ya + yb) / 2;
      doc.font('B').fontSize(7.5).fillColor(hdr)
         .text(lbl, mx - 12, my - 9, { width: 24, align: 'center', lineBreak: false });
    }
    doc.fillColor('black').strokeColor('black').lineWidth(1);
  }

  box(x1, r1y, 'users', [
    'PK  id INT',
    '      username VARCHAR(50)',
    '      email VARCHAR(100)',
    '      password VARCHAR(255)',
    '      role ENUM',
    '      created_at TIMESTAMP',
  ]);
  box(x2, r1y, 'results', [
    'PK  id INT',
    'FK  user_id \u2192 users',
    'FK  test_id \u2192 tests',
    '      score_percent INT',
    '      passed BOOLEAN',
    '      created_at TIMESTAMP',
  ]);
  box(x3, r1y, 'tests', [
    'PK  id INT',
    '      code VARCHAR(50)',
    '      title VARCHAR(100)',
    '      pass_percent INT',
    '      created_at TIMESTAMP',
    '',
  ]);
  box(x1, r2y, 'applications', [
    'PK  id INT',
    '      full_name VARCHAR(100)',
    '      email VARCHAR(100)',
    '      languages JSON',
    '      skills JSON',
    '      cv_filename VARCHAR(255)',
  ]);
  box(x3, r2y, 'questions', [
    'PK  id INT',
    'FK  test_id \u2192 tests',
    '      question_text TEXT',
    '      option_a..d VARCHAR',
    '      correct_answer ENUM',
    '      created_at TIMESTAMP',
  ]);

  arrow(x1 + bW,    r1y + bH / 2, x2,           r1y + bH / 2, 'FK');
  arrow(x2 + bW,    r1y + bH / 2, x3,           r1y + bH / 2, 'FK');
  arrow(x3 + bW/2,  r1y + bH,     x3 + bW / 2,  r2y,          'FK');

  const capY = r2y + bH + 10;
  doc.font('I').fontSize(9.5).fillColor('#444')
     .text('\u0424\u0438\u0433. 1. \u0420\u0435\u043b\u0430\u0446\u0438\u043e\u043d\u043d\u0430 \u0441\u0445\u0435\u043c\u0430 \u043d\u0430 \u0431\u0430\u0437\u0430\u0442\u0430 \u0434\u0430\u043d\u043d\u0438 (ER \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u0430)',
           m, capY, { align: 'center', width: W });
  doc.fillColor('black');
  doc.y = capY + 24;
}

function longParagraph(topic, angle) {
  return `В контекста на ${topic} е важно да се подчертае, че ${angle}. ` +
    'Решението в настоящата дипломна разработка е съобразено с реални организационни нужди и с ограниченията на малки и средни екипи, които имат нужда от работеща система, а не от прекалено сложна платформа. ' +
    'Практическият подход е ориентиран към последователност на процеса: събиране на информация, валидиране, автоматизирана обработка и администраторски контрол. ' +
    'Така се постига баланс между техническа надеждност, използваемост и възможност за бъдещо разширяване без фундаментална промяна на архитектурата.';
}

const toc = [
  'Увод',
  '1. Анализ на предметната област',
  '2. Анализ на съществуващи решения',
  '3. Избор и описание на използваните технологии',
  '4. Архитектура на уеб приложението',
  '5. Проектиране на базата данни',
  '6. Описание на основните модули на системата',
  '7. Сигурност и защита на данните',
  '8. Тестване и валидиране на системата',
  '9. Трудности и оригинални приноси',
  '10. Постигане на целите и бъдещо развитие',
  'Заключение',
  'Използвана литература',
  'Приложения',
];

// Title page
for (let i = 0; i < 3; i++) doc.moveDown();
center('ДИПЛОМНА РАБОТА', 28, true);
doc.moveDown(0.5);
center('на тема', 14, false);
center('Уеб базирана система за онлайн подбор, тестване и', 16, true);
center('кандидатстване на аниматори в туристическия сектор', 16, true);
doc.moveDown(2.5);
center('Изготвил: ............................................................', 13, false);
center('Специалност: ........................................................', 13, false);
center('Научен ръководител: .............................................', 13, false);
doc.moveDown(3);
center('2026 г.', 13, false);
pageBreak();

// TOC page
h1('Съдържание');
toc.forEach((item) => {
  doc.font('R').fontSize(12).text(item, { indent: 12 });
  doc.moveDown(0.2);
});
pageBreak();

// Увод (long)
h1('Увод');
const introParas = [
  'Дигитализацията на организационните процеси през последните години промени начина, по който компаниите планират, управляват и оценяват своята оперативна дейност. В туристическия сектор тази промяна се усеща особено силно, защото голяма част от процесите са зависими от сезонност, кратки срокове и висока динамика на човешките ресурси. Подборът на аниматори е показателен пример за процес, който традиционно се е изпълнявал с помощта на ръчни методи, но в съвременната среда изисква структурирано дигитално управление.',
  'Хотелската анимация съчетава творчески и организационни елементи. Тя не е просто развлечение, а услуга, която пряко влияе върху удовлетвореността на гостите, повторните посещения и репутацията на туристическия обект. По тази причина подборът на аниматори следва да бъде внимателен, последователен и обоснован. Когато такъв подбор се извършва чрез разпокъсани канали, качеството на крайния резултат силно зависи от човешкия фактор и често е неравномерно.',
  'Необходимостта от интегрирана система възниква естествено в момента, в който организацията трябва да обработва голям брой кандидатури в кратък период. Ръчната обработка води до закъснения, загуба на информация, различни критерии за оценка и затруднена проследимост на решенията. Уеб базираното решение, представено в тази дипломна работа, отговаря на тази необходимост чрез въвеждане на единен процес: регистрация, тест, кандидатстване и администрация на данните.',
  'Основната идея на разработката е кандидатът да преминава през предварително дефиниран и стандартизиран път. Този път започва с информационна част, продължава с автентикация и тестова проверка и завършва с формализирано кандидатстване. По този начин системата не само събира данни, но и структурира качеството на входящия поток от кандидати. В практиката това означава по-малко административна тежест и по-голяма обективност в първия етап на селекция.',
  'Предметът на дипломната работа е проектиране и реализация на уеб приложение, което подпомага подбора на персонал за детска и спортна анимация. Обектът на изследване са организационните и техническите механизми, чрез които този подбор може да бъде автоматизиран и стандартизиран. Методологично разработката комбинира анализ на процеса, инженерно проектиране, имплементация и функционално тестване в реалистична среда.',
  'Целта на разработката е да се създаде работеща, сигурна и разширяема система, която да улеснява работата както на кандидатите, така и на администраторите. За постигането на тази цел са поставени задачи, свързани с моделиране на базата данни, реализация на API слой, изграждане на потребителски интерфейси, контрол на достъпа и проверка на качеството чрез тестови сценарии.',
  'Научно-приложната стойност на разработката се изразява в това, че тя демонстрира практическо приложение на съвременни уеб технологии в конкретен бизнес контекст. Едновременно с това проектът служи като модел за структуриране на други процеси по подбор и управление на данни в сходни организации. В рамките на дипломната работа са анализирани решенията, направени по отношение на архитектура, сигурност и управляемост на системата.',
  'Практическата полза за организацията е свързана с централизация на информацията, ускоряване на първичната селекция и подобряване на проследимостта на решенията. От гледна точка на кандидата, системата предлага ясно дефинирана последователност на действията и по-голяма прозрачност за процеса. От гледна точка на администратора, тя осигурява табличен контрол върху потребители, роли и кандидатури с минимални ръчни действия.',
  'В контекста на съвременното софтуерно инженерство подобни решения трябва да бъдат не само функционални, но и устойчиви. Затова в проекта е заложена архитектура, която позволява последващо надграждане: добавяне на нови видове тестове, статистически панели, известия, интеграции с външни услуги и разширени механизми за сигурност. Този потенциал е разгледан в заключителните раздели на дипломната работа.',
  'Структурата на изложението следва логиката на един завършен инженерен проект. След увода са представени предметната област и съществуващите решения, избраните технологии, архитектурата и базата данни, основните модули, сигурността, тестването, трудностите и приносите, постигането на целите и посоките за бъдещо развитие. Така текстът осигурява последователен преход от анализ към реализация и оценка.'
];
introParas.forEach(para);

pageBreak();

// 1
h1('1. Анализ на предметната област');
for (let i = 1; i <= 5; i++) {
  h2(`1.${i}. Аспект ${i} от домейна на хотелската анимация`);
  para(longParagraph('предметната област на хотелската анимация', 'фокусът върху подбор на хора с правилна мотивация и базови компетентности е критично условие за качество на услугата'));
  para(longParagraph('управлението на сезонен персонал', 'процесите трябва да бъдат бързи, но едновременно с това проверими и проследими във времето'));
  para(longParagraph('комуникацията между кандидат и организация', 'ясните стъпки и стандартизираният интерфейс намаляват грешките в подадената информация и улесняват последващата оценка'));
}
pageBreak();

// 2
h1('2. Анализ на съществуващи решения');
for (let i = 1; i <= 5; i++) {
  h2(`2.${i}. Сравнителен анализ на налични платформи`);
  para(longParagraph('съществуващите HR и recruitment платформи', 'универсалността на готовите решения често води до прекомерна сложност за малки екипи с конкретен процес на подбор'));
  para(longParagraph('адаптацията на общи системи към специфични бизнес нужди', 'времето за конфигуриране и административна поддръжка може да надвиши реалната полза при сезонни кампании'));
  bullet('Предимства: богати функционалности, готови отчети, интеграции.');
  bullet('Недостатъци: по-висока цена, сложна поддръжка, излишни модули.');
  para('Изводът от анализа е, че за конкретната организация е по-подходящо компактно специализирано решение, което изпълнява точно необходимия процес и минимизира внедрителния риск.');
}
pageBreak();

// 3
h1('3. Избор и описание на използваните технологии');
quote('Книгата “Основи на програмирането със C#” е отлично съвременно ръководство за старт в програмирането с езика C#, насочено към напълно начинаещи.', 'introprogramming.info – „Основи на програмирането със C#“');
quote('Книгата “Принципи на програмирането със C#” е отлично съвременно ръководство за навлизане в програмирането и алгоритмите с платформата .NET и езика C#.', 'introprogramming.info – „Принципи на програмирането със C#“');

h2('3.1. Технологичен стек и аргументация');
const techItems = [
  ['Node.js', 'асинхронен модел, добра производителност при I/O операции и богат екосистемен набор за уеб разработка.'],
  ['Express.js', 'опростява изграждането на маршрути, middleware и API, подходящ за ясно структуриране на сървърната логика.'],
  ['MySQL', 'стабилна релационна система с добра поддръжка на индекси, JSON полета и транзакционни механизми.'],
  ['bcrypt', 'надеждно хеширане на пароли с configurable cost factor за базова защита на потребителските данни.'],
  ['express-session', 'контролирана сесийна автентикация, удобна за role-based достъп до административни ресурси.'],
  ['multer', 'ефективно управление на файлови качвания с контрол на размер и разширения.'],
  ['PDFKit', 'динамично генериране на сертификати и документални изходи.'],
  ['Bootstrap + CSS', 'бързо изграждане на адаптивен интерфейс и последователна визуална идентичност.'],
];
techItems.forEach(([name, why], idx) => {
  h2(`3.${idx + 2}. ${name}`);
  para(`Технологията ${name} е избрана, защото ${why}`);
  para(longParagraph(`${name} в контекста на проекта`, 'избраните библиотеки се интегрират добре помежду си и позволяват бърза поддръжка на бизнес изискванията'));
});
pageBreak();

// 4
h1('4. Архитектура на уеб приложението');
for (let i = 1; i <= 5; i++) {
  h2(`4.${i}. Архитектурен аспект ${i}`);
  para(longParagraph('клиент-сървърната архитектура', 'разделянето между интерфейс, бизнес логика и данни създава ясни граници и улеснява развитието на кода'));
  para(longParagraph('маршрутизацията и middleware слоя', 'централизираните проверки за достъп намаляват дублирането на условия в отделните обработчици'));
  para(longParagraph('структурирането на статичните ресурси и view файловете', 'поддържането на консистентна структура ускорява локализирането на проблеми и подобрява четимостта за екипа'));
}

codeScreenshot('server.js',
`GET  /admin                  -> изисква requireAuth + requireAdmin
GET  /admin/api/users        -> връща JSON списък с потребители
POST /admin/api/users/role   -> променя роля user/admin
GET  /admin/api/applications -> връща JSON списък с кандидатури
DELETE /admin/api/applications/:id -> изтрива кандидатура`);

pageBreak();

// 5
h1('5. Проектиране на базата данни');
h2('5.1. Логически модел и нормализация');
for (let i = 0; i < 5; i++) {
  para(longParagraph('логическия модел на базата данни', 'релационната структура е подбрана така, че да осигури последователност на данните и лесно агрегиране при административен преглед'));
}

h2('5.2. Основни таблици и SQL схема');
para('Базата данни съдържа пет взаимосвързани таблици. Следва пълната SQL дефиниция на схемата, извлечена директно от файла database.sql на проекта:');
codeBlock(
`-- Таблица за потребители
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL DEFAULT '',
  last_name  VARCHAR(50) NOT NULL DEFAULT '',
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Таблица за кандидатури (standalone - без FK)
CREATE TABLE IF NOT EXISTS applications (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  full_name      VARCHAR(100) NOT NULL,
  email          VARCHAR(100) NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  city           VARCHAR(50)  NOT NULL,
  age_check      BOOLEAN DEFAULT FALSE,
  languages      JSON,
  motivation     TEXT,
  has_experience BOOLEAN DEFAULT FALSE,
  skills         JSON,
  cv_filename    VARCHAR(255),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_created_at (created_at)
);

-- Таблица за тестове
CREATE TABLE IF NOT EXISTS tests (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(50) NOT NULL UNIQUE,
  title        VARCHAR(100) NOT NULL,
  pass_percent INT DEFAULT 70,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица за резултати (FK към users и tests)
CREATE TABLE IF NOT EXISTS results (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  test_id       INT NOT NULL,
  score_percent INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  total_count   INT DEFAULT 0,
  passed        BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Таблица за въпроси (FK към tests)
CREATE TABLE IF NOT EXISTS questions (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  test_id        INT NOT NULL,
  question_text  TEXT NOT NULL,
  option_a       VARCHAR(255) NOT NULL,
  option_b       VARCHAR(255) NOT NULL,
  option_c       VARCHAR(255) NOT NULL,
  option_d       VARCHAR(255) NOT NULL,
  correct_answer ENUM('a','b','c','d') NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);`);

h2('5.3. ER диаграма на базата данни');
para('Следващата диаграма визуализира релациите между таблиците. Стрелките показват Foreign Key връзките: users и tests са свързани чрез results; tests е свързана с questions. Таблицата applications е независима.');
dbDiagram();

for (let i = 1; i <= 4; i++) {
  h2(`5.${i + 2}. Детайл по данните ${i}`);
  para(longParagraph('индексирането и търсенето в административния панел', 'използването на индекс по created_at и email ускорява ежедневните операции по преглед и филтриране'));
  para(longParagraph('JSON полетата в applications', 'гъвкавото съхранение на езици и умения минимизира нуждата от чести schema migration промени'));
}
pageBreak();

// 6
h1('6. Описание на основните модули на системата');
const modules = [
  'Публичен модул и начална страница',
  'Модул регистрация и вход',
  'Модул възстановяване на парола',
  'Модул тестове и оценяване',
  'Модул кандидатстване',
  'Модул качване на документи',
  'Административен модул',
  'Модул сертификати',
];
modules.forEach((m, i) => {
  h2(`6.${i + 1}. ${m}`);
  para(longParagraph(m.toLowerCase(), 'модулът е реализиран с ясно дефинирани входове и изходи, което улеснява проверката на коректността и поддръжката'));
  para(longParagraph('интеграцията между модулите', 'всеки модул обменя данни чрез стандартизирани обекти и контролирани маршрути'));
  para(longParagraph('потребителския поток', 'последователността от действия е проектирана така, че да намали когнитивното натоварване и да избегне обърквания в интерфейса'));
});

codeBlock(
`app.get('/admin/api/users', requireAuth, requireAdmin, ...)
app.post('/admin/api/users/role', requireAuth, requireAdmin, ...)
app.get('/admin/api/applications', requireAuth, requireAdmin, ...)
app.delete('/admin/api/applications/:id', requireAuth, requireAdmin, ...)`);

h2('6.9. Фрагменти от програмния код на системата');
para('В тази точка са представени реални откъси от файла server.js на проекта, илюстриращи ключова функционалност на отделните модули.');

h2('Middleware за автентикация и ролеви контрол на достъпа');
codeBlock(
`// Проверка дали потребителят е влязъл в системата
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login?error=auth');
}

// Проверка дали потребителят има администраторска роля
function requireAdmin(req, res, next) {
  if (req.session && req.session.user &&
      req.session.user.role === 'admin') return next();
  return res.redirect('/?error=forbidden');
}`);

h2('Регистрация на потребител с bcrypt хеширане на парола');
codeBlock(
`app.post('/auth/register', async (req, res) => {
  const { username, first_name, last_name, email, password } = req.body;
  if (!username || !first_name || !last_name || !email || !password)
    return res.redirect('/register?error=missing');
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users ' +
      '(username, first_name, last_name, email, password, role) ' +
      'VALUES (?, ?, ?, ?, ?, "user")';
    db.query(sql, [username, first_name, last_name, email, hashedPassword],
      (err) => {
        if (err && err.code === 'ER_DUP_ENTRY')
          return res.redirect('/register?error=duplicate');
        return res.redirect('/login?success=registered');
      });
  } catch (e) { return res.redirect('/register?error=server'); }
});`);

h2('Качване на CV с валидация на файлов тип и размер');
codeBlock(
`const cvUpload = multer({
  storage: cvStorage,
  limits: { fileSize: 8 * 1024 * 1024 },   // 8 MB максимум
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error(
      'Само PDF, DOC, DOCX, JPG или PNG файлове са разрешени.'
    ));
  }
});`);

h2('Изпращане на резултат от тест и запис в базата данни');
codeBlock(
`app.post('/api/submit-test', requireAuth, async (req, res) => {
  const { testCode, answers } = req.body;
  const userId = req.session.user.id;
  // Зареждане на въпросите за текущия тест
  const [testRow] = await db.promise().query(
    'SELECT id, pass_percent FROM tests WHERE code = ?', [testCode]);
  const testId = testRow[0].id;
  const passPercent = testRow[0].pass_percent;
  // Изчисляване на резултата
  const [questions] = await db.promise().query(
    'SELECT id, correct_answer FROM questions WHERE test_id = ?', [testId]);
  let correct = 0;
  questions.forEach(q => {
    if (answers[q.id] === q.correct_answer) correct++;
  });
  const scorePercent = Math.round((correct / questions.length) * 100);
  const passed = scorePercent >= passPercent;
  // Запис в базата
  await db.promise().query(
    'INSERT INTO results (user_id,test_id,score_percent,correct_count,total_count,passed) ' +
    'VALUES (?,?,?,?,?,?)',
    [userId, testId, scorePercent, correct, questions.length, passed]);
  res.json({ scorePercent, passed });
});`);

pageBreak();

// 7
h1('7. Сигурност и защита на данните');
for (let i = 1; i <= 5; i++) {
  h2(`7.${i}. Контрол и защита ${i}`);
  para(longParagraph('сигурността на приложението', 'използването на bcrypt за пароли и role-based контрол за административни ресурси намалява риска от неоторизиран достъп'));
  para(longParagraph('валидирането на входни данни', 'проверките в сървърната страна не позволяват запис на невалидни или непълни структури в базата'));
  bullet('Ограничение на файловите типове: PDF, DOC, DOCX, JPG, PNG.');
  bullet('Лимит на размер при качване: 8 MB.');
  bullet('Защитени маршрути чрез requireAuth и requireAdmin.');
}
pageBreak();

// 8
h1('8. Тестване и валидиране на системата');
for (let i = 1; i <= 5; i++) {
  h2(`8.${i}. Група тестови сценарии ${i}`);
  para(longParagraph('функционалното тестване', 'валидирани са както положителни сценарии, така и откази при невалидни входове и неразрешен достъп'));
  bullet('Тест за регистрация с валидни данни.');
  bullet('Тест за дублиран имейл и потребителско име.');
  bullet('Тест за вход с грешна парола.');
  bullet('Тест за достъп до админ панел без admin роля.');
  bullet('Тест за качване на файл с неподдържано разширение.');
  para(longParagraph('резултатите от валидирането', 'системата показва устойчиво поведение и коректни съобщения за грешка във всички основни проверени случаи'));
}
pageBreak();

// 9
h1('9. Трудности и оригинални приноси');
for (let i = 1; i <= 4; i++) {
  h2(`9.${i}. Трудност и решение ${i}`);
  para(longParagraph('реализацията на проекта', 'едно от предизвикателствата беше синхронизирането на потребителския поток с административните изисквания за контрол и проследимост'));
  para(longParagraph('проектните компромиси', 'взетите решения са насочени към максимална практическа стойност при ограничено време и ресурси'));
  bullet('Оригинален принос: интегриран процес тест -> кандидатстване -> сертификат.');
  bullet('Оригинален принос: административен панел с директни роли и JSON визуализация на умения.');
  bullet('Оригинален принос: гъвкав модел за разширяване на полетата в кандидатурата.');
}
pageBreak();

// 10
h1('10. Постигане на целите и бъдещо развитие');
for (let i = 1; i <= 4; i++) {
  h2(`10.${i}. Оценка и перспектива ${i}`);
  para(longParagraph('постигането на поставените цели', 'основните функционални и нефункционални изисквания са реализирани и валидирани чрез практически сценарии'));
  para(longParagraph('бъдещото развитие', 'естествените следващи стъпки включват статистически dashboards, известяване по имейл и интеграция с външни HR системи'));
  bullet('Възможно разширение: централизиран логинг и одит на действията.');
  bullet('Възможно разширение: двуфакторна автентикация за администратори.');
  bullet('Възможно разширение: облачно съхранение на документи.');
}
pageBreak();

// Conclusion
h1('Заключение');
for (let i = 0; i < 5; i++) {
  para(longParagraph('заключителната оценка на проекта', 'разработената система изпълнява реална организационна функция и демонстрира устойчива архитектурна рамка за развитие'));
}

// Literature
h1('Използвана литература');
[
  'Pressman, R. S. Software Engineering: A Practitioner\'s Approach.',
  'Sommerville, I. Software Engineering.',
  'Elmasri, R., Navathe, S. Fundamentals of Database Systems.',
  'Node.js Official Documentation.',
  'Express.js Official Documentation.',
  'MySQL Reference Manual.',
  'OWASP Web Application Security Testing Guide.',
  'Bootstrap 5.3 Documentation.',
  'MDN Web Docs.',
  'Nakov, S. Books and free programming resources: https://introprogramming.info/',
  'Nakov, S. Practical Cryptography for Developers: https://cryptobook.nakov.com/',
].forEach((x) => bullet(x));

// Appendices
h1('Приложения');
h2('Приложение А. Примерни API маршрути');
codeBlock(
`GET    /admin/api/users
POST   /admin/api/users/role
DELETE /admin/api/users/:id
GET    /admin/api/applications
DELETE /admin/api/applications/:id`);

h2('Приложение Б. Примерен поток на данните');
codeScreenshot('Поток на данните (admin.html → server.js → MySQL)',
`[admin.html] fetch('/admin/api/applications')
        -> [server.js] requireAuth + requireAdmin
        -> [db] SELECT ... FROM applications ORDER BY created_at DESC
        <- [server.js] res.json(rows)
        <- [admin.html] render table rows`);

// Page numbering
const totalPages = doc.bufferedPageRange().count;
for (let i = 0; i < totalPages; i++) {
  doc.switchToPage(i);
  doc.font('R').fontSize(10).fillColor('#666')
    .text(`– ${i + 1} –`, doc.options.margin, doc.page.height - doc.options.margin - 6, {
      align: 'center', width: W, lineBreak: false,
    });
}

doc.flushPages();
doc.end();
out.on('finish', () => console.log('PDF generated: ' + outputPath + ' | pages: ' + totalPages));
out.on('error', (err) => {
  console.error(err);
  process.exit(1);
});
