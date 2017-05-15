Пошаговая инструкция для запуста тестов локально по контролам

   1) поставить npm:                      npm install

   2) собрать зависимости:                node depencyCollector

   3) собрать список тестов:              node tests/unit/list.build.js

   4) поднять тестовый стенд:             node app.js

   5) перейти по адресу  http://localhost:666/tests/unit/browser.html

Поздравляю!!! Вы великолепны.


Свои тесты необходимо помещать в tests\unit\tests\ в файл *.test.js
Примеры тестов можно посмотреть в этом же каталоге