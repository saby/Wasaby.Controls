rem Run testing via Node.js

node -v

node node_modules/saby-units/mocha -t 10000 -R xunit --amd test-report
