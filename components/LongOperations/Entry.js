/**
 * Класс, содержащий различные сведения о ходе выполнения длительной операции
 *
 * @class SBIS3.CONTROLS/LongOperations/Entry
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/LongOperations/Entry',
   [
      'Core/core-extend'
   ],

   function (CoreExtend) {
      'use strict';

      /**
       * Список всех возможных статусов длительных операций
       * @protected
       * @type {object}
       */
      var STATUSES = {
         running:   0,
         suspended: 1,
         ended:     2,
         deleted:   4
      };

      /**
       * Значения свойств класса по умолчанию
       * @protected
       * @type {object}
       */
      var DEFAULTS = {
         status: STATUSES.running,
         timeSpent: 0,
         timeIdle: 0,
         progressCurrent: 0,
         progressTotal: 1,
         canDelete: true,
         canSuspend: true
      };

      /**
       * Типы свойств класса
       * @protected
       * @type {object}
       */
      var _PROP_TYPES = {
         title: 'string',
         id: ['string', 'number'],
         producer: 'string',
         tabKey: 'string',
         startedAt: 'Date',
         timeSpent: 'number',
         timeIdle: 'number',
         status: 'number',
         isFailed: 'boolean',
         progressTotal: 'number',
         progressCurrent: 'number',
         canDelete: 'boolean',
         canSuspend: 'boolean',
         resumeAsRepeat: 'boolean',
         userId: 'number',
         userUuId: 'string',
         userFirstName: 'string',
         userPatronymicName: 'string',
         userLastName: 'string',
         userPersonId: 'string',
         userPhotoId: ['string', 'number'],
         userPosition: 'string',
         userDepartment: 'string',
         userPic: 'string',
         resultChecker: 'string',
         resultCheckerArgs: ['string', 'object'],
         resultWayOfUse: 'string',
         resultMessage: 'string',
         resultUrl: 'string',
         resultUrlAsDownload: 'boolean',
         resultValidUntil: 'Date',
         resultHandler: 'string',
         resultHandlerArgs: ['string', 'object'],
         useResult: 'boolean',
         custom: 'object',
         extra: 'object',
         notification: 'string'//TODO: Поменять на progressMessage
      };

      /**
       * Класс, содержащий различные сведения о ходе выполнения длительной операции
       *
       * @class SBIS3.CONTROLS/LongOperations/Entry
       * @extends Core/core-extend
       * @public
       *
       * @author Спирин В.А.
       */
      var LongOperationEntry = CoreExtend.extend(/** @lends SBIS3.CONTROLS/LongOperations/Entry.prototype */{
         _moduleName: 'SBIS3.CONTROLS/LongOperations/Entry',

         /**
          * Конструктор
          * @public
          * @param {object} options Параметры конструктора
          * @param {string}        options.title Отображаемое название операции (обязательный)
          * @param {string|number} options.id Идентификатор операции (обязательный)
          * @param {string}        options.producer Имя продюсера операции (обязательный)
          * @param {Date|number|string} options.startedAt Время начала операции (обязательный)
          * @param {number}        [options.timeSpent] Общее время выполнения (опционально, если не указано, будет использован 0)
          * @param {number}        [options.timeIdle] Общее время простоя (опционально, если не указано, будет использован 0)
          * @param {string|number} [options.status] Статус операции. Возможные значения: 'running', 0, 'suspended', 1, 'ended', 2.
          *                                         (опционально, если не указано, будет использовано 'running')
          * @param {boolean}       [options.isFailed] Показывает, что операция завершена с ошибкой (опционально)
          * @param {number}        [options.progressTotal] Общее количество стадий выполнения (опционально, если не указано, будет использована 1)
          * @param {number}        [options.progress.total] Общее количество стадий выполнения - альтернативно
          * @param {number}        [options.progressCurrent] Текущая стадия выполнения (опционально, если не указано, будет использован 0)
          * @param {number}        [options.progress.current] Текущая стадия выполнения - альтернативно
          * @param {boolean}       [options.canDelete] Можно ли удалить операцию (опционально, если не указано, будет использовано true)
          * @param {boolean}       [options.canSuspend] Можно ли приостановить (и затем возобновить) операцию (опционально, если не указано, будет использовано true)
          * @param {boolean}       [options.resumeAsRepeat] Возобновление операции возможно только как полный повтор (не продолжение с места остановки) (опционально)
          * @param {number}        [options.userId] Идентификатор пользователя (опционально)
          * @param {number}        [options.user.id] Идентификатор пользователя (опционально)
          * @param {string}        [options.userUuId] Идентификатор пользователя в сервисе профилей (опционально)
          * @param {string}        [options.user.uuId] Идентификатор пользователя в сервисе профилей (опционально)
          * @param {string}        [options.userFirstName] Имя пользователя (опционально)
          * @param {string}        [options.user.firstName] Имя пользователя - альтернативно
          * @param {string}        [options.userPatronymicName] Отчество пользователя (опционально)
          * @param {string}        [options.user.patronymicName] Отчество пользователя - альтернативно
          * @param {string}        [options.userLastName] Фамилия пользователя (опционально)
          * @param {string}        [options.user.lastName] Фамилия пользователя - альтернативно
          * @param {string}        [options.userPersonId] Идентификатор персоны пользователя (опционально)
          * @param {string}        [options.user.personId] Идентификатор персоны пользователя - альтернативно
          * @param {string}        [options.userPhotoId] Идентификатор фотографии пользователя (опционально)
          * @param {string}        [options.user.photoId] Идентификатор фотографии пользователя - альтернативно
          * @param {string}        [options.userPosition] Должность пользователя (опционально)
          * @param {string}        [options.user.position] Должность пользователя - альтернативно
          * @param {string}        [options.userD] Подразделение/отдел пользователя (опционально)
          * @param {string}        [options.user.department] Подразделение/отдел пользователя - альтернативно
          * @param {string}        [options.userPic] Урл изображения, если применимо к данной операции (опционально)
          * @param {string}        [options.user.pic] Урл изображения, если применимо к данной операции - альтернативно
          * @param {string}        [options.resultChecker] Строка модуль-метод для проверки доступности результата операции (опционально)
          * @param {string}        [options.result.checker] Строка модуль-метод для проверки доступности результата операции - альтернативно
          * @param {string|object} [options.resultCheckerArgs] Аргументы обработчика проверки доступности результата операции (объект или json-строка) (опционально)
          * @param {string|object} [options.result.checkerArgs] Аргументы обработчика проверки доступности результата операции (объект или json-строка) - альтернативно
          * @param {string}        [options.resultWayOfUse] Название способа использования результата ("Скачать", "Открыть" и т.д.) (опционально)
          * @param {string}        [options.resultMessage] Сообщение о результате операции (опционально)
          * @param {string}        [options.result.message] Сообщение о результате операции - альтернативно
          * @param {string}        [options.resultUrl] Ссылка на результат операции (опционально)
          * @param {string}        [options.result.url] Ссылка на результат операции - альтернативно
          * @param {boolean}       [options.resultUrlAsDownload] Открывать ссылку на результат операции на загрузку (опционально)
          * @param {boolean}       [options.result.urlAsDownload] Открывать ссылку на результат операции на загрузку - альтернативно
          * @param {Date|number|string} [options.resultValidUntil] Результат действителен до указанного времени (опционально)
          * @param {Date|number|string} [options.result.validUntil] Результат действителен до указанного времени - альтернативно
          * @param {string}        [options.resultHandler] Строка модуль-метод для отображения результата операции (опционально)
          * @param {string}        [options.result.handler] Строка модуль-метод для отображения результата операции - альтернативно
          * @param {string|object} [options.resultHandlerArgs] Аргументы обработчика отображения результата операции (объект или json-строка) (опционально)
          * @param {string|object} [options.result.handlerArgs] Аргументы обработчика отображения результата операции (объект или json-строка) - альтернативно
          * @param {boolean}       [options.useResult] Показывает, что даже если операция завершена с ошибкой, то всёравно следует отображать результат операции, а не её историю (опционально)
          * @param {boolean}       [options.result.use] Показывает, что даже если операция завершена с ошибкой, то всёравно следует отображать результат операции, а не её историю (опционально)
          * @param {object}        [options.extra] Дополнительная информация, определяемая конкретным продюсером, если необходимо (опционально)
          * @param {string}        [options.notification] Уведомление, если применимо (опционально)
          */
         constructor: function LongOperationEntry (options) {
            if (!options || typeof options !== 'object') {
               throw new TypeError('Argument "options" must be object');
            }
            var required = ['id', 'title', 'producer', 'startedAt'];
            var prefixes = ['user', 'result', 'progress'];
            var has = {};
            for (var name in _PROP_TYPES) {
               var value = null;
               if (options.hasOwnProperty(name)) {
                  value = options[name];
               }
               else {
                  for (var i = 0; i < prefixes.length; i++) {
                     var root = prefixes[i];
                     if (root.length < name.length && name.indexOf(root) === 0) {
                        if (!(root in has)) {
                           has[root] = options.hasOwnProperty(root) && options[root] && typeof options[root] === 'object';
                        }
                        if (has[root]) {
                           var altName = name.charAt(root.length).toLowerCase() + name.substring(root.length + 1);
                           if (options[root].hasOwnProperty(altName)) {
                              value = options[root][altName];
                           }
                        }
                     }
                  }
               }
               var ts = _PROP_TYPES[name];
               var isValid;
               if (value != null) {
                  var isList = Array.isArray(ts);
                  isValid = isList ? ts.some(function (t) { return _isA(value, t); }) : _isA(value, ts);
                  if (!isValid) {
                     if (isList ? ts.indexOf('Date') !== -1 : ts === 'Date') {
                        // Если дата указана, но не в виде Date
                        value = new Date(value);
                        isValid = true;
                     }
                     if (name === 'status' && typeof value === 'string') {
                        // Если статус указан по имени
                        if (value in STATUSES) {
                           value = STATUSES[value];
                           isValid = true;
                        }
                     }
                  }
                  else {
                     if (name === 'status' && !Object.keys(STATUSES).some(function (k) { return value === STATUSES[k]; })) {
                        isValid = false;
                     }
                  }
               }
               if (value == null || !isValid) {
                  // Допустимого значения нет
                  if (required.indexOf(name) !== -1) {
                     // Нет обязательного аргумента - ошибка
                     throw new TypeError('Argument "options.' + name + '" must be ' + (Array.isArray(ts) ? ts.join(' or ') : 'a ' + ts));
                  }
                  else {
                     // Установить значение по умолчанию
                     value = name in DEFAULTS ? DEFAULTS[name] : null;
                  }
               }
               this[name] = value;
            }
            if (!this.progressCurrent && this.status === STATUSES.ended) {
               this.progressCurrent = this.progressTotal;
            }
         },

         /**
          * Экспортировать текущее состояние в компактный объект
          * @public
          * @return {object}
          */
         toSnapshot: function () {
            var snapshot = {};
            for (var name in _PROP_TYPES) {
               var value = this[name];
               if (value != null && !(name in DEFAULTS && value === DEFAULTS[name])) {
                  snapshot[name] = value instanceof Date ? value.getTime() : value;
               }
            }
            return snapshot;
         }
      });



      /**
       * Константы класса (как бы) - Список всех возможных статусов длительных операций
       * @public
       * @type {object}
       */
      LongOperationEntry.STATUSES = STATUSES;

      /**
       * Константы класса (как бы) - Список значений по умочанию
       * @public
       * @type {object}
       */
      LongOperationEntry.DEFAULTS = DEFAULTS;



      /**
       * Определить, имеет ли значение указанный тип
       * @protected
       * @param {any} value Значение
       * @param {string} type Встроенный тип или имя класса
       * @return {boolean}
       */
      var _isA = function (value, type) {
         if (typeof value === type) {
            return true;
         }
         if (['boolean', 'number', 'string', 'object'].indexOf(type) === -1) {
            var root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : null);
            if (root) {
               return typeof root[type] === 'function' && value instanceof root[type];
            }
         }
         return false;
      };



      return LongOperationEntry;
   }
);
