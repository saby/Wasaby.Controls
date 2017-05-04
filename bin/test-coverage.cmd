rem Run coverage via Node.js

node -v
call npm install

node build
node node_modules/ws-unit-testing/cover test-isolated
