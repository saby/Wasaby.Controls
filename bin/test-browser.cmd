echo *** Run unit tests via browser ***

node -v
call npm install
call npm install selenium-standalone@4.4.2 webdriverio@2.4.5
call node node_modules/selenium-standalone/bin/selenium-standalone install

node depencyCollector
node tests/unit/list.build
node queue app tests/unit/browser.run