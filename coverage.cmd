SET PACKAGE=%~dp0node_modules\istanbul\lib\cli.js
SET ARGS=cover --hook-run-in-context node_modules/mocha/bin/_mocha
@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" "%PACKAGE" %ARGS%*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node %PACKAGE
)
