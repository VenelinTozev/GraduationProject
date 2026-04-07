require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const addCol = (sql) => new Promise(resolve => {
  db.query(sql, (err) => {
    if (err && err.code !== 'ER_DUP_FIELDNAME') console.error('Migration error:', err.message);
    else console.log('✅', sql.split('ADD COLUMN')[1]?.trim().split(' ')[0] || 'ok');
    resolve();
  });
});

db.connect(async err => {
  if (err) { console.error('DB connect error:', err.message); process.exit(1); }

  // users columns
  await addCol("ALTER TABLE users ADD COLUMN first_name VARCHAR(50) NOT NULL DEFAULT '' AFTER username");
  await addCol("ALTER TABLE users ADD COLUMN last_name VARCHAR(50) NOT NULL DEFAULT '' AFTER first_name");

  // applications columns
  await addCol("ALTER TABLE applications ADD COLUMN motivation TEXT AFTER languages");
  await addCol("ALTER TABLE applications ADD COLUMN has_experience BOOLEAN DEFAULT FALSE AFTER motivation");
  await addCol("ALTER TABLE applications ADD COLUMN experience_detail TEXT AFTER has_experience");
  await addCol("ALTER TABLE applications ADD COLUMN availability VARCHAR(50) AFTER experience_detail");
  await addCol("ALTER TABLE applications ADD COLUMN driver_license BOOLEAN DEFAULT FALSE AFTER availability");
  await addCol("ALTER TABLE applications ADD COLUMN skills JSON AFTER driver_license");
  await addCol("ALTER TABLE applications ADD COLUMN cv_filename VARCHAR(255) AFTER skills");

  db.end();
});
