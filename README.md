
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

```
CoDO
├─ .agents
├─ .continue
│  └─ agents
├─ backend
│  ├─ accounts
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ JWT.py
│  │  ├─ managers.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  ├─ 0002_passwordresetotp.py
│  │  │  ├─ 0003_remove_passwordresetotp_is_verified_and_more.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ utils.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ chat
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ consumers.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ routing.py
│  │  ├─ sendMessage.py
│  │  ├─ serializers.py
│  │  ├─ templates
│  │  │  └─ chat.html
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ cloudStorage
│  │  └─ Cloudinary.py
│  ├─ config
│  │  ├─ asgi.py
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  ├─ wsgi.py
│  │  └─ __init__.py
│  ├─ dashboard
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ event
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ manage.py
│  ├─ models.svg
│  ├─ network
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ notification
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ consumers.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ routing.py
│  │  ├─ SendNotification.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ OrganizationProfile
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  ├─ 0002_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ package-lock.json
│  ├─ profiles
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  ├─ 0002_savedcollaborationpost_savedevent_and_more.py
│  │  │  ├─ 0003_githubtokens_github_username.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ requirements.txt
│  ├─ saved
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ teams
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  ├─ usercollabration
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  ├─ 0002_opensourceproject.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  ├─ views.py
│  │  └─ __init__.py
│  └─ workspace
│     ├─ admin.py
│     ├─ apps.py
│     ├─ consumers.py
│     ├─ migrations
│     │  ├─ 0001_initial.py
│     │  └─ __init__.py
│     ├─ models.py
│     ├─ routing.py
│     ├─ serializers.py
│     ├─ tests.py
│     ├─ urls.py
│     ├─ views.py
│     └─ __init__.py
├─ frontend
│  ├─ assets
│  │  └─ coDO.svg
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ coDO.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ api
│  │  │  ├─ auth_apis.js
│  │  │  ├─ axios.js
│  │  │  ├─ chat_apis.js
│  │  │  ├─ dashboard_apis.js
│  │  │  ├─ events_apis.js
│  │  │  ├─ networks_api.js
│  │  │  ├─ notification_apis.js
│  │  │  ├─ opensource_apis.js
│  │  │  ├─ organization_apis.js
│  │  │  ├─ public_apis.js
│  │  │  ├─ saved_apis.js
│  │  │  ├─ save_apis.js
│  │  │  ├─ settings_apis.js
│  │  │  ├─ team_apis.js
│  │  │  ├─ user_apis.js
│  │  │  └─ workspace_apis.js
│  │  ├─ App.jsx
│  │  ├─ components
│  │  │  ├─ AnalyticsChart.jsx
│  │  │  ├─ cards
│  │  │  │  ├─ EventCard.jsx
│  │  │  │  └─ OpenSourceProjectCard.jsx
│  │  │  ├─ CollabrationPostCard.jsx
│  │  │  ├─ ErrorBanner.jsx
│  │  │  ├─ EventBoard.jsx
│  │  │  ├─ Footer.jsx
│  │  │  ├─ Navbar.jsx
│  │  │  ├─ OrganizationPostCard.jsx
│  │  │  ├─ ProfilePic.jsx
│  │  │  ├─ SkeletonPostLoader.jsx
│  │  │  ├─ TeamRequiredPostCard.jsx
│  │  │  ├─ TrendingEvents.jsx
│  │  │  └─ UpcomingEvents.jsx
│  │  ├─ contextAPI
│  │  │  └─ userContext.jsx
│  │  ├─ hooks
│  │  │  └─ useTheme.js
│  │  ├─ index.css
│  │  ├─ layout
│  │  │  ├─ mainlayout
│  │  │  │  └─ MainLayout.jsx
│  │  │  └─ OrganizationLayout.jsx
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Auth
│  │  │  │  ├─ ForgotPassword
│  │  │  │  │  ├─ ForgotPasswordPage.jsx
│  │  │  │  │  ├─ ResetPasswordPage.jsx
│  │  │  │  │  └─ VerifyOTPPage.jsx
│  │  │  │  ├─ GitHub
│  │  │  │  │  └─ githublogin.jsx
│  │  │  │  ├─ LoginPage.jsx
│  │  │  │  └─ SignupPage.jsx
│  │  │  ├─ ChatPages
│  │  │  │  └─ ChatPage.jsx
│  │  │  ├─ Events
│  │  │  │  ├─ CalendarPage.jsx
│  │  │  │  ├─ EventDetailsPage.jsx
│  │  │  │  └─ EventsPage.jsx
│  │  │  ├─ LandingPage
│  │  │  │  └─ LandingPage.jsx
│  │  │  ├─ Network
│  │  │  │  ├─ SuggestionCard.jsx
│  │  │  │  ├─ SuggestionCardSkeleton.jsx
│  │  │  │  └─ Suggestions.jsx
│  │  │  ├─ Organization_Pages
│  │  │  │  ├─ EventFormPage.jsx
│  │  │  │  ├─ OrganizationDashboardPage.jsx
│  │  │  │  ├─ OrganizationEventsPage.jsx
│  │  │  │  ├─ OrganizationProfileForm.jsx
│  │  │  │  └─ OrganizationProfilePage.jsx
│  │  │  ├─ Page_not_found.jsx
│  │  │  ├─ User_Pages
│  │  │  │  ├─ collabration
│  │  │  │  │  └─ CollabrationHomePage.jsx
│  │  │  │  ├─ Home
│  │  │  │  │  └─ HomePage.jsx
│  │  │  │  ├─ Logout.jsx
│  │  │  │  ├─ NotificationPage.jsx
│  │  │  │  ├─ OpenSourceCollaborationPage.jsx
│  │  │  │  ├─ OpenSourceProjectDetailsPage.jsx
│  │  │  │  ├─ PostManagePage.jsx
│  │  │  │  ├─ ProfileForm
│  │  │  │  │  └─ ProfileForm.jsx
│  │  │  │  ├─ SettingsPage.jsx
│  │  │  │  ├─ TeamInvite.jsx
│  │  │  │  ├─ UserPostForm.jsx
│  │  │  │  └─ UserProfile
│  │  │  │     └─ ProfilePage.jsx
│  │  │  └─ WorkSpace
│  │  │     ├─ WorkSpaceHomePage.jsx
│  │  │     └─ WorkSpacePage.jsx
│  │  ├─ reusable_methods
│  │  │  └─ time_calculator.js
│  │  ├─ routes
│  │  │  └─ AppRoutes.jsx
│  │  ├─ services
│  │  │  ├─ api.jsx
│  │  │  └─ authService.jsx
│  │  └─ utils
│  │     ├─ eventHelpers.js
│  │     ├─ format.js
│  │     ├─ githubHelpers.js
│  │     ├─ opensourceHelpers.js
│  │     └─ projectHelpers.js
│  └─ vite.config.js
├─ functionality.md
├─ how_to_run.txt
├─ new_added.txt
├─ README.md
└─ requirements.txt

```