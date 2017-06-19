rem Run testing via Node.js

node -v
call npm install

node depencyCollector
node node_modules/ws-unit-testing/mocha -t 10000 -R xunit test-report