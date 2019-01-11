# Платформенные визуальные компоненты

## Инструкция по настройке окружения для создания сборок проекта и локального веб-сервера

### Для ОС Windows

1. Клонируйте репозиторий с контролами `sbis3-controls`:

        git clone git@git.sbis.ru:sbis/controls.git /path/to/sbis3-controls

2. Переключите репозиторий `sbis3-controls` на нужную ветку, например rc-3.18.150.

3. Клонируйте репозиторий `sbis3-ws`:

        git clone git@git.sbis.ru:sbis/ws.git /path/to/sbis3-controls/sbis3-ws

4. Переключите репозиторий `sbis3-ws` на нужную ветку, например rc-3.18.150.

5. Создайте внутри папки `sbis3-controls` ссылку на директорию `sbis3-ws`.

6. Клонируйте репозиторий `ws-data`:

        git clone git@git.sbis.ru:ws/data.git /path/to/ws-data

7. Переключите репозиторий `ws-data` на нужную ветку, например rc-3.18.150.
        
8. Создайте внутри папки `sbis3-controls` ссылку с именем `WS.Data` на директорию `/path/to/ws-data/WS.Data`.

9. Клонируйте репозиторий `sbis3-cdn`:

        git clone git@git.sbis.ru:root/sbis3-cdn.git /path/to/sbis3-cdn

10. Переключите репозиторий `sbis3-cdn` на нужную ветку, например rc-3.18.150.

11. Создайте внутри папки `sbis3-controls` ссылку с именем `cdn` на директорию `sbis3-cdn/var/www/cdn`.

12. Установите [Node.js](http://nodejs.org/) и [NPM](http://npmjs.com).

13. Установите глобально интерфейс командной строки [Grunt.js](http://gruntjs.com):

        npm install -g grunt-cli

14. Из корневой директории репозитория `sbis3-controls` установите пакеты, требуемые для разработки:

        npm install

15. Из корневой директории репозитория `sbis3-controls` соберите проект:

        grunt

Команды по работе с grunt можно найти в разделе ниже.

16. Для запуска локального веб-сервера из папку `sbis3-controls` выполните:

        node app

17. Локальный веб-сервер будет поднят по адресу https://localhost:666/. Стартовая страница с демо-примерами https://localhost:666/index.html.

### Для ОС Linux

Для Linux последовательность действий идентична, как в Windows. Однако есть ограничение, что можно использовать любые порты, начиная с 2000.
Поэтому начиная с шага № 16 будут изменения:

16. Найдите в корне папки `sbis3-controls` файл `app.js` и откройте его на редактирование:

    1) найдите строку:

            var port = process.env.PORT || 666;

    2) измените порт на 2666:

            var port = process.env.PORT || 2666;

17. Найдите в корне папки `sbis3-controls` файл `package.json` и откройте его на редактирование:


    1) найдите строки:

            "test_server_port": 1025,

            "port": 1025,

    2) измените порт на 2025:

            "test_server_port": 2025,

            "port": 2025,

18. Из корневой директории репозитория `sbis3-controls` соберите проект:

        grunt

Команды по работе с grunt можно найти в разделе ниже.

19. Для запуска локального веб-сервера из папку `sbis3-controls` выполните:

        node app

20. Локальный веб-сервер будет поднят по адресу https://localhost:2666/. Стартовая страница с демо-примерами https://localhost:2666/index.html.

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
