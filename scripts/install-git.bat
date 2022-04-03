::  Copyright (C):  2017  Pat Migliaccio
::    pat@patmigliaccio.com
::
::  LICENSE: MIT
::
::  File: install-git.bat
::
::  Batch file for a quick install of Git for Windows
::    Include the git*.exe install executable
::    in the same directory as this script.
::
::  Usage:
::    .\install-git [path]
::
::  Arguments:
::    path : Directory to install to (defaults to "C:\Program Files\Git")
::
::  Repository: https://gist.github.com/patmigliaccio/c3fba12e4b6a62db70ad3ef791e29302
::  License: MIT


@echo off

set installDir=%1
if [%1]==[] set installDir="C:\Program Files\Git"
set installDir=%installDir:"=%

(
    echo [Setup]
    echo Lang=default
    echo Dir=%installDir%
    echo Group=Git
    echo NoIcons=0
    echo SetupType=default
    echo Components=icons,ext\reg\shellhere,assoc,assoc_sh
    echo Tasks=
    echo PathOption=Cmd
    echo SSHOption=OpenSSH
    echo CRLFOption=CRLFAlways
    echo BashTerminalOption=ConHost
    echo PerformanceTweaksFSCache=Enabled
    echo UseCredentialManager=Enabled
    echo EnableSymlinks=Disabled
    echo EnableBuiltinDifftool=Disabled
) > config.inf

for /r %%f in (git*.exe) do (
    call set file="%%f"
    @echo on
    @echo %%f
    @echo off
)

if [%file%]==[] (
    @echo on
    @echo Error finding "git*.exe" install executable. File may not exist or is not named with the "git" prefix.
    exit /b 2
)

@echo on
@echo Installing..
@echo off
%file% /VERYSILENT /LOADINF="config.inf"
if errorlevel 1 (
    @echo on
    if %errorLevel% == 1 ( echo Error opening %file%. File may be corrupt. )
    if %errorLevel% == 2 ( echo Error reading %file%. May require elevated privileges. Run as administrator. )
    exit /b %errorlevel%
)
del config.inf

net session >nul 2>&1
if %errorLevel% == 0 (
    pathman /as "%PATH%;%installDir%/cmd"
    exit 0
) else (
    @echo on
    echo SYSTEM PATH Environment Variable may not be set, may require elevated privileges. Run as administrator if it doesn't already exist.
    exit /b 0
)
