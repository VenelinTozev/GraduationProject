const fs = require('fs');
const path = require('path');
const {
  AlignmentType, Document, HeadingLevel,
  Packer, PageBreak, Paragraph, TableOfContents, TextRun,
} = require('docx');

const outputPath = path.join(__dirname, 'Diplomna_rabota_CrewWave.docx');

// ── helpers ──────────────────────────────────────────────────────────────────
function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 500, after: 200 } });
}
function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 160 } });
}
function h3(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 280, after: 120 } });
}
function para(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: 180 },
    indent: { firstLine: 720 },
    children: [new TextRun({ text, size: 26 })],
  });
}
function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 320, after: 100 },
    children: [new TextRun({ text, size: 26 })],
  });
}
function code(text) {
  return text.split('\n').map(line =>
    new Paragraph({
      spacing: { before: 0, after: 0, line: 260 },
      children: [new TextRun({ text: line || ' ', font: 'Courier New', size: 20 })],
    })
  );
}
function codeBox(text) {
  return [new Paragraph({ spacing: { before: 180 } }), ...code(text), new Paragraph({ spacing: { after: 200 } })];
}
function centered(text, bold = false, size = 28) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: [new TextRun({ text, bold, size })],
  });
}
function pb() { return new Paragraph({ children: [new PageBreak()] }); }
function empty() { return new Paragraph({ spacing: { after: 240 } }); }

