rem Run coverage and testing via Node.js

node -v
call npm install

node build
node node_modules/ws-unit-testing/cover -- -t 10000 -R xunit test-report
