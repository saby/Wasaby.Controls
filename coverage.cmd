@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" "%~dp0\node_modules\istanbul\lib\cli" cover node_modules/mocha/bin/_mocha %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node "%~dp0\node_modules\istanbul\lib\cli" cover node_modules/mocha/bin/_mocha %*
)