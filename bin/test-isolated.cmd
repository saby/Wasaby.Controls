echo *** Run unit tests via Node.js ***

node -v
call npm install

node depencyCollector
node tests/unit/list.build
node mocha -t 10000 -R XUnit tests/unit/isolated.run