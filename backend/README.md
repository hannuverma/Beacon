This backend provides a simple Django API for the Night Hunt app.

Setup (from `backend` folder):

1. Create a virtual environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Apply migrations and create a superuser:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

3. Run the development server:

```bash
python manage.py runserver
```

API endpoints:

- `GET /api/hosts/` - list hosts
- `POST /api/hosts/` - create host
- `GET /api/hosts/{id}/` - retrieve host
- `POST /api/hosts/{id}/toggle/` - toggle `is_open` state
- `GET /api/users/` - list user profiles

CORS:
- The settings allow `http://localhost:5173` and `http://localhost:3000` for local frontend development.
