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
supabase connection:

1. Create a Supabase account and project at [Supabase](https://supabase.io/).
2. In the Supabase create a project and open it 
3. in nevigate you see green connect button click on it 
4. nevigate to Direct 
5. scroll down and copy the the host port database name user
6. create a .env file in the backend folder and add the following variables:
    ```
    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_HOST=your_database_host
    DB_PORT=5432
    ```
7. python manage.py makemigrations
8. python manage.py migrate
9. python manage.py runserver


```
CoDO
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