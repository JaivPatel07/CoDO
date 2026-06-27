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