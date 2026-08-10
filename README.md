# CoDO (Collaborate and Do)

**CoDO** is a student networking and collaboration platform designed to help students discover hackathons, workshops, competitions, and open-source projects. It enables users to connect with like-minded peers, build professional networks, and find teammates based on their skills and interests.

## Features

- **Student Networking:** Connect with peers and expand your professional network.
- **Project Collaboration:** Find and recruit teammates for hackathons, open-source projects, and assignments.
- **Professional Profiles:** Showcase your skills, experience, and GitHub contributions.
- **Event Announcements:** Stay updated on upcoming workshops, competitions, and tech events.
- **Hackathon Discovery:** Find and register for hackathons globally.
- **GitHub Integration:** Seamlessly link your GitHub account to showcase your repositories.
- **Secure Authentication:** JWT-based authentication for robust security.
- **Profile Management:** Fully customizable user and organization profiles.

## Technology Stack

### Frontend
- React.js
- Vite
- React Router

### Backend
- Django
- Django REST Framework
- JWT Authentication
- PostgreSQL (Supabase)
- Pillow (Image Processing)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/JaivPatel07/CoDO.git
cd CoDO
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

**Windows:**
```bash
python -m venv .venv
.venv\Scripts\activate
```

**Linux / macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

Set up your PostgreSQL database using Supabase (see [Database Configuration](#database-configuration)). Then, apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```
The backend server will run at `http://127.0.0.1:8000`.

### 3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```
The frontend application will be available at `http://localhost:5173`.

---

## Database Configuration (Supabase)

1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project.
3. Navigate to **Project Settings** > **Database** to find your connection details.
4. Note down the following credentials: Host, Port, Database, User, and Password.

Create a `.env` file in the `backend` directory and add the following variables:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True

DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=5432
```

---

## Project Structure

An overview of the core directories in this repository:

```
CoDO/
├── backend/                  # Django REST Framework backend
│   ├── accounts/             # User authentication and JWT logic
│   ├── chat/                 # Real-time messaging implementation
│   ├── config/               # Main Django settings and configurations
│   ├── dashboard/            # Admin and user dashboard APIs
│   ├── event/                # Event management and registration
│   ├── network/              # User connection and networking logic
│   ├── notification/         # System and real-time notifications
│   ├── OrganizationProfile/  # Organization-specific profiles
│   ├── profiles/             # User profile management and GitHub integration
│   ├── teams/                # Team creation and management
│   ├── usercollabration/     # Open-source project and collaboration features
│   └── workspace/            # Collaborative workspace environments
│
├── frontend/                 # React and Vite frontend
│   ├── public/               # Static assets
│   └── src/
│       ├── api/              # Axios instances and API call definitions
│       ├── components/       # Reusable UI components (Cards, Navbars, etc.)
│       ├── contextAPI/       # React Context for global state management
│       ├── hooks/            # Custom React hooks (e.g., useTheme)
│       ├── layout/           # Application layout wrappers
│       ├── pages/            # View components (Auth, Dashboard, Profiles, etc.)
│       ├── services/         # Business logic and external service integrations
│       └── utils/            # Helper functions and formatting utilities
```

---

## Useful Commands

Here is a quick reference for frequently used commands:

**Django (Run from `/backend`)**
- Create migrations: `python manage.py makemigrations`
- Apply migrations: `python manage.py migrate`
- Create a superuser: `python manage.py createsuperuser`
- Start server: `python manage.py runserver`

**React (Run from `/frontend`)**
- Install dependencies: `npm install`
- Start server: `npm run dev`
- Build for production: `npm run build`

---

## Contributing

We welcome contributions to CoDO. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes with clear, descriptive messages:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push your branch to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request detailing your changes.