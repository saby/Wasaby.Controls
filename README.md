# Платформенные визуальные компоненты

## Инструкция по настройке окружения для создания сборок проекта и локального веб-сервера

1. Клонируйте репозиторий с контролами `sbis3-controls`:

		git clone git@git.sbis.ru:sbis/controls.git /path/to/sbis3-controls

2. Переключите репозиторий `sbis3-controls` на нужную ветку, например rc-3.18.150.

3. Клонируйте репозиторий `sbis3-ws`:

        git clone git@git.sbis.ru:sbis/ws.git /path/to/sbis3-controls/sbis3-ws

4. Переключите репозиторий `ws` на нужную ветку, например rc-3.18.150.

5. Создайте внутри папки `sbis3-controls` ссылку на директорию `ws`, а затем переименуйте ссылку в `sbis3-ws`.

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