@echo off

@REM thx bestie https://stackoverflow.com/a/66953682
rem --Download python installer
curl "https://www.python.org/ftp/python/3.9.12/python-3.9.12-amd64.exe" -o python-installer.exe

@echo installing python!
rem --Install python
python-installer.exe /quiet InstallAllUsers=1 PrependPath=1

rem --Refresh Environmental Variables
call RefreshEnv.cmd

@echo installing dependencies!
rem --Use python, pip
pip install -r ../requirements.txt

pause
