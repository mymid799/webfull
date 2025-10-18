@echo off
echo Starting both servers...
echo.
echo Starting Backend Server in new window...
start "Backend Server" cmd /k "cd Website-main\backend && node server.js"
echo.
echo Starting Frontend Server in new window...
start "Frontend Server" cmd /k "cd Website-main\safe-download-react && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
