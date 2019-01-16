# Платформенные визуальные компоненты

## Сборка и запуск

1. Клонируйте репозиторий с контролами, например в папку `sbis3-controls` (все команды в следующих пунктах нужно будет выполнять в этой папке):

        git clone git@git.sbis.ru:sbis/controls.git /path/to/sbis3-controls

1. Переключите репозиторий на нужную ветку, например rc-19.100:

        git checkout rc-19.100

1. Установите [Node.js](http://nodejs.org/) и [NPM](http://npmjs.com).

1. Установите зависимости:

        npm install

1. Cоберите проект:

        npm run build

1. Для запуска локального демо-стенда по адресу [localhost:666](http://localhost:666/) выполните:

        npm start

1. Для запуска юнит-тестов под Node.js выполните:

        npm test

1. Для запуска сервера с юнит-тестами по адресу [localhost:1025](http://localhost:1025/) выполните:

        npm run start:units

### Для ОС Linux

Для Linux последовательность действий идентична, однако есть ограничение - можно использовать любые порты, начиная с 2000. Поэтому сделайте следующее:

1. Найдите в корне папки `sbis3-controls` файл `app.js` и откройте его на редактирование:

    1. найдите строку:

            var port = process.env.PORT || 666;

    1. измените порт на 2666:

            var port = process.env.PORT || 2666;

1. Найдите в корне папки `sbis3-controls` файл `package.json` и откройте его на редактирование:

    1. найдите раздел `saby-units/url` и измените значение параметра `port`:

            "port": 1025

    1. на 2025:

            "port": 2025

## Команды Grunt

- `grunt` или `grunt build` (по умолчанию) - полностью собрать проект;
- `grunt rebuild` - пересобрать проект, предварительно удалив предыдущую сборку;
- `grunt clean` - удалить текущую сборку проекта;
- `grunt build-dependencies` - построить файлы `contents.js` и `contents.json` зависимостей модулей;
- `grunt js` - провести статический анализ JS-кода (минификация JS-кода в будущем, если потребуется);
- `grunt css` - скомпилировать все темы LESS в CSS;
- `grunt css --name=<name>` - скомпилировать файл LESS с именем `<name>` и темы online,presto,carry в CSS , например: `grunt --name=carry`;
- `grunt css --name=<name>` --withThemes=false - скомпилировать только файл LESS с именем `<name>` в CSS например: `grunt --name=InputRender --withThemes=false`;
- `grunt cssC` - скомпилировать все LESS файлы в папке components и темы online,presto,carry в CSS;
- `grunt cssV` - скомпилировать все LESS файлы в папке Controls и темы online,presto,carry в CSS;
- `grunt cssD` - скомпилировать все LESS файлы в папке Controls-demo и темы online,presto,carry в CSS;
- `grunt cssE` - скомпилировать все LESS файлы в папке Examples и темы online,presto,carry в CSS;
- `grunt copy` - скопировать директории `components` и `themes` в директорию `SBIS3.CONTROLS`;
- `grunt watch` - следить за изменениями в LESS файлах тем и перекомпилировать их;
- `grunt run` - собрать проект, поднять тестовый локальный веб-сервер на 666-м порту и запустить `watch`.
