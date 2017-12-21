rem Run coverage via Node.js

node -v
call npm install

node depencyCollector
py build.py
node node_modules/ws-unit-testing/cover test-isolated
