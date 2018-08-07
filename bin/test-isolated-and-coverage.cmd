rem Run coverage and testing via Node.js

node -v
call npm install

node depencyCollector
node sbis3-ws/ws/compileEsAndTs.js
node node_modules/ws-unit-testing/cover -- -t 10000 -R xunit test-report
