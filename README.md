# Feeds Application

A full stack social feeds application built with Django REST Framework and React.

## Features
- JWT authentication with token refresh and blacklisting
- Role-based access control (User / Admin)
- Post creation with admin approval workflow
- Two-panel feed layout
- Admin panel for post moderation and user management
- Instagram-style profile page

## Tech Stack
Backend: Django REST Framework, SimpleJWT, PostgreSQL
Frontend: React, Vite, Material UI, Axios

## Backend Setup
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

## Frontend Setup
cd frontend
npm install
npm run dev
