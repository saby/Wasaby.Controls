# Введение в работу с Gemini

[Gemini](https://github.com/gemini-testing/gemini) – это утилита для регрессионного тестирования отображения веб-страниц.

Ключевые возможности:

* Работа в различных браузерах (см. [замечания о работе в IE](https://github.com/gemini-testing/gemini/blob/master/doc/ie-support.ru.md));
* Тестирование фрагментов веб-страниц;
* Учет свойств `box-shadow` и `outline` при вычислении позиции и размера элемента;
* Игнорирование не ошибочных различий между изображениями (артефакты рендеринга, текстовая каретка);
* Сбор статистики покрытия CSS-кода тестами.

Gemini создан в [Яндексе](http://www.yandex.com/) и используется разработчиками библиотек блоков.

Данный документ шаг за шагом описывает установку и настройку `Gemini` и предназначен для быстрого старта работы с утилитой.

## Установка стороннего ПО

Перед началом работы с `Gemini` необходимо установить следующее программное обеспечение:

1. [Selenium Server](http://docs.seleniumhq.org/download/) – для тестирования в различных браузерах.
2. Компилятор с поддержкой C++11 (Например, `GCC@4.6` и выше). Это требование пакета [png-img](https://github.com/gemini-testing/png-img).


## Установка Gemini
### Глобальная установка

Для установки утилиты используется команда `install` пакетного менеджера [npm](https://www.npmjs.org/):

```
    npm install -g gemini@0.9.9
```
Глобальная инсталляция будет использоваться для запуска команд.

### Локальная установка

Для написания тестов нам также понадобится локальная инсталляция `Gemini`. В папке проекта выполните команду:

```
npm install gemini@0.9.9
```

## Настройка

Дополнительная настройка утилиты происходит путем редактирования конфигурационного файла `.gemini.yml`, который расположен в корневой папке проекта.

### Использование в связке с Selenium
Для тестирования в различных браузерах необходимо использовать `Selenium`.  В конфигурационном файле следует дополнительно указать адрес `Selenium`-сервера
и список браузеров для тестирования:

```yaml
rootUrl: http://yandex.com
gridUrl: http://localhost:4444/wd/hub

browsers:
  chrome:
    browserName: chrome
    version: "37.0"

  firefox:
    browserName: firefox
    version: "31.0"

```

В качестве ключей в секции `browsers` используются уникальные идентификаторы браузеров (выбираются пользователем произвольно), а в качестве значения – [DesiredCapabilites](https://code.google.com/p/selenium/wiki/DesiredCapabilities) данного браузера.

### Другие варианты настройки
[Подробнее](https://github.com/gemini-testing/gemini/blob/master/doc/config.ru.md) о структуре конфигурационного файла.

## Создание тестов

Каждый тестируемый блок может находиться в одном из нескольких фиксированных состояний. Состояния проверяются при помощи цепочек последовательных действий, описанных в тестовых наборах блока.

Для примера, напишем тест для поискового блока на [yandex.com](http://www.yandex.com):

```javascript
var gemini = require('gemini');

gemini.suite('yandex-search', function(suite) {
    suite.setUrl('/')
        .setCaptureElements('.main-table')
        .capture('plain')
        .capture('with text', function(actions, find) {
            actions.sendKeys(find('.input__control'), 'hello gemini');
        });
});
```

Мы создаем новый тестовый набор `yandex-search` и говорим, что будем снимать элемент `.main-table`
c корневого URL `http://yandex.com`. При этом у блока есть два состояния:

* `plain` – сразу после загрузки страницы;
* `with text` - c введенным в элемент `.input__control` текстом `hello gemini`.

Состояния выполняются последовательно в порядке определения, без перезагрузки страницы между ними.

[Подробнее](https://github.com/gemini-testing/gemini/blob/master/doc/tests.ru.md) о методах создания тестов.

## Использование CLI

Для завершения создания теста необходимо сделать эталонные снимки используя команду

```
gemini gather [путь к файлам тестов]
```
Для запуска тестов используется команда сравнения текущего состояния блока с эталонным снимком:

```
gemini test [путь к файлам тестов]
```

Чтобы наглядно увидеть разницу между текущим изображением и эталоном (diff), можно использовать функцию HTML-отчёта:

```
gemini test --reporter html [путь к файлам тестов]
```

или получить консольный и HTML отчёты одновременно:

```
gemini test --reporter html --reporter flat [путь к файлам с тестами]
```

[Подробнее](https://github.com/gemini-testing/gemini/blob/master/doc/commands.ru.md) о работе с командной строкой и доступных аргументах.

## Плагины

Gemini может быть расширен при помощи плагинов. Вы можете выбрать один из [существующих плагинов](https://www.npmjs.com/browse/keyword/gemini-plugin)
или [написать свой собственный]https://github.com/gemini-testing/gemini/blob/master/doc/plugins.ru.md). Чтобы использовать плагин, установите и включите его в `.gemini.yml`:

```yaml
plugins:
  some-awesome-plugin:
    plugin-option: value
```

## Gemini API

Программный интерфейс Gemini позволяет использовать утилиту в качестве инструмента тестирования в скриптах и инструментах сборки.

[Подробнее](https://github.com/gemini-testing/gemini/blob/master/doc/programmatic-api.ru.md) о Gemini API.
