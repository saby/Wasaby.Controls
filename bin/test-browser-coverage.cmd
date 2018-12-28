rem Run unit testing via browser

node -v

# собираем зависимости и запускаем сбор покрытия
call npm install
call node build-app
call npm run test:browser-coverage

node coverageUnusedFiles

node node_modules/istanbul/lib/cli report --dir "coverage-report" --include "**\coverage.json" html
node node_modules/istanbul/lib/cli report --dir "cobertura" --include "**\coverage.json" cobertura
node node_modules/istanbul/lib/cli report --dir "coverage-controls-report" --include "**\coverageControls.json" html
node node_modules/istanbul/lib/cli report --dir "coverage-components-report" --include "**\coverageComponents.json" html