// ── kontent ──────────────────────────────────────────────────────────────────
const children = [

  // TITULNA
  empty(), empty(), empty(),
  centered('ДИПЛОМНА РАБОТА', true, 36),
  empty(),
  centered('Тема:', true, 28),
  centered('„Разработване на уеб базирана система за онлайн', true, 30),
  centered('подбор, тестване и кандидатстване на аниматори', true, 30),
  centered('за туристическия сектор"', true, 30),
  empty(), empty(), empty(),
  centered('Изготвил: ............................................', false, 26),
  centered('Специалност: ........................................', false, 26),
  centered('Научен ръководител: .................................', false, 26),
  empty(), empty(), empty(), empty(),
  centered('2026 г.', false, 26),
  pb(),

  // SADARJANIE
  h1('Съдържание'),
  new TableOfContents('Съдържание', { hyperlink: true, headingStyleRange: '1-3' }),
  pb(),

  // REZUME
  h1('Резюме'),
  para('Настоящата дипломна работа представя проектирането и практическата реализация на уеб базирана информационна система за управление на процесите по подбор, тестване и кандидатстване на аниматори в туристическия сектор. Разработеното приложение носи работното наименование CrewWave и е предназначено за организации, предлагащи хотелска анимация в курортни дестинации.'),
  para('Приложението обединява в единна уеб среда следните основни процеси: публично представяне на организацията и нейните дейности, регистрация и автентикация на потребители, провеждане на тестова проверка на знанията преди кандидатстване, подаване на подробна форма за кандидатура с качване на автобиография и административно управление на подадените данни. Ключова характеристика на системата е, че тестът за определено направление е задължително условие, което трябва да бъде преминато успешно, преди да се отвори формата за кандидатстване. Така се осигурява базова предварителна филтрация на кандидатите.'),
  para('Системата е реализирана с технологиите Node.js, Express.js и MySQL. Клиентската страна е изградена с HTML5, CSS3 и JavaScript. За защита на паролите е приложен bcrypt алгоритъм, а управлението на потребителските сесии се осъществява чрез express-session. Качването на CV документи се реализира чрез multer с контрол на файловите типове и размер, а генерирането на PDF сертификат за успешно преминат тест е реализирано с PDFKit. Конфигурационните параметри за средата се управляват чрез dotenv.'),
  para('В рамките на дипломната работа са разгледани предметната област, изискванията, архитектурата, детайлите на реализацията, тестването и оценката на системата. Направен е специален акцент върху взаимодействието между базата данни, сървърната логика и административния панел като ключова функционалност, демонстрираща пълния цикъл на обработка на данни.'),
  pb(),

  // ABSTRACT
  h1('Abstract'),
  para('This diploma thesis presents the design and practical implementation of a web-based information system for managing the processes of recruitment, testing, and application submission for animators in the tourism sector. The developed application, referred to as CrewWave, is intended for organizations providing hotel entertainment services at resort destinations.'),
  para('The application unifies the following key processes in a single web environment: public presentation of the organization and its activities, user registration and authentication, a mandatory knowledge test before applying, submission of a detailed application form with CV file upload, and administrative management of submitted data. A key characteristic of the system is that successfully passing a test for a specific field is a prerequisite for accessing the application form. This ensures a basic preliminary filtering of candidates.'),
  para('The system is implemented using Node.js, Express.js, and MySQL. The client side is built with HTML5, CSS3, and JavaScript. Password protection is achieved through the bcrypt algorithm, while session management is handled by express-session. CV file uploads are processed by multer with file type and size validation, and PDF certificate generation for successfully passed tests is implemented with PDFKit. Environmental configuration is managed through dotenv.'),
  para('This thesis covers the subject domain, requirements analysis, system architecture, implementation details, testing, and system evaluation. Special emphasis is placed on the interaction between the database, server-side logic, and the administrative panel as a key feature demonstrating a complete data processing cycle.'),
  pb(),

  // GLAVA 1
  h1('Глава 1. Увод'),
  h2('1.1. Обосновка на темата'),
  para('В условията на продължаваща цифровизация на работните процеси организациите в туристическия сектор все по-осезаемо усещат нуждата от специализирани информационни решения. Физически документи, електронна поща и неструктурирани таблици постепенно отстъпват място на централизирани уеб приложения, които осигуряват по-добра организация, проследимост и ефективност. Тази тенденция е особено актуална в областта на подбора на сезонен персонал, където сроковете са кратки, а броят на кандидатите може да бъде значителен.'),
  para('Хотелската анимация е сфера с висока динамика. Всяка сезонна кампания изисква бързо и прецизно привличане на подходящи кандидати, проверка на техните компетентности и обработка на голямо количество документи. Традиционните методи за набиране — чрез социални мрежи, телефонни разговори и хартиени форми — все по-трудно отговарят на тези изисквания. Именно тук информационните технологии могат да предоставят реална добавена стойност.'),
  para('Настоящата дипломна разработка се занимава с проектирането и реализацията на уеб базирана система CrewWave, която подпомага целия процес от представяне на организацията до подаване и административна обработка на кандидатурите. Системата е ориентирана конкретно към кандидати за детска и спортна анимация и администратори на организацията. Разработката представлява пример за практическо приложение на знанията от областта на уеб технологиите, базите данни и информационните системи.'),

  h2('1.2. Цел и задачи'),
  para('Основната цел на дипломната работа е да се проектира и реализира уеб приложение, което автоматизира и оптимизира първичния процес по подбор на аниматори. За постигане на тази цел са формулирани следните конкретни задачи:'),
  bullet('Анализ на предметната област и идентифициране на основните процеси в подбора на аниматори за хотелски обекти.'),
  bullet('Анализ и формулиране на функционалните и нефункционалните изисквания към системата.'),
  bullet('Проектиране на архитектура на уеб приложение с ясно разграничени модули.'),
  bullet('Проектиране и реализация на релационна база данни с таблици за потребители, тестове, резултати и кандидатури.'),
  bullet('Разработване на модули за регистрация, вход, възстановяване на парола и управление на сесии.'),
  bullet('Разработване на тестови модул за провеждане и автоматично оценяване на тестовете.'),
  bullet('Разработване на модул за подаване на разширена форма за кандидатстване с качване на CV.'),
  bullet('Разработване на административен панел за управление на потребители и кандидатури.'),
  bullet('Реализиране на генериране на PDF сертификат при успешно преминат тест.'),
  bullet('Провеждане на функционално тестване и оценка на системата.'),

  h2('1.3. Използвани методи'),
  para('При изпълнението на дипломната работа са приложени следните методи: проучване и анализ на предметната област, проектиране на бази данни, разработване на REST-подобни API маршрути, функционално тестване по сценарии и обектно-ориентирано програмиране.'),

  h2('1.4. Структура на разработката'),
  para('Дипломната работа е структурирана в шест основни глави. Глава 1 представя увода, обосновката, целите и задачите. Глава 2 разглежда предметната област и особеностите на процеса по подбор на аниматори. Глава 3 анализира функционалните и нефункционалните изисквания. Глава 4 описва проектиране на архитектурата, базата данни и потребителските роли. Глава 5 представя детайлно реализацията на всички основни модули с реални кодови откъси от проекта. Глава 6 съдържа резултатите от тестването и оценката на системата. Следват заключение, насоки за бъдещо развитие, литература и приложения.'),
  pb(),

  // GLAVA 2
  h1('Глава 2. Анализ на предметната област'),

  h2('2.1. Хотелска анимация като професионална сфера'),
  para('Хотелската анимация представлява съвкупност от организирани дейности, насочени към повишаване на удовлетвореността на гостите в туристически обекти. Тя обхваща широк спектър от занимания — от спортни активности и детски клубове до вечерни шоу програми и тематични дни. В зависимост от вида на туристическия обект, целевата аудитория и сезона, анимационните дейности могат да варират значително по своя характер и интензивност.'),
  para('Сферата на хотелската анимация е особено развита в крайбрежните курортни комплекси, където туристическите обекти предлагат широка гама от услуги. В България водещите дестинации включват Слънчев бряг, Златни пясъци, Свети Влас и Албена — именно тези обекти са посочени и в разработваната система. В тях търсенето на квалифицирани аниматори е най-голямо, а сезонният характер на заетостта предполага интензивен процес на набиране и подбор в периода преди сезона.'),
  para('Организациите, предлагащи хотелска анимация, обикновено работят с мрежа от партньорски хотели, на които предоставят пакет от услуги. Това означава, че един аниматор може да работи в различни обекти през различни периоди. Такъв модел изисква добра координация, гъвкавост на персонала и ясна информационна система, която следи кой кандидат е подходящ за коя позиция.'),
  para('Компанията CrewWave, за нуждите на чиято дейност е разработена системата, съществува на пазара повече от 16 години и работи с над 100 аниматора в 20 хотела. Мащабът на операцията обосновава необходимостта от централизирано дигитално решение за управление на подбора.'),

  h2('2.2. Детска анимация'),
  para('Детската анимация е насочена към организиране на занимания за деца в различни възрастови групи. Тя включва работа в детски клубове, организиране на игри на открито, творчески ателиета, рисуване, театрални занимания, тематични дни и участие в танцови представления. Детският аниматор трябва да притежава специфична комбинация от личностни и практически качества: търпение, отговорност, позитивно отношение, готовност за работа с деца с различни характери и нужди, способност за импровизация и организационни умения.'),
  para('Освен педагогическите аспекти, детската анимация включва и отговорност за безопасността на децата в периода на занимания. Поради тази причина при подбора на детски аниматори се обръща специално внимание не само на уменията, но и на личностните характеристики и нагласите на кандидатите. Системата CrewWave предоставя отделен тест за детска анимация, чрез който се проверява ориентацията на кандидата в ключовите аспекти на тази позиция.'),
  para('Типичните задачи на детски аниматор включват: посрещане на деца в клуба, провеждане на сутрешни занимания, организиране на мини-олимпиади, работа с деца по групи по интереси, участие в вечерни шоу представления, координация с родителите и отговорност за инвентара и помещенията. Тази многостранна роля изисква широк спектър от умения, което обосновава необходимостта от внимателна предварителна селекция.'),

  h2('2.3. Спортна анимация'),
  para('Спортната анимация е насочена към организирането на активни занимания за по-широката публика в туристическите обекти. Тя обхваща сутрешна гимнастика, спортни турнири и игри около басейна, волейбол, водни игри, фитнес сесии, отборни състезания и разнообразни двигателни активности. Спортният аниматор е лицето на организацията в активната, физическа страна на хотелския живот.'),
  para('За тази позиция са необходими физическа подготовка, комуникативност, способност за работа с публика, инициативност и организационни умения. Кандидатите трябва да разбират принципите на провеждане на групови занимания, да могат да поддържат ентусиазма на участниците и да управляват различни ситуации в рамките на групата. Работата включва постоянен контакт с туристите и изисква постоянно добро настроение и готовност за нови предизвикателства.'),
  para('Аналогично на детската анимация, системата предвижда специализиран тест за спортна анимация, чрез който се верифицира знаниевата готовност на кандидата. Тестовете са насочени към проверка на ориентацията в принципите на анимационната работа, а не на спортните умения, тъй като последните се проверяват при практическо събеседване. По този начин тестът изпълнява ролята на първичен филтър.'),

  h2('2.4. Традиционен процес на подбор и неговите предизвикателства'),
  para('Традиционният процес на подбор на аниматори протича на няколко последователни етапа. В периода преди сезона организацията публикува обявления в социалните мрежи и специализирани платформи, набира кандидати, събира документи, провежда предварително събеседване, оценява кандидатурите и накрая провежда обучение на одобрените хора. Всеки от тези етапи крие специфични предизвикателства, особено при по-голям мащаб на дейността.'),
  para('Основните проблеми при традиционния подход включват: трудност при обработката на голямо количество документи, липса на единна система за сравнение на кандидатите, невъзможност за предварителна проверка на знанията по стандартизиран начин, забавяне при комуникация и загуба на информация, невъзможност за проследяване на статуса на кандидатурите и разнородност на постъпващите данни в различни формати.'),
  para('Освен изброените проблеми, традиционният подход страда и от субективност при оценяването. Когато няма стандартизиран инструмент за първична проверка, оценките на различни лица в организацията могат да се разминават значително. Системата CrewWave адресира тези проблеми, като въвежда обективно тестване и структурирано събиране на данни.'),

  h2('2.5. Анализ на съществуващи решения'),
  para('Към настоящия момент на пазара съществуват различни платформи за управление на човешките ресурси и набиране на персонал. Сред тях са системи от типа Workable, LinkedIn Jobs, BambooHR и местни HR платформи. Тези решения обаче са ориентирани към общи процеси по подбор и не предоставят специфична функционалност за тестване по конкретно направление, интегрирана директно в процеса на кандидатстване.'),
  para('Съществен недостатък на общите HR платформи е тяхната сложност и цена за малки и средни организации. Освен това те не предоставят готови механизми за задаване на специализирани тестове, интегрирани с последващата форма за кандидатстване. Разработеното решение CrewWave адресира точно тази ниша: компактна, лесна за ползване система, специализирана за конкретен вид организация и процес, без излишна сложност и без абонаментни разходи.'),
  pb(),

  // GLAVA 3
  h1('Глава 3. Анализ на изискванията'),

  h2('3.1. Функционални изисквания'),
  para('На базата на анализа на предметната област и потребностите на целевите потребителски групи са дефинирани следните функционални изисквания към системата CrewWave:'),

  h3('3.1.1. Публична функционалност'),
  bullet('Системата трябва да предоставя начална страница с информация за организацията, нейните дейности и основни показатели.'),
  bullet('Системата трябва да предоставя отделни информационни страници за детска и спортна анимация с описание на дейностите и изискванията.'),
  bullet('Системата трябва да показва дестинациите, в които организацията работи.'),
  bullet('Системата трябва да предоставя форма за директно кандидатстване без регистрация за начален контакт.'),
  bullet('Системата трябва да насочва потребителя към регистрация и тест чрез ясни бутони и менюта.'),

  h3('3.1.2. Функционалност за регистрирани потребители'),
  bullet('Регистрация на нови потребители с потребителско ime, собствено и фамилно ime, имейл и парола.'),
  bullet('Вход чрез потребителско ime и парола с проверка на bcrypt хеш.'),
  bullet('Изход от системата с унищожаване на сесията.'),
  bullet('Смяна на забравена парола чрез верификация по потребителско ime и имейл.'),
  bullet('Достъп до тест за детска анимация (само за влезли потребители).'),
  bullet('Достъп до тест за спортна анимация (само за влезли потребители).'),
  bullet('Автоматично оценяване на теста с изчисляване на процент и брой верни отговори.'),
  bullet('При резултат >= 70%: пренасочване към разширена форма за кандидатстване.'),
  bullet('При резултат < 70%: показване на резултата на страницата на теста.'),
  bullet('Попълване и подаване на разширена форма с лични данни, езикови умения, мотивация, опит, наличност и умения.'),
  bullet('Качване на CV файл (PDF, DOC, DOCX, JPG, PNG до 8 MB).'),
  bullet('Генериране и изтегляне на PDF сертификат за успешно преминат тест.'),

  h3('3.1.3. Функционалност за администратор'),
  bullet('Административен панел, достъпен само за потребители с роля admin.'),
  bullet('Преглед на всички регистрирани потребители в таблица.'),
  bullet('Промяна на потребителска роля (user/admin) от падащо меню.'),
  bullet('Изтриване на потребители с потвърждение.'),
  bullet('Преглед на всички подадени кандидатури в таблица.'),
  bullet('Изтриване на кандидатури с потвърждение.'),
  bullet('Визуализация на форматирани JSON данни (езикови умения) в таблицата с кандидатури.'),
  bullet('Защита срещу самоизтриване и самопромяна на роля за администратора.'),

  h2('3.2. Нефункционални изисквания'),
  para('Нефункционалните изисквания описват качествените характеристики, на които трябва да отговаря системата. Те са не по-малко важни от функционалните, тъй като определят общото качество на приложението:'),
  bullet('Използваемост: интерфейсът трябва да бъде ясен и интуитивен за потребители без техническа подготовка, с четливи надписи и логичен поток от действия.'),
  bullet('Достъпност: системата трябва да работи в стандартен уеб браузър без допълнителна инсталация на клиентска страна.'),
  bullet('Сигурност: потребителските пароли трябва да се съхраняват само в хеширан вид; достъпът до защитени ресурси трябва да е контролиран чрез middleware.'),
  bullet('Надеждност: системата трябва да обработва грешки контролирано и да не позволява изпълнение на невалидни операции.'),
  bullet('Разширяемост: архитектурата трябва да допуска добавяне на нови модули без основна реструктурация на съществуващия код.'),
  bullet('Поддръжка: системата трябва да използва добре документирани и поддържани технологии с активни commons.'),
  bullet('Отзивчивост: интерфейсът трябва да работи коректно на различни размери на екрана (десктоп, таблет, смартфон).'),

  h2('3.3. Ограничения и предпоставки'),
  para('Разработката е ориентирана към монолитна уеб архитектура и е предназначена за употреба в среда с MySQL база данни. Приета е предпоставката, че потребителите разполагат с интернет достъп и модерен уеб браузър. Системата не включва изпращане на реални имейли поради сложността на допълнителните изисквания — верификационни токени, SMTP сервиз и управление на грешки при доставка. Тестовите въпроси са дефинирани статично в сървърната логика. В по-голям мащаб биха могли да се внедрят динамично управление на въпросите, имейл известия и облачно съхранение.'),
  pb(),

  // GLAVA 4
  h1('Глава 4. Проектиране на системата'),

  h2('4.1. Архитектурен модел'),
  para('Системата CrewWave е реализирана по класическия клиент-сървър архитектурен модел. В него клиентът — браузърът — изпраща HTTP заявки, сървърът обработва логиката и комуникира с базата данни, след което връща HTML страница или JSON данни. Приложението е организирано в три логически слоя.'),
  para('Презентационният слой съдържа HTML страниците, CSS стиловете и клиентския JavaScript. В него се визуализират данните и се формират заявките към сървъра. Приложният слой е реализиран в Express.js. Той дефинира маршрутите, управлява middleware компонентите и съдържа бизнес логиката — валидиране, хеширане, оценяване на тестовете, генериране на PDF. Слоят за достъп до данни е реализиран чрез mysql2 и предоставя механизъм за изпълнение на параметризирани SQL заявки.'),

  h2('4.2. Технологичен стек'),
  para('Всяка технология в стека покрива конкретна роля:'),
  bullet('Node.js — среда за изпълнение на сървърния JavaScript код. Избрана поради широката екосистема и добрата производителност при I/O оперaции.'),
  bullet('Express.js — уеб фреймуърк, осигуряващ маршрутизиране, middleware и управление на заявки.'),
  bullet('MySQL — релационна база данни с добро съответствие с моделирани структурирани данни.'),
  bullet('mysql2 — Node.js драйвер с параметризирани заявки за защита срещу SQL injection.'),
  bullet('bcrypt — хеширане на пароли с регулируем брой итерации.'),
  bullet('express-session — управление на HTTP сесии за съхранение на потребителски статус.'),
  bullet('multer — middleware за качване на файлове с контрол на тип и размер.'),
  bullet('pdfkit — генериране на PDF документи директно в HTTP отговора.'),
  bullet('dotenv — управление на конфигурационни параметри без излагане в изходния код.'),
  bullet('Bootstrap 5.3 — CSS фреймуърк за отзивчив дизайн.'),
  bullet('Montserrat (Google Fonts) — основен шрифт на интерфейса.'),

  h2('4.3. Структура на проекта'),
  para('Файловата структура следва установени конвенции за Express.js проекти:'),
  ...codeBox(
`CrewWave/
├── config/
│   └── db.js               (конфигурация на MySQL)
├── public/
│   ├── css/style.css       (потребителски стилове)
│   ├── js/script.js        (клиентски JS)
│   └── images/             (снимки и ресурси)
│       └── locations/      (снимки на дестинации)
├── uploads/
│   └── cv/                 (качени CV файлове)
├── views/
│   ├── index.html          (начална страница)
│   ├── login.html          (вход)
│   ├── register.html       (регистрация)
│   ├── forgot-password.html
│   ├── admin.html          (административен панел)
│   ├── child-animation.html
│   ├── sport-animation.html
│   ├── child-test.html
│   ├── sport-test.html
│   ├── post-test-apply.html
│   ├── result.html
│   └── apply.html
├── server.js               (основен сървърен файл)
├── database.sql            (SQL схема)
├── package.json
└── .env`),

  h2('4.4. Модели на данни и схема на базата данни'),
  para('Базата данни е проектирана около четири основни таблици, покриващи всички обекти и процеси в системата.'),

  h3('4.4.1. Таблица users'),
  para('Таблицата users съдържа регистрационните данни на потребителите. Полето role е ENUM тип с допустими стойности user и admin. Уникалните ограничения върху username и email предотвратяват дублиране на акаунти. Паролата се съхранява само в хеширан вид — като bcrypt хеш с дължина до 255 символа.'),
  ...codeBox(
`CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  first_name VARCHAR(50)  NOT NULL DEFAULT '',
  last_name  VARCHAR(50)  NOT NULL DEFAULT '',
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email    (email)
);`),

  h3('4.4.2. Таблица applications'),
  para('Таблицата applications е централният механизъм за съхранение на кандидатурите. За полетата languages и skills е избран JSON тип, тъй като те съдържат множество стойности. Това решение избягва ненужна нормализация и улеснява гъвкавото разширяване на формата за кандидатстване.'),
  ...codeBox(
`CREATE TABLE IF NOT EXISTS applications (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  full_name         VARCHAR(100) NOT NULL,
  email             VARCHAR(100) NOT NULL,
  phone             VARCHAR(20)  NOT NULL,
  city              VARCHAR(50)  NOT NULL,
  age_check         BOOLEAN     DEFAULT FALSE,
  languages         JSON,
  motivation        TEXT,
  has_experience    BOOLEAN     DEFAULT FALSE,
  experience_detail TEXT,
  availability      VARCHAR(50),
  driver_license    BOOLEAN     DEFAULT FALSE,
  skills            JSON,
  cv_filename       VARCHAR(255),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email      (email),
  INDEX idx_created_at (created_at)
);`),

  h3('4.4.3. Таблица tests'),
  para('Таблицата tests съдържа дефинициите на наличните тестове. Всеки тест е идентифициран с уникален code (child, sport), заглавие и минимален праг за преминаване. Тези данни се използват при запис на резултатите и при генерирането на сертификат.'),
  ...codeBox(
`CREATE TABLE IF NOT EXISTS tests (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(50)  NOT NULL UNIQUE,
  title        VARCHAR(100) NOT NULL,
  pass_percent INT DEFAULT 70,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO tests (code, title, pass_percent) VALUES
  ('child', 'Детска анимация', 70),
  ('sport', 'Спортна анимация', 70);`),

  h3('4.4.4. Таблица results'),
  para('Таблицата results записва резултатите от преминатите тестове. Чрез двата външни ключа user_id и test_id тя свързва потребителя с конкретния тест. Полето passed е BOOLEAN и позволява бърза проверка дали съществува успешен резултат при генериране на сертификат.'),
  ...codeBox(
`CREATE TABLE IF NOT EXISTS results (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT     NOT NULL,
  test_id       INT     NOT NULL,
  score_percent INT     DEFAULT 0,
  correct_count INT     DEFAULT 0,
  total_count   INT     DEFAULT 0,
  passed        BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (test_id) REFERENCES tests(id)  ON DELETE CASCADE,
  INDEX idx_user_test (user_id, test_id)
);`),

  h2('4.5. Контрол на достъпа — middleware слой'),
  para('Реализацията на контрол на достъпа е базирана на два middleware компонента в server.js. Те се поставят като аргументи при декларирането на маршрут и се изпълняват последователно при всяка заявка, преди основния обработчик. Ако условието на middleware не е изпълнено, заявката се пренасочва и основният handler не се достига.'),
  ...codeBox(
`function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login?error=auth');
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.user
      && req.session.user.role === 'admin') return next();
  return res.redirect('/?error=forbidden');
}

// Пример за употреба:
app.get('/admin', requireAuth, requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});`),
  pb(),

  // GLAVA 5
  h1('Глава 5. Реализация на системата'),

  h2('5.1. Конфигурация и стартиране'),
  para('Конфигурационните параметри се поддържат в .env файл, достъпен само на сървъра. Той съдържа DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT и SESSION_SECRET. Конфигурацията на базата данни е реализирана в отделен модул config/db.js — добра практика за разделяне на грижите и лесна промяна на средата:'),
  ...codeBox(
`require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Грешка при свързване:', err.message);
  } else {
    console.log('Свързан с MySQL!');
  }
});

module.exports = db;`),
  para('В server.js се настройват middleware компонентите: body-parser за обработка на форм данни и JSON, express.static за статичните файлове и express-session за управление на сесиите. Сесийният secret се зарежда от .env переменна, което предотвратява hardcoding на чувствителни стойности в изходния код.'),
  ...codeBox(
`app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  cookie:            { maxAge: 3600000 },
}));`),

  h2('5.2. Начална страница и потребителски интерфейс'),
  para('Началната страница изпълнява маркетингова и навигационна функция. Тя представя организацията, дейностите и дестинациите, като насочва потребителя към регистрация. Дизайнът използва Bootstrap 5.3, допълнително CSS и шрифт Montserrat. Цветовата схема комбинира навигационен градиент от розово (#ff6b6b) към тюркоаз (#4ecdc4), морско сино (#0284c7) и слънчево оранжево (#f97316) за акцентите.'),
  para('Важна интерактивна функция на началната страница е динамичното показване на бутоните за вход и изход. След зареждане JavaScript изпраща заявка до /api/me — маршрут, който проверява дали съществува активна сесия и връща основни данни за потребителя. В зависимост от отговора менюто показва „Вход / Регистрация" или „Изход", без да презарежда страницата.'),
  para('Страницата включва секция за безкрайно плъзгащи се карти с дестинации (Албена, Златни пясъци, Слънчев бряг, Свети Влас), реализирана чрез CSS keyframe анимация без допълнителни JavaScript библиотеки. Това е ефективен подход за лека и производителна анимация.'),

  h2('5.3. Модул за регистрация'),
  para('Регистрационният маршрут приема POST заявка с данни от формата. Преди запис се извършват: проверка за липсващи полета, хеширане на паролата с bcrypt (10 salt rounds) и INSERT в таблицата users. При конфликт с уникален ключ системата разграничава дали проблемът е в имейла или потребителското ime и извежда съответното съобщение:'),
  ...codeBox(
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
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          const msg = err.sqlMessage.includes('users.email')
            ? 'Имейлът вече е използван.'
            : 'Потребителското ime вече е заето.';
          return res.redirect('/register?error=duplicate&msg='
            + encodeURIComponent(msg));
        }
        return res.redirect('/register?error=server');
      }
      return res.redirect('/login?success=registered');
    });
});`),

  h2('5.4. Модул за вход'),
  para('При вход системата извлича потребителя по потребителско ime и сравнява паролата с bcrypt.compare. При успех данните за потребителя се записват в req.session.user. Паролата не се включва в сесионния обект — съхраняват се само id, username, имената, имейлът и ролята:'),
  ...codeBox(
`app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.redirect('/login?error=missing');

  const sql = \`SELECT id, username, first_name, last_name, email,
                      password, role
               FROM users WHERE username = ? LIMIT 1\`;

  db.query(sql, [username], async (err, results) => {
    if (err || !results.length)
      return res.redirect('/login?error=invalid');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect('/login?error=invalid');

    req.session.user = {
      id:         user.id,
      username:   user.username,
      first_name: user.first_name || '',
      last_name:  user.last_name  || '',
      email:      user.email,
      role:       user.role,
    };
    return res.redirect('/?success=login');
  });
});`),

  h2('5.5. Тестови модул и оценяване'),
  para('Тестовите въпроси се визуализират в HTML форма. Верните отговори се съхраняват само на сървъра в константен обект TEST_ANSWERS — клиентът няма достъп до тях. Функцията scoreTest обработва подадените отговори и изчислява резултата:'),
  ...codeBox(
`const TEST_ANSWERS = {
  child: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a',
           q6:'a', q7:'b', q8:'a', q9:'a', q10:'a' },
  sport: { q1:'a', q2:'a', q3:'a', q4:'a', q5:'a',
           q6:'a', q7:'b', q8:'a', q9:'a', q10:'a' }
};

function scoreTest(testCode, body) {
  const correct = TEST_ANSWERS[testCode];
  const total   = Object.keys(correct).length;
  let correctCount = 0;

  for (const [key, val] of Object.entries(correct)) {
    if (body[key] === val) correctCount++;
  }

  const scorePercent = Math.round((correctCount / total) * 100);
  return { correctCount, total, scorePercent, passed: scorePercent >= 70 };
}`),
  para('При подаване резултатът се записва в таблицата results (чрез INNER JOIN с tests по code). Записът не блокира потока — ако по някаква причина той не успее, потребителят пак получава резултат. Редиректът след теста включва данните като URL параметри, от където страницата result.html ги чете и визуализира сертификата.'),

  h2('5.6. Форма за кандидатстване'),
  para('Разширената форма за кандидатстване (post-test-apply.html) съдържа скрити полета с данни за теста (код, резултат, дата), лична информация (три INPUT полета за ime, фамилия, имейл), таблица с езикови умения по нива за шест езика (EN, DE, RU, FR, RO, TR), поле за мотивация, въпроси за опит, наличност и шофьорска книжка, чекбокси за практически умения и секция за CV.'),
  para('Преди запис данните се преобразуват в JSON структури за полетата languages и skills. Записът използва параметризирана INSERT заявка. Файлът на CV-то се запазва само с уникалното му сгенерирано ime в полето cv_filename. Ако качването на файл е пропуснато, стойността е NULL:'),
  ...codeBox(
`const languages = JSON.stringify({
  en: req.body.lang_en || null,
  de: req.body.lang_de || null,
  ru: req.body.lang_ru || null,
  fr: req.body.lang_fr || null,
  ro: req.body.lang_ro || null,
  tr: req.body.lang_tr || null,
});

const skills = JSON.stringify({
  dance:  req.body.skill_dance  ? true : false,
  sport:  req.body.skill_sport  ? true : false,
  music:  req.body.skill_music  ? true : false,
  acting: req.body.skill_acting ? true : false,
  other:  req.body.skill_other  ? true : false,
});

const sql = \`INSERT INTO applications
  (full_name, email, phone, city, age_check,
   languages, motivation, has_experience, experience_detail,
   availability, driver_license, skills, cv_filename)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`;

db.query(sql, [fullName, email, phone, city, (isAdult==='yes'),
  languages, motivation, hasExperience, experienceDetail,
  availability, driverLicense, skills, cvPath], (err) => {
  if (err) console.error(err.message);
  return res.redirect(\`/result?code=\${code}&...\`);
});`),

  h2('5.7. Качване на CV файлове'),
  para('Multer е конфигуриран с diskStorage стратегия за генериране на уникални имена:'),
  ...codeBox(
`const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const uid = req.session?.user?.id || 'anon';
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, \`cv_user\${uid}_\${Date.now()}\${ext}\`);
  }
});

const cvUpload = multer({
  storage:    cvStorage,
  limits:     { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf','.doc','.docx','.jpg','.jpeg','.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Неразрешен тип файл.'));
  }
});`),
  para('Ограничението от 8 MB предотвратява нежелано заемане на дисково пространство. Белият списък от разрешени типове намалява риска от качване на изпълними файлове. Само файловото ime (без пъти) се записва в базата, което улеснява евентуална бъдеща миграция към облачно съхранение.'),

  h2('5.8. Генериране на PDF сертификат'),
  para('При заявка за сертификат сървърът прави JOIN заявка между таблиците results, users и tests, за да провери дали потребителят има успешен резултат за съответния тест. Ако не бъде намерен запис, се връща HTTP 403:'),
  ...codeBox(
`const sql = \`
  SELECT r.score_percent, r.created_at,
         u.first_name, u.last_name, u.username,
         t.title, t.code
  FROM   results r
  JOIN   users u ON u.id = r.user_id
  JOIN   tests  t ON t.id = r.test_id
  WHERE  r.user_id = ? AND t.code = ? AND r.passed = 1
  ORDER  BY r.created_at DESC
  LIMIT  1
\`;

db.query(sql, [userId, testCode], (err, rows) => {
  if (err) return res.status(500).send('DB error');
  if (!rows.length)
    return res.status(403).send('Нямаш успешно преминат тест.');

  // PDFKit генерира директно в HTTP отговора:
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition',
    'attachment; filename=certificate-' + rows[0].code + '.pdf');

  const doc = new PDFDocument({ size: 'A4', margin: 60 });
  doc.pipe(res);
  // ... изграждане на сертификата ...
  doc.end();
});`),

  h2('5.9. Административен панел — детайлна реализация'),

  h3('5.9.1. Обща архитектура'),
  para('Административният панел работи по REST-подобен модел. HTML страницата (admin.html) съдържа таблици, табове и JavaScript код, но не извлича данни при зареждане чрез server-side rendering. Вместо това, при зареждане на страницата автоматично се стартират функциите loadApplications() и loadUsers(), които правят fetch заявки до защитените API маршрути и попълват таблиците с получените JSON данни.'),
  para('Всяка административна операция — преглед, промяна на роля, изтриване — преминава задължително през двата middleware (requireAuth, requireAdmin) на сървъра. Клиентският JavaScript само инициира действието и visualizes отговора — реалната логика и проверките остават на сървъра. Това е важен принцип за сигурност.'),

  h3('5.9.2. API маршрути за кандидатури'),
  para('Маршрутът за извличане на кандидатури извършва SELECT с ORDER BY created_at DESC, за да показва най-новите кандидатури на върха на таблицата. Полетата са изрично изброени в SELECT, без да се включват всички колони — подход, намаляващ изтичането на ненужни данни:'),
  ...codeBox(
`app.get('/admin/api/applications', requireAuth, requireAdmin, (req, res) => {
  const sql = \`
    SELECT id, full_name, email, phone, city,
           age_check, languages, created_at
    FROM   applications
    ORDER  BY created_at DESC
  \`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.delete('/admin/api/applications/:id', requireAuth, requireAdmin,
  (req, res) => {
    db.query('DELETE FROM applications WHERE id = ?',
      [req.params.id],
      (err) => {
        if (err) return res.json({ ok: false, error: err.message });
        res.json({ ok: true });
      });
  }
);`),

  h3('5.9.3. API маршрути за потребители'),
  para('Маршрутите за управление на потребителите включват предпазни условия срещу самоизтриване и самопромяна на роля. Ролята се валидира спрямо разрешен списък преди изпълнение на SQL заявката:'),
  ...codeBox(
`app.get('/admin/api/users', requireAuth, requireAdmin, (req, res) => {
  const sql = \`SELECT id, username, email, role, created_at
               FROM users ORDER BY created_at DESC\`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/admin/api/users/role', requireAuth, requireAdmin, (req, res) => {
  const { id, role } = req.body;
  if (!id || !['user', 'admin'].includes(role))
    return res.json({ ok: false, error: 'Невалидни данни.' });
  if (id == req.session.user.id)
    return res.json({ ok: false,
      error: 'Не можеш да промениш собствената си роля.' });

  db.query('UPDATE users SET role = ? WHERE id = ?', [role, id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});

app.delete('/admin/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  const id = req.params.id;
  if (id == req.session.user.id)
    return res.json({ ok: false,
      error: 'Не можеш да изтриеш собствения си акаунт.' });

  db.query('DELETE FROM users WHERE id = ?', [id], (err) => {
    if (err) return res.json({ ok: false, error: err.message });
    res.json({ ok: true });
  });
});`),

  h3('5.9.4. Клиентска логика в admin.html'),
  para('Функцията loadApplications изпраща GET заявка, получава JSON масив, парсира JSON полето languages и генерира HTML за таблицата. При грешка се визуализира съобщение вместо данни — без необработени изключения:'),
  ...codeBox(
`async function loadApplications() {
  const body = document.getElementById('appsBody');
  body.innerHTML = \`<tr><td colspan="9" class="text-muted">
    Зареждане...</td></tr>\`;

  const res  = await fetch('/admin/api/applications');
  const data = await res.json();

  if (!Array.isArray(data)) {
    body.innerHTML = \`<tr><td colspan="9" class="text-danger">
      Грешка: \${data.error}</td></tr>\`;
    return;
  }
  if (data.length === 0) {
    body.innerHTML = \`<tr><td colspan="9" class="text-muted">
      Няма кандидатури.</td></tr>\`;
    return;
  }

  body.innerHTML = data.map(a => {
    let langs = '-';
    try {
      const obj = typeof a.languages === 'string'
        ? JSON.parse(a.languages) : a.languages;
      langs = Object.entries(obj || {})
        .filter(([, v]) => v)
        .map(([k]) => k.toUpperCase())
        .join(', ') || '-';
    } catch (e) { /* непарсируем JSON */ }

    return \`<tr>
      <td>\${a.id}</td><td>\${a.full_name}</td>
      <td>\${a.email}</td><td>\${a.phone}</td>
      <td>\${a.city}</td>
      <td>\${a.age_check ? '&#10003;' : '&#10007;'}</td>
      <td>\${langs}</td>
      <td>\${new Date(a.created_at).toLocaleString('bg-BG')}</td>
      <td><button class="btn btn-sm btn-outline-danger"
           onclick="deleteApp(\${a.id})">&#128465;</button></td>
    </tr>\`;
  }).join('');
}

async function deleteApp(id) {
  if (!confirm('Изтрий кандидатурата?')) return;
  const res  = await fetch(\`/admin/api/applications/\${id}\`,
    { method: 'DELETE' });
  const data = await res.json();
  if (data.ok) loadApplications();
  else alert(data.error || 'Грешка при изтриване.');
}`),
  para('Функцията loadUsers визуализира потребителите с падащо меню за роля. Промяната на менюто директно извиква changeRole, без допълнителен бутон за запис. Това осигурява по-интуитивно взаимодействие:'),
  ...codeBox(
`async function loadUsers() {
  const body = document.getElementById('usersBody');
  const res  = await fetch('/admin/api/users');
  const data = await res.json();

  body.innerHTML = data.map(u => \`
    <tr>
      <td>\${u.id}</td>
      <td><b>\${u.username}</b></td>
      <td>\${u.email}</td>
      <td>
        <select class="form-select form-select-sm"
                style="width:120px;"
                onchange="changeRole(\${u.id}, this.value)">
          <option value="user"
            \${u.role==='user' ? 'selected' : ''}>Потребител</option>
          <option value="admin"
            \${u.role==='admin' ? 'selected' : ''}>Администратор</option>
        </select>
      </td>
      <td>\${new Date(u.created_at).toLocaleString('bg-BG')}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger"
          onclick="deleteUser(\${u.id}, '\${u.username}')">
          Изтрий</button>
      </td>
    </tr>
  \`).join('');
}

async function changeRole(userId, newRole) {
  const res = await fetch('/admin/api/users/role', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id: userId, role: newRole }),
  });
  const data = await res.json();
  if (!data.ok) alert(data.error || 'Грешка.');
}

async function deleteUser(userId, username) {
  if (!confirm(\`Изтрий "\${username}"?\`)) return;
  const res  = await fetch(\`/admin/api/users/\${userId}\`,
    { method: 'DELETE' });
  const data = await res.json();
  if (data.ok) loadUsers();
  else alert(data.error || 'Грешка.');
}

loadApplications();
loadUsers();`),

  h3('5.9.5. Пълен поток на данните'),
  para('Следното описание обобщава двупосочния поток на данни между базата данни и административния панел при операцията „преглед на кандидатури":'),
  ...codeBox(
`ПРОЧИТ (GET):
  [admin.html] loadApplications()
      → fetch('/admin/api/applications')
  [server.js]  requireAuth() → requireAdmin()
      → db.query('SELECT ... FROM applications')
  [MySQL]      rows[]  ← таблица applications
  [server.js]  res.json(rows)
  [admin.html] JSON → HTML таблица в браузъра

ЗАПИС (DELETE):
  [admin.html] deleteApp(42)
      → fetch('/admin/api/applications/42', {method:'DELETE'})
  [server.js]  requireAuth() → requireAdmin()
      → db.query('DELETE FROM applications WHERE id = ?', [42])
  [MySQL]      affectedRows: 1
  [server.js]  res.json({ ok: true })
  [admin.html] loadApplications()  (обновяване на таблицата)`),
  pb(),

  // GLAVA 6
  h1('Глава 6. Тестване и оценка'),

  h2('6.1. Методология'),
  para('Тестването е проведено на ниво потребителски сценарии. За всеки основен модул са дефинирани положителни и отрицателни тестови случаи. Положителните проверяват очакваното поведение при валидни данни, а отрицателните — контролирания отказ при невалидни или неразрешени операции.'),

  h2('6.2. Регистрация и вход'),
  bullet('Успешна регистрация с валидни данни → нов запис в таблицата users.'),
  bullet('Регистрация с дублиран имейл → съобщение „Имейлът вече е използван".'),
  bullet('Регистрация с дублирано потребителско ime → съответно съобщение.'),
  bullet('Регистрация с липсващо поле → пренасочване с error=missing.'),
  bullet('Вход с верни данни → сесия създадена, пренасочване към начало.'),
  bullet('Вход с грешна парола → error=invalid, без достъп.'),
  bullet('Достъп до /child-test без вход → пренасочване към /login.'),
  bullet('Смяна на парола с верни данни → UPDATE в MySQL, успешен вход.'),

  h2('6.3. Тестов модул'),
  bullet('Тест с >= 70% верни отговори → запис в results, пренасочване към форма.'),
  bullet('Тест с < 70% верни отговори → показан резултат, оставане на страницата.'),
  bullet('Директен POST към /submit-child-test без вход → отказан от requireAuth.'),
  bullet('Запис в results правилно свързва user_id с test_id.'),

  h2('6.4. Качване на файлове'),
  bullet('PDF файл до 8 MB → записан в uploads/cv с генерирано уникално ime.'),
  bullet('Файл с разширение .exe → multer fileFilter отхвърля заявката.'),
  bullet('Файл над 8 MB → limits.fileSize ограничение, заявката е отхвърлена.'),

  h2('6.5. Административен панел'),
  bullet('Достъп до /admin без роля admin → пренасочване, error=forbidden.'),
  bullet('Зареждане на кандидатури → JSON правилно визуализиран в HTML таблица.'),
  bullet('Форматиране на JSON поле languages → показан като „EN, DE, FR".'),
  bullet('Изтриване на кандидатура → DELETE в MySQL, таблицата се обновява.'),
  bullet('Промяна на роля → UPDATE в MySQL, потвърдено чрез повторно зареждане.'),
  bullet('Опит за промяна на собствена роля → отказ с информативно съобщение.'),
  bullet('Опит за изтриване на собствен акаунт → отказ с информативно съобщение.'),

  h2('6.6. Оценка на използваемостта'),
  para('Потребителският поток е ясен и последователен: начална страница → регистрация → вход → избор на направление → тест → резултат → кандидатстване. Всяка стъпка е свързана с предишната по логичен начин чрез пренасочване и навигационни бутони. Формите са добре структурирани и съдържат пояснителни надписи на български. Съобщенията за грешки са разбираеми за краен потребител.'),
  para('Административният панел е достатъчно прост за ежедневна употреба от нетехнически персонал. Таблиците се зареждат автоматично, а операциите за промяна и изтриване изискват потвърждение. Визуализацията на JSON данни за езиковите умения е форматирана четимо. Тези характеристики повишават практическата ефективност на панела.'),
  pb(),

  // ZAKLYUCHENIE
  h1('Заключение'),
  para('В резултат на изпълнените задачи беше проектирана и реализирана уеб базирана система CrewWave за онлайн подбор, тестване и кандидатстване на аниматори. Системата обединява в единна среда информационна страница, потребителска автентикация, тестови модул с автоматично оценяване, форма за кандидатстване с качване на CV, генериране на PDF сертификати и административен панел за управление на данните.'),
  para('Специален акцент в разработката е взаимодействието между MySQL базата данни, Express.js сървърната логика и клиентския административен интерфейс. Реализираният трислоен модел — база данни, API маршрути, клиентски JavaScript — демонстрира ясно разделение на отговорностите и добра архитектурна организация. Всяка административна операция преминава през middleware слой за автентикация и проверка на роля, което гарантира сигурност и контрол.'),
  para('Избраният технологичен стек (Node.js, Express.js, MySQL, Bootstrap) се доказа като подходящ за приложение от тази сложност. Той позволява бърза разработка, добра организация на кода и лесно разширяване. Реализираните защитни механизми — bcrypt, session-based auth, RBAC, multer whitelist — осигуряват базово, но достатъчно за практическа употреба ниво на сигурност.'),
  para('Практическата стойност на системата се изразява в реалната й приложимост за автоматизация на първичния подбор. Тя намалява административната тежест, стандартизира процеса на оценяване и предоставя централизиран инструмент за управление. Системата може да бъде надградена с email известия, динамично управление на тестовите въпроси, статистически панели, облачно съхранение и интеграция с HMS системи.'),

  h2('Насоки за бъдещо развитие'),
  bullet('Динамично управление на тестовите въпроси от административния панел.'),
  bullet('Изпращане на имейл потвърждение при регистрация и при одобрение.'),
  bullet('Разширен статистически модул с графики и филтри по период.'),
  bullet('Многофакторна автентикация за административните акаунти.'),
  bullet('CSRF токени и rate limiting за предотвратяване на brute force атаки.'),
  bullet('Облачно съхранение на CV файловете (AWS S3 или Google Cloud Storage).'),
  bullet('Модул за планиране на интервюта с онлайн календар.'),
  bullet('Progressive Web App версия за по-добро мобилно преживяване.'),
  bullet('Интеграция с Google OAuth за регистрация без парола.'),
  pb(),

  // LITERATURA
  h1('Използвана литература'),
  bullet('[1] Pressman, R. S. Software Engineering: A Practitioner\'s Approach. 8th ed. McGraw-Hill, 2014.'),
  bullet('[2] Sommerville, I. Software Engineering. 10th ed. Pearson, 2015.'),
  bullet('[3] Elmasri, R., Navathe, S. B. Fundamentals of Database Systems. 7th ed. Pearson, 2015.'),
  bullet('[4] Silberschatz, A., Korth, H. F., Sudarshan, S. Database System Concepts. 7th ed. McGraw-Hill, 2019.'),
  bullet('[5] Fowler, M. Patterns of Enterprise Application Architecture. Addison-Wesley, 2002.'),
  bullet('[6] Flanagan, D. JavaScript: The Definitive Guide. 7th ed. O\'Reilly Media, 2020.'),
  bullet('[7] Node.js Official Documentation. nodejs.org/docs/'),
  bullet('[8] Express.js Official Documentation. expressjs.com/'),
  bullet('[9] MySQL Reference Manual. dev.mysql.com/doc/'),
  bullet('[10] bcrypt npm package. npmjs.com/package/bcrypt'),
  bullet('[11] multer npm package. npmjs.com/package/multer'),
  bullet('[12] PDFKit Documentation. pdfkit.org/'),
  bullet('[13] Bootstrap 5 Documentation. getbootstrap.com/docs/5.3/'),
  bullet('[14] MDN Web Docs. developer.mozilla.org/'),
  bullet('[15] OWASP Web Application Security Testing Guide. owasp.org/'),
  pb(),

  // PRILOZHENIE A
  h1('Приложение А. Архитектурен поток на данните'),
  para('Следното описание представя пълния двупосочен поток при административна заявка:'),
  ...codeBox(
`── ЧЕТЕНЕ (GET /admin/api/applications) ─────────────────────────
[Браузър]      loadApplications() → fetch('/admin/api/applications')
[Express.js]   requireAuth()  → проверява req.session.user
               requireAdmin() → проверява role === 'admin'
               db.query('SELECT id, full_name, email ... FROM applications')
[MySQL]        rows[] ← таблица applications
[Express.js]   res.json(rows)
[Браузър]      JSON → HTML таблица

── ЗАПИС (DELETE /admin/api/applications/42) ───────────────────
[Браузър]      deleteApp(42) → fetch('/admin/api/applications/42',
                                     { method: 'DELETE' })
[Express.js]   requireAuth() → requireAdmin()
               db.query('DELETE FROM applications WHERE id = ?', [42])
[MySQL]        affectedRows: 1
[Express.js]   res.json({ ok: true })
[Браузър]      loadApplications() — обновяване на таблицата

── ПРОМЯНА НА РОЛЯ (POST /admin/api/users/role) ────────────────
[Браузър]      changeRole(5, 'admin')
               → fetch('/admin/api/users/role', { method: 'POST',
                  body: JSON.stringify({ id: 5, role: 'admin' }) })
[Express.js]   Проверка: id != req.session.user.id
               Проверка: role ∈ ['user', 'admin']
               db.query('UPDATE users SET role = ? WHERE id = ?',
                        ['admin', 5])
[MySQL]        UPDATE в таблица users
[Express.js]   res.json({ ok: true })`),

  // PRILOZHENIE B
  h1('Приложение Б. Таблица на тестовите сценарии'),
  ...codeBox(
`  №   Сценарий                                Очакван резултат
  ─────────────────────────────────────────────────────────────
  1   Регистрация с валидни данни             Запис в users, redirect /login
  2   Дублиран имейл                          Съобщение, без запис
  3   Дублирано потребителско ime             Съобщение, без запис
  4   Липсващо поле при регистрация           error=missing
  5   Вход с верни данни                      Сесия, redirect /
  6   Вход с грешна парола                    error=invalid
  7   Достъп до /child-test без вход          Redirect /login
  8   Тест >= 70% верни отговори              Запис в results, форма
  9   Тест < 70% верни отговори               Показан резултат
 10   Качване на PDF <= 8MB                   Файлът записан в uploads/cv
 11   Качване на .exe                         Multer отказва заявката
 12   Файл над 8MB                            Limits отказва заявката
 13   Достъп до /admin без admin роля         Redirect /, error=forbidden
 14   Зареждане на кандидатури               JSON → HTML таблица
 15   Изтриване на кандидатура               DELETE, таблицата обновена
 16   Промяна на роля                        UPDATE users.role
 17   Промяна на собствена роля              Отказ, съобщение
 18   Изтриване на собствен акаунт           Отказ, съобщение
 19   Сертификат при преминат тест           PDF изтеглен
 20   Сертификат без преминат тест           HTTP 403`),

];

// ── генериране ────────────────────────────────────────────────────────────────
const doc = new Document({
  creator: 'CrewWave Diploma Generator',
  title:   'Дипломна работа – CrewWave',
  sections: [{ properties: {}, children }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log('DOCX generated: ' + outputPath);
}).catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
