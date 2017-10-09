rem Скрипт компилит js-скрипты для ts-скриптов

node -v
call npm install
node ./node_modules/typescript/lib/tsc -p ./spec/tsconfig.json