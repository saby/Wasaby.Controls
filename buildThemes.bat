@echo off

set themespath=.\themes\

for /r "%themespath%" /d %%i in (*) do (
   if exist "%%i\%%~ni.less" (
      echo %%i\%%~ni.less
      call .\build\duncansmart-less\lessc.cmd "%%i\%%~ni.less" "%%i\%%~ni.css"
   )
)

xcopy "components" "SBIS3.CONTROLS\components\" /S /E 
xcopy "themes" "SBIS3.CONTROLS\themes\" /S /E 