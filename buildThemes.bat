@echo off

set themespath=.\themes\

for /r "%themespath%" /d %%i in (*) do (
   if exist "%%i\%%~ni.less" (
      echo %%i\%%~ni.less
      call .\build\duncansmart-less\lessc.cmd "%%i\%%~ni.less" "%%i\%%~ni.css"
   )
)

xcopy /E components "SBIS3.CONTROLS\components"
xcopy /E themes "SBIS3.CONTROLS\themes"