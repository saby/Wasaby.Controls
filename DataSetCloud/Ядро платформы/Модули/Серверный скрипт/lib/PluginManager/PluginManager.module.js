/**
 * Created with JetBrains PhpStorm.
 * User: Шилов Д.А.
 * Date: 27.11.13
 * Новая реализация плагинов
 *
 * HTTP web server на C#
 * WebSockets реализован с помощью flash
 */

/**
 * @module js!SBIS3.CORE.PluginManager
 */
define('js!SBIS3.CORE.PluginManager', [
   'is!browser?js!SBIS3.CORE.PluginManager/resources/WebSocket',
   'is!browser?js!SBIS3.CORE.PluginManager/resources/SwfObject',
   'is!browser?js!SBIS3.CORE.PluginManager/resources/WebSocketQt',
   'is!browser?js!SBIS3.ENGINE.HintManager',
   'js!SBIS3.CORE.Dialog',
   'js!SBIS3.CORE.Button',
   'js!SBIS3.CORE.PluginSetupDialog'
], function(TensorWebSocket, swfObject, TensorWebSocketQt, HintManager, Dialog, Button) {

   "use strict";

   /**
    * @typedef {Error} Error
    * @property {String} type - Тип ошибки
    * @property {String} description - Внутренний тип ошибки
    * @property {String} version - Версия плагина
    */

   /**
    * @typedef {Object} Params
    * @property {boolean} debug - Нужны ли дебажные логи
    * @property {String} pluginName - Название плагина
    * @property {String} version - Версия плагина
    * @property {boolean} checkInstall - проверка на запуск плагина
    * @property {boolean} runOnce - Не показывать ошибку или диалог установки, если пользователь отменил
    * @property {boolean} silent - Не показывать ошибку никогда
    * @property {Options} dialogOptions - настройки диалога с ошибкой
    */

   /**
    * @typedef {Object} Options
    * @property {String} caption - Заголовок окна
    * @property {String} description - Описание ошибки
    * @property {String} link - Подробное описание
    * @property {String} help - Ссылка на help.sbis.ru
    * @property {String} target - открывать ссылку здесь или в новой вкладке
    * @property {String} action - дополнительное действие
    */

   /**
    * @typedef {Object} ParametersType
    * @property {String} jsName - Имя типа в JS
    * @property {String} csName- Имя типа в C#
    * @property {String} paramName - название параметра
    * @property {Number} position - Позиция параметра
    * @property {Boolean} hasDefaultValue - Имеет ли параметр дефолтное значение
    */

   /**
    * Константы типов ошибок
    * @type {{USER_CANCELLED: string, SILENT_MODE: string, INTERNAL_SERVER_ERROR: string, INTERNAL_CLIENT_ERROR: string}}
    */
   var errorsType = {
      USER_CANCELLED: 'USER_CANCELLED',
      SILENT_MODE: 'SILENT_MODE',
      INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
      INTERNAL_CLIENT_ERROR: 'INTERNAL_CLIENT_ERROR',
      INTERACTION_ERROR: 'INTERACTION_ERROR'
   };

   /**
    * Различные строковые константы
    * @type {Object}
    */
   var strings = {
      OLD_FLASH_PLAYER:             'Требуется Flash Player >= 11.0.0',
      FILE_PROTOCOL:                'WebSocket не работают по протоколу file:///...',
      FLASH_PLAYER_NOT_INSTALLED:   'Flash Player не установлен',
      UNABLE_TO_CONNECT:            'Не удается подключиться к хосту',
      EMBED_SWF_FAILED:             'Не удалось запустить Flash Player. Разрешите его использование в настройках',
      OPEN:                         'WebSocket - соединение устанавливается',
      CLOSE:                        'WebSocket - соединение закрыто',
      OLD_VERSION:                  'СБИС плагин устарел, необходимо его обновить',
      OLD_PLUGIN:                   'Плагин устарел, необходимо его обновить',
      IS_MOBILE:                    'Вы используете мобильную версию браузера',
      COMMUNICATION_ERROR:          'Произошла ошибка при обмене данными с сервером',
      UNKNOWN_ERROR:                'Неизвестная ошибка',
      UNKNOWN_SERVER_ERROR:         'На сервере произошла неизвестная ошибка.',
      UNKNOWN_FUNCTION:             'Неизвестное название функции',
      UNKNOWN_FUNCTION_RESULT:      'Неизвестный результат функции',
      UNKNOWN_FUNCTION_PARAMS:      'Неизвестные параметры функции',
      UNKNOWN_OBJECT_ID:            'Неизвестный идентификатор объекта',
      UNKNOWN_RESPONSE_TYPE:        'Неизвестный тип ответа.',
      UNKNOWN_RECEIVER:             'Неизвестный получатель ответа.',
      NO_RESPONSE_DURING:           'Не удалось получить ответ за разумное время',
      WRONG_ARGUMENTS_NUMBER:       'Неверное количество аргументов.',
      WRONG_ARGUMENT_TYPE:          'Неверный тип аргумента.',
      FUNCTION_NOT_FOUND:           'Не найдена функция соотвествующая параметрам',
      AMBIGUOUS_MATCH_EXCEPTION:    'Двухсмысленное представляение метода',
      EXPECTED:                     'Ожидалось: ',
      CAME_FROM:                    'Пришло: ',
      SERVER_CLOSE_CONNECTION:      'Сервер закрыл соединение.',
      CLOSE_CONNECTION:             'Соединение разорвано',
      UNSUPPORTED_PLATFORM:         'Операционная система не поддерживается',
      ACTIVE_X:                     'Не удалось запустить AcitveX компонент',
      NP_API:                       'Не удалось запустить NPAPI плагин'
   };

   var readyState = {
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3
   };

   var defaultPort = '8181';

   /**
    * Логгер
    * Есди debugMode == true, то логи выводятся
    * @property {function} log - Показать сообщение в консоли
    * @property {function} error - Показать ошибку в консоли
    * @property {boolean} debugMode - Нужно ли показывать сообщения в консоли
    */
   var logger = {
      log: function(str, force) {
         return (this.debugMode || force) ? $ws.single.ioc.resolve('ILogger').log('TensorWebSocket', str) : false;
      },
      error: function(str, force) {
         return (this.debugMode || force) ? $ws.single.ioc.resolve('ILogger').error('TensorWebSocket', str) : false;
      },
      info: function(str, force) {
         return (this.debugMode || force) ? $ws.single.ioc.resolve('ILogger').info('TensorWebSocket', str) : false;
      },
      debugMode: false
   };

   /**
    * Очередь deferred для ответов
    * @type {Object}
    */
   var queries = {};

   /**
    * Время ожидания ответа
    * @type {number}
    */
   var queryTimeout = 60000;

   var installDialogTemplates = {
      FLASH_PLAYER_NOT_INSTALLED: {
         caption: 'Установите Adobe Flash Player',
         description: 'Для работы с плагинами требуется Adobe Flash Player 11 или выше',
         link: 'https://get.adobe.com/ru/flashplayer/?no_redirect',
         target: 'new_page',
         help: 'http://help.sbis.ru/about_edo/solutions/flash',
         action: ' и перезапустите браузер.'
      },
      OLD_FLASH_PLAYER: {
         caption: 'Обновите Adobe Flash Player',
         description: 'Для работы требуется последняя версия Adobe Flash Player 11 или выше',
         link: 'https://get.adobe.com/ru/flashplayer/?no_redirect',
         target: 'new_page',
         help: 'http://help.sbis.ru/about_edo/solutions/flash',
         action: ' и перезапустите браузер.'
      },
      IS_MOBILE: {
         caption: 'Не удалось запустить СБИС плагин',
         description: 'Плагин не может быть запущен на мобильном устройстве.'
      },
      UNABLE_TO_CONNECT: {
         caption: 'Установите СБИС плагин',
         link: SbisPluginPath(),
         target: 'page',
         action: ', и окно закроется автоматически.'
      },
      OLD_VERSION: {
         caption: 'Установите СБИС плагин',
         description: 'Установлен плагин старой версии, для корректной работы необходимо его обновить.',
         link: SbisPluginPath(),
         target: 'page',
         action: ', и окно закроется автоматически.'
      },
      OLD_PLUGIN: {
         caption: 'Установите СБИС плагин',
         description: 'Установлен плагин старой версии, для корректной работы необходимо его обновить.',
         link: SbisPluginPath(),
         target: 'page',
         action: ', и окно закроется автоматически.'
      },
      ACTIVE_X: {
         caption: 'Не удалось запустить необходимое расширение браузера',
         description: 'Установите последнюю версию СБИС плагина, разрешите запуск ActiveX компонентов.',
         link: SbisPluginPath(),
         target: 'page',
         action: ' и перезагрузите страницу.',
         help: 'http://help.sbis.ru/about_edo/teh_terms/activex_why',
         hint: true
      },
      NP_API: {
         caption: 'Не удалось запустить необходимое расширение браузера',
         description: 'Установите последнюю версию СБИС плагина, разрешите SbisPluginClient в дополнениях.',
         link: SbisPluginPath(),
         target: 'page',
         action: ' и перезагрузите страницу.',
         help: 'http://help.sbis.ru/about_edo/solutions/plugin',
         hint: true
      },
      EMBED_SWF_FAILED: {
         caption: 'Не удалось запустить необходимое расширение браузера',
         description: 'Установите последнюю версию СБИС плагина, разрешите Flash Player в дополнениях.',
         link: SbisPluginPath(),
         target: 'page',
         action: ' и перезагрузите страницу.',
         help: 'http://help.sbis.ru/about_edo/solutions/plugin',
         hint: true
      }
   };

   function SbisPluginPath() {
      function getStandPath() {
         var test_prefix = [
            'wi.sbis.ru',
            'platform-',
            'dev-',
            'test-',
            'localhost',
            'fix-',
            'dev.',
            'test.',
            'fix.'
         ];
         if (typeof location !== 'undefined') {
            var host = location.host;
            var isTest = $ws.helpers.find(test_prefix, function(prefix) {
               return host.indexOf(prefix) != -1;
            });

            // Сайты с портами считаем тоже тестовыми
            if (!isTest) {
               isTest = /:\d+$/.test(host);
            }

            if (isTest) {
               return 'http://wi.sbis.ru/SbisPlugin/';
            }
         }

         return 'http://update.sbis.ru/versions/3.0/online/';
      }

      return getStandPath() + 'SbisPlugin.exe' + $ws.helpers.randomId('?') + '&FixForIE=.exe';
   }

   function getHintConfig() {
      var
         config = {
            uniqueName: 'PluginManager_0',
            controlName: 'PluginManager'
         },
         text =  {
            chrome: 'Для работы СБИС плагина необходимо разрешить доступ к плагинам на странице',
            firefox: 'Для рыботы СБИС плагина необходимо разрешить доступ к плагинам на странице',
            ie: 'Для СБИС плагина необходимо разрешить запуск ActiveX компонентов'
         },
         hintPosition = {
            chrome: {
               right: '30px'
            },
            firefox: {
               top: '0',
               left: '45px'
            },
            ie: {
               top: '0',
               right: '0'
            }
         },
         arrowClass = {
            chrome: 'top-right',
            firefox: 'top-left',
            ie: 'top-right'
         },
         setStyles = function (browser) {
            config.hintPosition = hintPosition[browser];
            config.arrowClass = arrowClass[browser];
            config.text = text[browser];
         };
      setStyles($ws._const.browser.chrome ? 'chrome' : $ws._const.browser.firefox ? 'firefox' : 'ie');
      return config;
   }

   function showHint() {
      if (HintManager) {
         HintManager.addHint(getHintConfig());
         HintManager.showImmediatly('PluginManager', true);
      }
   }

   function hideHint() {
      if (HintManager) {
         HintManager.hide();
         HintManager.refreshState();
      }
   }

   function closeAllWebSocketQueries(wsId) {
      if (queries[wsId]) {
         $ws.helpers.forEach(queries[wsId], function(query) {
            if (query.deferred && !query.deferred.isReady()) {
               createError(errorsType.INTERACTION_ERROR, 'CLOSE_CONNECTION', query.deferred);
            }

            if (query.timeout) {
               clearTimeout(query.timeout);
            }
         });
         delete queries[wsId];
      }
   }

   /**
    * Выполняет код на клиенте, пришедший с сервера
    * Пока поддерживается нахождение контрола по идентификатору
    * @param {Object} webSocket - веб-сокет
    * @param {Object} json - объект распознанный из JSON
    * @param {String} json.objectID - идентификатор контрола, который нужно найти
    * @param {String} json.method - метод, который надо вызывать у контрола
    * @param {Array}  json.Params - параметры метода
    * @example
    * <pre>
    *    {
            type: 'call',        // тип - вызов функции
            objectID: 'id-xxx'   // Идентификатор контрола
            method: 'Count',   // Название функции контрола
            params: [
               '2'               // Параметры
            ]
         }
    * </pre>
    */
   function callJSMethod(webSocket, json) {
      json = json.answer;

      if (json === undefined)
         return;

      if (typeof json === 'object') {
         var queryDef = new $ws.proto.Deferred();
         try {
            json = parseAnswer(webSocket, queryDef, json);
         } catch (error) {
            if (!error instanceof Error) {
               createError(errorsType.INTERNAL_CLIENT_ERROR, 'COMMUNICATION_ERROR', queryDef, error);
            }
            return;
         }
      }

      if (json.channelName) {
         var channelName = json.channelName,
             eventName = json.eventName,
             data = json.data || [];

         if (typeof(channelName) !== 'string' || typeof(eventName) !== 'string' || channelName.length <= 0 || eventName.length <= 0) {
            logger.error(strings.UNKNOWN_FUNCTION, true);
            return;
         }

         $ws.single.EventBus.channel(channelName).notify.apply($ws.single.EventBus.channel(channelName), [eventName].concat(data));
      } else {
         var func = json.method,
             params = json.Params || [],
             objID = json.objectID;

         if (!func) {
            logger.error(strings.UNKNOWN_FUNCTION, true);
            return;
         }

         if (!objID) {
            logger.error(strings.UNKNOWN_OBJECT_ID, true);
            return;
         }

         $ws.single.EventBus.channel('pluginsCallbackEvents').notify.apply($ws.single.EventBus.channel('pluginsCallbackEvents'), [func, objID].concat(params));
      }
   }

   /**
    * Функция обертка. Вызывает метод у объекта
    * Данная функция заменяет все функции объекта на клиенте.
    * @param {Object} webSocket - веб-сокет
    * @param {String} methodName - название метода, который нужно вызвать
    * @param {String} objID - идентификатор объекта, у которого нужно вызвыать метод
    * @param {Array} parameters - параметры
    * @returns {$ws.proto.Deferred}
    */
   function callObjMethod(webSocket, methodName, objID, parameters) {
      var args = [], paramsType = [],
          bindArgCount = 4,
          paramsLength = arguments.length - bindArgCount,
          def = new $ws.proto.Deferred(),
          i, j, l;

      // Проверим корректность переданных аргументов
      for (j = bindArgCount, l = arguments.length; j < l; j++) {
         var elem = arguments[j],
             type = typeof elem;

         if (type === 'undefined' || type === 'function' ||
             (type === 'number' && (isNaN(elem) || elem === -Infinity || elem === Infinity))) {
            createError(errorsType.INTERNAL_CLIENT_ERROR, 'WRONG_ARGUMENT_TYPE', def, strings.WRONG_ARGUMENT_TYPE + ' Неподдерживаемый аргумент "' + elem + '"');
            return def;
         }

         if (type === 'object' && elem instanceof Array) {
            type = 'array';
         }

         args.push(elem);
         paramsType.push(type);
      }

      // Проверим, чтобы количество переданных аргументов было не больше и не меньше допустимых
      var maxParamsLength = 0, minParamsLength = undefined, countDefFirstParam = 0;
      $ws.helpers.forEach(parameters, function(params) {
         if (params.length > maxParamsLength) {
            maxParamsLength = params.length;
         }
         if (minParamsLength == undefined || params.length < minParamsLength) {
            if (!params.length) {
               countDefFirstParam++;
               minParamsLength = 0;
            } else {
               for (i = 0, l = params.length; i < l; i++) {
                  if (params[i].hasDefaultValue)
                     break;
               }
               minParamsLength = i;
            }
         }
      });

      // Ошибка в количестве аргументов
      if (minParamsLength > paramsLength || maxParamsLength < paramsLength) {
         createError(errorsType.INTERNAL_CLIENT_ERROR, 'WRONG_ARGUMENTS_NUMBER', def);
         return def;
      }

      // Надо проверить, что у нас только одна функция с дефолтным первым параметром
      if (paramsLength === 0 && countDefFirstParam > 1) {
         createError(errorsType.INTERNAL_CLIENT_ERROR, 'AMBIGUOUS_MATCH_EXCEPTION', def);
         return def;
      }

      var parametersType = null;
      // Вот теперь поймем, с какую функцию надо вызывать
      for (i = 0, l = parameters.length; i < l; i++) {
         var params = parameters[i];
         if (paramsLength === 0 && (!params.length || params[0].hasDefaultValue)) {
            parametersType = params;
            break;
         } else if (params.length >= paramsLength) {
            var isBad = false;
            for (j = 0; j < params.length && !isBad; j++) {
               if ((j+1 > paramsLength && !params[j].hasDefaultValue) ||
                   (j+1 <= paramsLength && paramsType[j] && params[j].jsName !== paramsType[j])) {
                  isBad = true;
               }
            }

            if (!isBad) {
               if (parametersType === null) {
                  parametersType = params;
               } else {
                  createError(errorsType.INTERNAL_CLIENT_ERROR, 'AMBIGUOUS_MATCH_EXCEPTION', def);
                  return def;
               }
            }
         }
      }

      if (parametersType === null) {
         createError(errorsType.INTERNAL_CLIENT_ERROR, 'FUNCTION_NOT_FOUND', def);
         return def;
      }

      return callMethod(webSocket, methodName, args, parametersType, objID);
   }

   /**
    * Вызывает метод у плагина
    * @param {Object} webSocket - веб-сокет
    * @param {String} methodName - Название метода, который будет вызван
    * @param {Array} [params] - параметры
    * @param {String} [objectID] - Идентификатор объекта, у которого будет вызван метод
    * @param {Array} [paramsType] - типы параметров
    * @returns {$ws.proto.Deferred}
    */
   function callMethod(webSocket, methodName, params, paramsType, objectID) {
      var def = new $ws.proto.Deferred(),
          query = {
             type: 'call',
             queryID: $ws.helpers.createGUID(),
             method: methodName
          };

      if (webSocket.readyState !== readyState.OPEN) {
         createError(errorsType.INTERACTION_ERROR, 'SERVER_CLOSE_CONNECTION', def, 'СБИС плагин закрыл соединение. Работа с плагинами невозможна, запустите СБИС плагин и перезагрузите страницу.');
         return def;
      }

      if (objectID) {
         query.objectID = objectID;
      }

      var isArray = Array.isArray ? Array.isArray : $.isArray;
      if (params && isArray(params)) {
         query.Params = params;
      }

      if (paramsType && isArray(params)) {
         query.ParamsType = paramsType;
      }

      var timeout = webSocket.queryTimeout || queryTimeout;
      var runTimeout = setTimeout(function() {
         if (!def.isReady()) {
            createError(errorsType.INTERNAL_CLIENT_ERROR, 'COMMUNICATION_ERROR', def, strings.NO_RESPONSE_DURING + ' (' + (timeout / 1000) + ' сек.)');
         }
      }, timeout);

      queries[webSocket.getId()][query.queryID] = {
         deferred: def,
         timeout: runTimeout
      };

      try {
         query = JSON.stringify(query);
      } catch(error) {
         createError(errorsType.INTERNAL_CLIENT_ERROR, 'SERIALIZATION_ERROR', def, error.message);
         return def;
      }

      webSocket.send(query);

      return def;
   }

   /**
    * Разбирает сложный ответ
    * @param {Object} webSocket - веб-сокет
    * @param {$ws.proto.Deferred} def - Деферед, который должен стрельнуть
    * @param {Object} json - Распарсенный ответ
    * @param {String} json.objectID - Идентификатор объекта из ответа
    * @param {String} json.errorType - Тип ошибки, возвращается с C#
    * @param {Object} json.parametersType - объект с информацией по параметру
    * @returns {*}
    */
   function parseAnswer(webSocket, def, json) {
      var type = json.type;

      // Чтобы не мешался
      delete json.type;
      if (type === 'object' && json.name === 'JsonObject') {
         delete json.name;
      }

      if (type === 'object') {
         var elemObjID = json.objectID,
             obj = {}, methods = {};

         $ws.helpers.forEach(json, function(elem, key) {
            if (elem && typeof elem === 'object') {
               if (elem.type === 'method') {
                  if (!elem.parametersType) {
                     throw createError(errorsType.INTERNAL_CLIENT_ERROR, 'UNKNOWN_FUNCTION_PARAMS', def);
                  }

                  var methodName = key.split('@')[0];
                  if (methods[methodName]) {
                     methods[methodName].push(elem.parametersType);
                  } else {
                     methods[methodName] = [elem.parametersType];
                  }
               } else {
                  obj[key] = parseAnswer(webSocket, def, elem);
               }
            } else {
               obj[key] = elem;
            }
         });

         if (elemObjID) {
            // Теперь все методы заменим на вызов функции
            $ws.helpers.forEach(methods, function(value, key) {
               obj[key] = callObjMethod.bind(undefined, webSocket, key, elemObjID, value);
            });
         }

         return obj;
      } else if (type === 'array') {
         var array = json.array || [];
         $ws.helpers.forEach(array, function(elem, key) {
            array[key] = parseAnswer(webSocket, def, elem);
         });
         return json.array || [];
      } else if (type === 'error') {
         throw createError(errorsType.INTERNAL_SERVER_ERROR, json.errorType || 'COMMUNICATION_ERROR', def, json.error || strings.UNKNOWN_SERVER_ERROR);
      } else {
         return json; //throw createError('UNKNOWN_RESPONSE_TYPE', def);
      }
   }

   /**
    * Парсит ответ, получает объект и стреляет колбеком
    * @param {Object} webSocket - веб-сокет
    * @param {Object} json - Распарсенный ответ
    * @param {String} json.type - Тип ответа
    * @param {String} json.queryID - Идентификатор запроса
    * @param {Object} json.answer - сам ответ
    */
   function receiveAnswer(webSocket, json) {
      var qid = json.queryID;
      if (!qid) {
         logger.error(strings.UNKNOWN_RECEIVER, true);
         return;
      }

      var query = queries[webSocket.getId()][qid],
          queryDef = query && query.deferred,
          queryTimeout = query && query.timeout;

      if (!queryDef) {
         logger.error(strings.UNKNOWN_RECEIVER + ' ' + strings.CAME_FROM + qid, true);
         return;
      }

      if (queryDef.isReady()) {
         logger.log('Deferred is already fired with state \'success\'', true);
         return;
      }

      if (queryTimeout) {
         clearTimeout(queryTimeout);
      }

      // Удалим деферред, он нам уже не нужен в коллекции
      delete queries[webSocket.getId()][qid];

      var answer = json.answer;
      if (answer && typeof answer === 'object') {
         try {
            answer = parseAnswer(webSocket, queryDef, answer);
            queryDef.callback(answer);
         } catch (error) {
            if (!(error instanceof Error || queryDef.isReady())) {
               createError(errorsType.INTERNAL_CLIENT_ERROR, 'COMMUNICATION_ERROR', queryDef, error);
            }
         }
      } else {
         queryDef.callback(answer);
      }
   }

   /**
    * Принимает сообщение от сервера
    * @param {Object} webSocket - веб-сокет
    * @param {String} message - сообщение
    */
   function receiveMessage(webSocket, message) {
      var json;

      try {
         //message = message.replace(/[\t\n\r]/g, '').replace(/\\/g, '\\\\');
         json = JSON.parse(message);
         (function recursiveUnescape(obj){
            $ws.helpers.forEach(obj, function(value, key) {
               if (typeof value === 'string') {
                  try {
                     obj[key] = decodeURIComponent(value);
                  } catch(e) {
                     obj[key] = value;
                  }
               } else if(value && typeof value === 'object' && Object.keys(value).length) {
                  recursiveUnescape(value);
               }
            });
         })(json);
      } catch (e) {
         logger.error(e.message, true);
         return;
      }

      var type = json.type;
      delete json.type;
      if (type == 'call') {
         // Если сюда пришли, значит надо вызывать метод в JS
         callJSMethod(webSocket, json);
      } else if (type == 'answer') {
         // Если сюда пришли, значит надо принять ответ от C#
         receiveAnswer(webSocket, json);
      } else {
         logger.error(strings.UNKNOWN_RESPONSE_TYPE + ' ' + strings.CAME_FROM + type, true);
      }
   }

   /**
    * Обертка, которая показывает ошибки
    * @param {$ws.proto.Deferred} deferred
    * @param {Error} error - Ошибка
    * @param {Params} params - Дополнительные параметры
    */
   function showError(deferred, error, params) {
      var def = new $ws.proto.Deferred();
      def.addCallback(function(result) {
         if (typeof result === 'object') {
            deferred.callback(result);// Получили плагин
         } else {
            error.type = result ? errorsType.INTERNAL_CLIENT_ERROR : params.silent ? errorsType.SILENT_MODE : errorsType.USER_CANCELLED;
            deferred.errback(error);
         }
      });
      showInstallDialog(def, error, params, installDialogTemplates[error.description]);
   }

   /**
    * Диалог с ошибкой
    * @param {$ws.proto.Deferred} deferred
    * @param {Error} error - Ошибка
    * @param {Params} params - Дополнительные параметры
    * @param {Options} [options] - Дополнительные строки для диалога
    * @returns {$ws.proto.Deferred}
    */
   function showInstallDialog(deferred, error, params, options) {
      var interval;

      // Показываем диалог всегда, если прикладником не было задумано вызывать плагин фоном, тогда проверяем silent
      if (!options || params.checkInstall || params.silent ||
          (params.runOnce && $ws.single.MicroSession.get('pluginDialogDisabled-' + error.description))) {
         deferred.callback(!options || false);
         return deferred;
      }

      var link = options.link || '',
          help = options.help || 'http://help.sbis.ru/about_edo/task/notice/notif',
          caption = options.caption || '',
          description = options.description || '',
          target = options.target || 'new_page',
          action = options.action || '',
          hint = options.hint && error.hint;

      // Если соберемся ждать плагина - не нужно здесь ничего закрывать
      new Dialog({
         template: 'js!SBIS3.CORE.PluginSetupDialog',
         context: new $ws.proto.Context(),
         caption: caption,
         opener: $ws.single.WindowManager.getActiveWindow(),
         resizable: false,
         handlers: {
            onBeforeShow: function() {
               var container = this.getContainer();
               container.find('#PluginManager-PluginSetupDialog__description').html(description);
               container.find('#PluginManager-PluginSetupDialog__dbl_action').html(action);
               container.find('#PluginManager-PluginSetupDialog__helpLink').attr('href', help);
               !link && container.find('#PluginManager-PluginSetupDialog__add_text').css('visibility', 'hidden');
               hint && showHint();

               var button = new Button({
                  element: 'PluginManager-PluginSetupDialog__btn',
                  caption: 'Скачать',
                  imgAlign: 'left',
                  enabled: !!link,
                  defaultButton: true,
                  handlers: {
                     onActivated: function(event) {
                        var result = new $ws.proto.Deferred();
                        setTimeout(function() {result.callback(false); button.setEnabled(false);}, 2000);
                        event.setResult(result);
                        // Для windows 8 в IE открываем в отдельной вкладке, так как почему то не качает, а перенаправляет
                         if (target === 'new_page' || (/Windows NT 6.[23]/.test(navigator.appVersion) && $ws._const.browser.isIE)) {
                           window.open(link);
                        } else {
                           window.location = link;
                        }
                     }
                  }
               });
            },
            onAfterShow: function() {
               var dialog = this, def;
               // запустим таймер, будем пробовать запустить плагин
               interval = setInterval(function() {
                  // Проверим, можно ли стартовать компонент
                  // Если предыдущий деферред стрельнул, начнем заново
                  if (!def || def.isReady()) {
                     def = getPlugin(params.pluginName, params.version, {checkInstall: true});
                     def.addCallbacks(function(plugin) {
                        // Вернем плагин
                        deferred.callback(plugin);
                        // закроем диалог
                        dialog.close(true);
                     }, function(error) {
                     });
                  }
               }, 5000);
            },
            onAfterClose: function(event, result) {
               hint && hideHint();
               // result == true - плагин найден и может быть запущен
               if (!result) {
                  // Пользователь закрыл диалог, не надоедаем больше
                  $ws.single.MicroSession.set('pluginDialogDisabled-' + error.description, 'true');
                  deferred.callback(false);
               } else {
                  $ws.single.MicroSession.remove('pluginDialogDisabled-' + error.description);
               }
               clearInterval(interval);
            }
         }
      });

      return deferred;
   }

   /**
    * Формирует ошибку
    * @param {String} type - Тип ошибки
    * @param {String} description - Класс ошибки (внутреннее описание ошибки)
    * @param {$ws.proto.Deferred} def - Куда стрельнуть ошибкой
    * @param {String} [message] - Сообщение ошибки, которое перебьет description
    * @param {Boolean} [hint] - нужно ли показывать подсказку
    * @returns {Error}
    */
   function createError(type, description, def, message, hint) {
      var msg = message || strings[description] || strings.UNKNOWN_ERROR,
          error = new Error(msg);

      logger.error(msg);
      error.type = type;
      error.description = description;
      error.hint = hint;
      def.errback(error);

      return error;
   }

   /**
    * Инициализация плагина
    * Здесь происходит проверка версии Flash Player
    * Алгоритм:
    *   1. Попробуем стартовать WebSocket'ы через SbisPluginClient (в IE - ActiveX, в других местах NPApi)
    *   2. Если не удалось, проверим, есть ли флэш
    *   3. Если Flash нет
    *    3.1 - В IE8 предложим его поставить
    *    3.2 - В других IE предложим поставить SbisPluginClientActiveX
    *    3.3 - В остальных браузерах предложим поставить NPApi-плагин
    *   4. Если Flash есть, но менее 11 версии - просим обновить
    *   5. Если Flash есть и он нормальной версии - стартуем WebSocket'ы через Flash
    * @returns {$ws.proto.Deferred}
    */
   function init() {
      var wsInit = new $ws.proto.Deferred();

      TensorWebSocketQt.initialize(function(e){
         if (e.success) {
            window.TensorWebSocket = TensorWebSocketQt;
            wsInit.callback();
         } else {
            // Если запуск QT-вебсокетов не удался
            if (swfObject.getFlashPlayerVersion().major === 0) {
               // Если Flash не найден
               if ($ws._const.browser.isIE) {
                  // Во всех IE рекомендуем поставить ActiveX
                  createError(errorsType.INTERNAL_CLIENT_ERROR, 'ACTIVE_X', wsInit, '', true);
               } else {
                  // Во всех браузерах кроме IE рекомендуем поставить NPAPI-плагин
                  createError(errorsType.INTERNAL_CLIENT_ERROR, 'NP_API', wsInit, '', e.blocked);
               }
            } else if (swfObject.getFlashPlayerVersion().major < 11) {
               // Flash есть, но старый, просим обновить
               createError(errorsType.INTERNAL_CLIENT_ERROR, 'OLD_FLASH_PLAYER', wsInit);
            } else if (location.protocol == "file:") {
               // На file://-протоколе работать не можем. Ругаемся.
               createError(errorsType.INTERNAL_CLIENT_ERROR, 'FILE_PROTOCOL', wsInit);
            } else {
               // Если флэш есть и он >11 то стартуем обмен через Flash
               window.TensorWebSocket = TensorWebSocket;
               TensorWebSocket.initialize(function(e) {
                  if (e.success) {
                     wsInit.callback();
                  } else {
                     createError(errorsType.INTERNAL_CLIENT_ERROR, 'EMBED_SWF_FAILED', wsInit, '', e.blocked);
                  }
               });
            }
         }
      });

      return wsInit;
   }

   /**
    * Запуск плагина
    * @returns {$ws.proto.Deferred}
    */
   function run(port) {
      var wsStart = new $ws.proto.Deferred(),
          webSocket = {};
      try {
         webSocket = new window.TensorWebSocket('ws://127.0.0.1:' + (!!parseInt(port, 10) ? port : defaultPort));

         webSocket.onopen = function() {
            logger.log(strings.OPEN);
            // Будем следить за всеми отправками текущего сокета
            queries[webSocket.getId()] = {};
            webSocket.queryTimeout = queryTimeout;
            wsStart.callback(webSocket);
         };

         webSocket.onmessage = function(event) {
            receiveMessage(webSocket, event.data);
         };

         webSocket.onerror = function(event) {
            logger.error(event.message);
            logger.info('onerror: ' + event.message, true);
         };

         webSocket.onclose = function() {
            logger.log(strings.CLOSE);
            if (!wsStart.isReady()) {
               createError(errorsType.INTERNAL_CLIENT_ERROR, 'UNABLE_TO_CONNECT', wsStart);
            }
            closeAllWebSocketQueries(webSocket.getId());
         };
      } catch (e) {
         logger.log(strings.CLOSE);
         createError(errorsType.INTERNAL_CLIENT_ERROR, 'UNABLE_TO_CONNECT', wsStart);
      }

      return wsStart;
   }

   /**
    * Запрашивает у сервиса порт, на который надо подключаться
    * Нужен для терминального доступа. Если терминального доступа не будет, то будем получать стандартный порт,
    * тогда вернем уже существующий сокет. Иначе переподключимся.
    * Важно!!! После переподключения не делаем verifySocket.
    * @param {Object} webSocket - Веб-сокет, у которого запросим плагин
    * @returns {$ws.proto.Deferred}
    */
   function verifySocket(webSocket) {
      var defVerify = new $ws.proto.Deferred();

      callMethod(webSocket, 'verifySocket', [
      ]).addCallbacks(function(port) {
         // Если порт не равен стандартному, то необходимо переподключиться
         if (port != defaultPort) {
            defVerify.dependOn(run(port));
         } else {
            defVerify.callback(webSocket);
         }
      }, function(error) {
         // Для старых нотификаторов, они будут ругаться, что метод не найден, вернем им старый вебсокет
         if (error.description === 'METHOD_NOT_FOUND' ||
             // TODO: пока костылим пару версий, когда все обновят нотификатор до 22 версии надо будет убрать. Там будет METHOD_NOT_FOUND
             (error.description === 'COMMUNICATION_ERROR' && error.message === 'Обращение к несуществующему методу verifySocket класса PluginManager')) {
            defVerify.callback(webSocket);
         } else {
            // Ошибки взаимодействия с сервером
            webSocket.close(); // Соединение уже не нужно
            defVerify.errback(error);
         }
      });

      return defVerify;
   }

   /**
    * Запрос плагина с сервера
    * @param {Object} webSocket - Веб-сокет, у которого запросим плагин
    * @param {Params} params - Дополнительные параметры
    * @returns {$ws.proto.Deferred}
    */
   function getPluginFromServer(webSocket, params) {
      var defPlugin = new $ws.proto.Deferred();

      callMethod(webSocket, 'getPlugin', [
         params.pluginName,
         params.version,
         params
      ]).addCallbacks(function(plugin) {
         plugin._WebSocket = webSocket;
         plugin._getState = getState;
         plugin._setQueryTimeout = setQueryTimeout;
         defPlugin.callback(plugin);
      }, function(error) {
         // Ошибки взаимодействия с сервером
         webSocket.close(); // Соединение уже не нужно
         defPlugin.errback(error);
      });

      return defPlugin;
   }

   /**
    * Получить плагин с сервера с инициализацией плагина
    * Возвращает Deffered, в callback придет объект плагин, в errback придет ошибка запуска плагина.
    * Возможны следующие типы пришедших ошибок:
    * <ol>
    *    <li>'USER_CANCELLED' - пользователь отменил действие;</li>
    *    <li>'SILENT_MODE' - ошибка произошла в режиме тишины;</li>
    *    <li>'INTERNAL_SERVER_ERROR' - ошибка на серверной стороне;</li>
    *    <li>'INTERNAL_CLIENT_ERROR' - ошибка на клиентской стороне;</li>
    *    <li>'INTERACTION_ERROR' - ошибка взаимодействия.</li>
    * </ol>
    * @param {String} pluginName Название плагина.
    * @param {String} pluginVersion Версия плагина.
    * @param {Params} [params] Дополнительные параметры.
    * @returns {$ws.proto.Deferred}
    */
   function getPlugin(pluginName, pluginVersion, params) {
      var def = new $ws.proto.Deferred();

      if (!pluginName) {
         return def.errback('Неверное имя плагина');
      }

      if (!pluginVersion) {
         return def.errback('Неверная версия плагина');
      }

      // На мобильных версиях не работает ни flash, ни плагин
      if ($ws._const.browser.isMobileAndroid || $ws._const.browser.isMobileSafari) {
         createError(errorsType.INTERNAL_CLIENT_ERROR, 'IS_MOBILE', def);
         return def;
      }

      // На MacOS и Linux, тоже не показываем
      if (navigator && navigator.appVersion.indexOf("Win") == -1) {
         createError(errorsType.INTERNAL_CLIENT_ERROR, 'UNSUPPORTED_PLATFORM', def);
         return def;
      }

      params = params || {};
      params.pluginName = pluginName;
      params.version = pluginVersion;
      logger.debugMode = !!params.debug;

      init().addCallbacks(function() {
         run().addCallbacks(function(webSocket) {
            verifySocket(webSocket).addCallbacks(function(webSocket) {
               // Нужно получить версию. Если они отличаются, обновить
               getPluginFromServer(webSocket, params).addCallbacks(function(plugin) {
                  def.callback(plugin);
               }, function(error) {
                  if (error.description in installDialogTemplates) {
                     showError(def, error, params);
                  } else {
                     def.errback(error);
                  }
               });
            }, function(error) {
               // Проблемы проверки порта сокета
               showError(def, error, params);
            });
         }, function(error) {
            // Проблемы соединения
            showError(def, error, params);
         });
      }, function(error) {
         // Проблемы при инициализации
         showError(def, error, params);
      });

      return def;
   }

   /**
    * Получает текущее состояние сокета плагина
    * @param [plugin] Плагин, состояние которого проверяется.
    * @returns {Number} Может вернуть:
    * <ol>
    *    <li>CONNECTING - соединяется;</li>
    *    <li>OPEN - открыт;</li>
    *    <li>CLOSING - закрывается;</li>
    *    <li>CLOSED - закрыт.</li>
    * </ol>
    */
   function getState(plugin) {
      if (plugin === undefined && this._WebSocket)
         return this._WebSocket.readyState;

      return (!plugin || !plugin._WebSocket || !plugin._WebSocket.readyState) ? -1 : plugin._WebSocket.readyState;
   }

   /**
    * Устанавливает для плагина время ожидания запроса в милисекундах (больше 1000)
    * @param {Number} timeout время ожидания
    * @param {Object} [plugin] плагин, которому изменить таймаут
    * @returns {Number} Возвращает установленное время ожидание, иначе -1
    */
   function setQueryTimeout(timeout, plugin) {
      // Проверим, а число ли нам пришло
      if (typeof timeout !== 'number' || isNaN(timeout) || !isFinite(timeout) || timeout <= 1000) {
         return -1;
      }

      if (plugin === undefined && this._WebSocket)
         return this._WebSocket.queryTimeout = timeout;

      return (!plugin || !plugin._WebSocket || !plugin._WebSocket.queryTimeout) ? -1 : plugin._WebSocket.queryTimeout = timeout;
   }

    /**
     * @class $ws.PluginManager
     */
   return {
      getPlugin: getPlugin,
      getState: getState,
      errorsType: errorsType,
      setQueryTimeout: setQueryTimeout,
      readyState: readyState
   };
});
