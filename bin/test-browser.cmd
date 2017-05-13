rem Run unit testing via browser

node -v
call npm install

node build
node node_modules/ws-unit-testing/queue test-server test-browser