require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Грешка при връзка с MySQL:', err.message);
  } else {
    console.log('✅ Свързан с MySQL базата данни!');
  }
});

module.exports = db;
