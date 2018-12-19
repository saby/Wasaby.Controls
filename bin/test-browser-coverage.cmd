rem Run unit testing via browser

node -v
call npm install

node node_modules/istanbul/lib/cli instrument --complete-copy --output components-covered components
node node_modules/istanbul/lib/cli instrument --complete-copy --output Controls-covered Controls

@rename components components-origin
@rename components-covered components
@rename Controls Controls-origin
@rename Controls-covered Controls

node depencyCollector
py build.py
node node_modules/saby-units/queue test-server test-browser-coverage

@rmdir /S /Q components
@rename components-origin components
@rmdir /S /Q Controls
@rename Controls-origin Controls

node coverageUnusedFiles

node node_modules/istanbul/lib/cli report --dir "coverage-report" --include "**\coverage.json" html
node node_modules/istanbul/lib/cli report --dir "cobertura" --include "**\coverage.json" cobertura
node node_modules/istanbul/lib/cli report --dir "coverage-controls-report" --include "**\coverageControls.json" html
node node_modules/istanbul/lib/cli report --dir "coverage-components-report" --include "**\coverageComponents.json" html
