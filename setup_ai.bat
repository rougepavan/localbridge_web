@echo off
echo ==========================================
echo LocalBridge AI Dependencies Setup
echo ==========================================
echo.
echo This will install TensorFlow, Torch, and Transformers.
echo These are large files and may take a few minutes.
echo.
python -m pip install -r requirements_ai.txt
echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] AI Dependencies installed correctly!
    echo Please restart your app1.py server.
) else (
    echo [ERROR] Installation failed. Please check your internet connection.
)
pause
