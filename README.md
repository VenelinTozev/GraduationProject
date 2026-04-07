# CrewWave — Graduation Project

A full-stack web application built with **Node.js**, **Express**, and **MySQL** as a diploma project. The platform allows users to register, take aptitude tests (child or sport-themed), apply for positions with a CV upload, and receive a diploma certificate upon passing. An admin panel provides full management of users and applications.

---

## Features

- User registration, login, and session-based authentication
- Password hashing with bcrypt
- Role-based access control (`user` / `admin`)
- Forgot password functionality
- Two aptitude test tracks: **Child** and **Sport**
- Animated intro pages before each test
- Automatic score calculation with pass/fail result
- Post-test job application form with CV upload
- Diploma generation in **DOCX** and **PDF** formats
- Admin panel to manage users and applications
- File uploads: PDF, DOC, DOCX, JPG, PNG (max 8 MB)

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Runtime    | Node.js                             |
| Framework  | Express 5                           |
| Database   | MySQL (mysql2)                      |
| Auth       | express-session, bcrypt             |
| Uploads    | multer                              |
| PDF        | pdfkit                              |
| DOCX       | docx                                |
| Config     | dotenv                              |

---

## Project Structure

```
├── server.js                  # Main Express server & all routes
├── database.sql               # Full MySQL schema
├── seed_questions.js          # Database seeder for test questions
├── migrate_names.js           # Database migration script
├── generate_diploma_docx.js   # Diploma generation (DOCX)
├── generate_diploma_pdf.js    # Diploma generation (PDF)
├── generate_diploma_pdf_50.js # Diploma generation (PDF variant)
├── config/
│   └── db.js                  # MySQL connection
├── views/
│   ├── index.html             # Home page
│   ├── register.html          # Registration
│   ├── login.html             # Login
│   ├── forgot-password.html   # Password recovery
│   ├── test-apply.html        # Test selection page
│   ├── child-animation.html   # Child test intro animation
│   ├── child-test.html        # Child aptitude test
│   ├── sport-animation.html   # Sport test intro animation
│   ├── sport-test.html        # Sport aptitude test
│   ├── result.html            # Test result page
│   ├── apply.html             # Job application page
│   ├── post-test-apply.html   # Post-test application form
│   └── admin.html             # Admin panel
├── public/
│   ├── css/style.css
│   ├── js/script.js
│   ├── fonts/
│   └── images/
└── uploads/
    └── cv/                    # Uploaded CV files
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/VenelinTozev/GraduationProject.git
   cd GraduationProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**

   Create a MySQL database and run the schema:
   ```bash
   mysql -u root -p < database.sql
   ```

   Seed the test questions:
   ```bash
   node seed_questions.js
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_database_name
   SESSION_SECRET=your_secret_key
   PORT=3000
   ```

5. **Start the server**
   ```bash
   node server.js
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## Database Schema

| Table          | Description                              |
|----------------|------------------------------------------|
| `users`        | Registered users with roles              |
| `applications` | Job applications with CV and details     |
| `tests`        | Test definitions (child / sport)         |
| `questions`    | Test questions with 4 options each       |
| `results`      | User test scores and pass/fail status    |

---

## Environment Variables

| Variable         | Description                        |
|------------------|------------------------------------|
| `DB_HOST`        | MySQL host (e.g. `localhost`)      |
| `DB_USER`        | MySQL username                     |
| `DB_PASSWORD`    | MySQL password                     |
| `DB_NAME`        | MySQL database name                |
| `SESSION_SECRET` | Secret key for session encryption  |
| `PORT`           | Server port (default: `3000`)      |

---

## License

This project was created as a diploma/graduation thesis. All rights reserved.
