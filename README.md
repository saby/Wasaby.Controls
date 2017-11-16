# Платформенные визуальные компоненты

## Окружение разработки

1. Клонировать репозиторий с контролами `sbis3-controls`:

		git clone git@git.sbis.ru:sbis/controls.git /path/to/sbis3-controls

2. Клонировать репозиторий `sbis3-ws` в поддиректорию `sbis3-ws`:

        git clone git@git.sbis.ru:sbis/ws.git /path/to/sbis3-controls/sbis3-ws

3. Клонировать репозиторий `ws-data` :

        git clone git@git.sbis.ru:ws/data.git /path/to/ws-data
        
4. Слинковать директорию `/path/to/ws-data/WS.Data` в поддиректорию `WS.Data`:

5. Клонировать репозиторий `sbis3-cdn` :

        git clone git@git.sbis.ru:root/sbis3-cdn.git /path/to/sbis3-cdn
        
6. Слинковать директорию `sbis3-cdn/var/www/cdn` в поддиректорию `cdn`.

7. Установить [Node.js](http://nodejs.org/) и [NPM](http://npmjs.com).

8. Установить глобально интерфейс командной строки [Grunt.js](http://gruntjs.com):

        npm install -g grunt-cli

9. Из корневой директории репозитория установить пакеты, требуемые для разработки:

        npm install

10. Собрать проект:

        grunt

## Команды Grunt

- `grunt` или `grunt build` (по умолчанию) - полностью собрать проект;
- `grunt rebuild` - пересобрать проект, предварительно удалив предыдущую сборку;
- `grunt clean` - удалить текущую сборку проекта;
- `grunt build-dependencies` - построить файлы `contents.js` и `contents.json` зависимостей модулей;
- `grunt js` - провести статический анализ JS-кода (минификация JS-кода в будущем, если потребуется);
- `grunt css` - скомпилировать все темы LESS в CSS;
- `grunt css --name=<name>` - скомпилировать файл LESS с именем `<name>` в CSS , например: `grunt --name=carry`;
- `grunt copy` - скопировать директории `components` и `themes` в директорию `SBIS3.CONTROLS`;
- `grunt watch` - следить за изменениями в LESS файлах тем и перекомпилировать их;
- `grunt run` - собрать проект, поднять тестовый локальный веб-сервер на 666-м порту и запустить `watch`.