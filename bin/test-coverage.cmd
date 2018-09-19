rem Run coverage via Node.js

node -v
call npm install

node depencyCollector
py build.py
node sbis3-ws/compileEsAndTs.js
node node_modules/ws-unit-testing/cover --amd test-isolated
