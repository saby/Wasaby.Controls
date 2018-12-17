rem Run unit testing via browser

node -v
call npm install

node node_modules/saby-units/queue test-server test-browser
