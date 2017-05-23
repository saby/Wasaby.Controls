rem Run unit testing via browser

node -v
call npm install

node depencyCollector
node node_modules/ws-unit-testing/queue test-server test-browser