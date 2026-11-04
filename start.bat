@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ======================================================
echo   Запуск веб-сервісу «Житомир Рух»
echo ======================================================
echo.
where node > nul 2>&1
if errorlevel 1 (
  echo Не знайдено Node.js. Встановіть Node.js 18 або новіший.
  pause
  exit /b 1
)
start "Житомир Рух — локальний сервер" node server.js
timeout /t 2 /nobreak > nul
start "" http://localhost:8097
echo Сайт відкриється в браузері. Щоб зупинити сервер, закрийте його вікно.
