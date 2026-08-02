
# functionality.md kasu kam karvu hoy to aema joi lejo

# CoDO

> **CoDO (Collaborate and Do)** is a student networking and collaboration platform that helps students discover hackathons, workshops, competitions, and projects, connect with like-minded peers, build professional networks, and find teammates based on their skills and interests.

---

## 🚀 Features

* 👥 Student networking
* 🤝 Find project teammates
* 💼 Professional profiles
* 📢 Event announcements
* 🏆 Hackathon & workshop discovery
* 💻 GitHub integration
* 🔐 JWT Authentication
* 📝 Profile management

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router

### Backend

* Django
* Django REST Framework
* JWT Authentication
* PostgreSQL (Supabase)
* Pillow

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/JaivPatel07/CoDO.git
cd CoDO
```

---

# Backend Setup

Navigate to the backend folder.

```bash
cd backend
```

Create a virtual environment.

### Windows

```bash
python -m venv .venv
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Run migrations.

```bash
python manage.py migrate
```

Start the Django server.

```bash
python manage.py runserver
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Open a new terminal.

```bash
cd frontend
```

Install packages.

```bash
npm install
```

Start the development server.

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# PostgreSQL (Supabase) Setup

1. Create an account at https://supabase.com
2. Create a new project.
3. Click **Connect**.
4. Open the **Direct Connection** section.
5. Copy the following values:

   * Host
   * Port
   * Database
   * User
   * Password

Create a `.env` file inside the **backend** folder.

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
```

After configuring the database run:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

---

# Project Structure

```
CoDO
│
├── backend
│   ├── accounts
│   ├── profiles
│   ├── config
│   ├── manage.py
│   └── requirements.txt
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── layout
│   │   ├── pages
│   │   ├── routes
│   │   └── services
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# Environment Variables

Create a `.env` file inside the **backend** directory.

```env
SECRET_KEY=your_secret_key

DEBUG=True

DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
```

---

# Useful Commands

Create migrations

```bash
python manage.py makemigrations
```

Apply migrations

```bash
python manage.py migrate
```

Create superuser

```bash
python manage.py createsuperuser
```

Run backend

```bash
python manage.py runserver
```

Run frontend

```bash
npm run dev
```

---

# Contributing

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes.

```bash
git commit -m "Add your feature"
```

4. Push your branch.

```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request.

---
