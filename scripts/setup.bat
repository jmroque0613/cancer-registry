@echo off
echo ============================================
echo  Cancer Registry - Windows Setup
echo ============================================
echo.
echo Step 1: Copying .env file...
copy .env.example .env
echo.
echo Step 2: Pulling Docker images (this may take a while)...
docker compose pull
echo.
echo Step 3: Starting infrastructure...
docker compose up -d
echo.
echo ============================================
echo  Infrastructure is running!
echo ============================================
echo.
echo Next steps:
echo.
echo [FastAPI] Open a new terminal:
echo   cd backend\fastapi_service
echo   python -m venv .venv
echo   .venv\Scripts\activate
echo   pip install -r requirements.txt
echo   uvicorn app.main:app --reload --port 8001
echo.
echo [Django] Open another terminal:
echo   cd backend\django_service
echo   python -m venv .venv
echo   .venv\Scripts\activate
echo   pip install -r requirements.txt
echo   python manage.py migrate
echo   python manage.py runserver 8002
echo.
echo [Next.js] Open another terminal:
echo   cd frontend
echo   pnpm install
echo   pnpm dev
echo.
echo Visit http://localhost:3000 when all three are running.
