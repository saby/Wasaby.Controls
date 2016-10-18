echo *** Run coverage test via Node.js ***

node -v
call npm install

node depencyCollector
node tests/unit/list.build
node coverage tests/unit/coverage.run