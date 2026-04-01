@echo off
echo ==========================================
echo XAMPP MySQL "Unexpected Shutdown" Fixer
echo ==========================================
echo.
echo 1. Stopping any ghost MySQL processes...
taskkill /F /IM mysqld.exe /T >nul 2>&1

echo 2. Backing up and clearing corrupted log files...
cd /d "C:\xampp\mysql\data"

if exist ib_logfile0 ren ib_logfile0 ib_logfile0.bak
if exist ib_logfile1 ren ib_logfile1 ib_logfile1.bak
if exist aria_log_control ren aria_log_control aria_log_control.bak
if exist mysql-bin.index ren mysql-bin.index mysql-bin.index.bak

echo.
echo 3. Attempting to restart MySQL...
echo Please try to click START in XAMPP Control Panel now.
echo.
echo If it still fails, you may need to copy files from 
echo C:\xampp\mysql\backup to C:\xampp\mysql\data (excluding your DB folders).
echo.
pause
