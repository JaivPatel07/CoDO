# CoDO
CoDO (Collaborate and Do) is a student networking and collaboration platform that helps students discover hackathons, events, workshops, and projects, connect with like-minded peers, build professional networks, and find teammates based on skills and interests.


```bash
git clone https://github.com/JaivPatel07/CoDO.git
cd CoDO

cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

```bash
cd frontend
npm install
npm run dev
```
```
CoDO
├─ .agents
├─ backend
│  ├─ config
│  │  ├─ asgi.py
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  ├─ wsgi.py
│  │  └─ __init__.py
│  ├─ manage.py
│  └─ requirements.txt
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ Footer.jsx
│  │  │  └─ Navbar.jsx
│  │  ├─ layout
│  │  │  └─ mainlayout
│  │  │     └─ MainLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Auth
│  │  │  │  ├─ LoginPage.jsx
│  │  │  │  └─ SignupPage.jsx
│  │  │  ├─ Home
│  │  │  │  ├─ HomePage.css
│  │  │  │  └─ HomePage.jsx
│  │  │  └─ Profile
│  │  │     └─ ProfilePage.jsx
│  │  └─ routes
│  │     └─ AppRoutes.jsx
│  └─ vite.config.js
└─ README.md

```