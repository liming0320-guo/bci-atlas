@echo off
chcp 65001 >nul
title BCI Atlas - iPad Wi-Fi Server
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-ipad.ps1"
echo.
pause
