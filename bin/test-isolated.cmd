rem Run testing via Node.js

node -v
call npm install

node depencyCollector
node sbis3-ws/ws/compileEsAndTs.js
py build.py
node node_modules/ws-unit-testing/mocha -t 10000 -R xunit test-report