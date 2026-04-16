@echo off
echo Starting Frontend and Backend in separate terminals...
start cmd /k "cd frontend && npm run dev"
start cmd /k "cd Library && python manage.py runserver"
