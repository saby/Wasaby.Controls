define('js!SBIS3.CONTROLS.LongOperationHistoryItem',
   [
      'Core/core-extend'
   ],

   function (CoreExtend) {
      'use strict';

      /**
       * Типы свойств класса
       * @protected
       * @type {object}
       */
      var _PROP_TYPES = {
         title: 'string',
         id: ['string', 'number'],
         //producer: 'string',
         endedAt: 'Date',
         errorMessage: 'string',
         isFailed: 'boolean'
      };

      /**
       * Значения свойств класса по умолчанию
       * @protected
       * @type {object}
       */
      var _DEFAULTS = {
         isFailed: false
      };

      /**
       * Класс, описывающий элемент истории длительной операции
       *
       * @class SBIS3.CONTROLS.LongOperationHistoryItem
       * @extends Core/core-extend
       * @author Спирин Виктор Алексеевич
       * @public
       */
      var LongOperationHistoryItem = CoreExtend.extend(/** @lends SBIS3.CONTROLS.LongOperationHistoryItem.prototype */{
         _moduleName: 'SBIS3.CONTROLS.LongOperationHistoryItem',

         /**
          * Конструктор
          * @public
          * @param {object} options Параметры конструктора
          * @param {string}        options.title Отображаемое название операции (обязательный)
          * @param {string|number} options.id Идентификатор операции (обязательный)
          * //@param {string}        options.producer Имя продюсера операции (обязательный)
          * @param {Date|number|string} options.endedAt Время начала операции (обязательный)
          * @param {string}        [options.errorMessage] Сообщение об ошибке, если есть (опционально)
          * @param {boolean}       [options.isFailed] Указывает на наличие ошибки (опционально)
          */
         constructor: function LongOperationHistoryItem (options) {
            if (!options || typeof options !== 'object') {
               throw new TypeError('Argument "options" must be object');
            }
            var required = ['id', 'title', /*'producer',*/ 'endedAt'];
            for (var name in _PROP_TYPES) {
               var value = null;
               if (options.hasOwnProperty(name)) {
                  value = options[name];
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
                     value = name in _DEFAULTS ? _DEFAULTS[name] : null;
                  }
               }
               this[name] = value;
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
               if (value != null && !(name in _DEFAULTS && value === _DEFAULTS[name])) {
                  snapshot[name] = value instanceof Date ? value.getTime() : value;
               }
            }
            return snapshot;
         }
      });



      /**
       * Определить, имеет ли значение указанный тип
       * @protected
       * @param {any} value Значение
       * @param {string} type Встроенный тип или имя класса
       * @return {boolean}
       */
      var _isA = function (value, type) {
         return typeof value === type || (['boolean', 'number', 'string', 'object'].indexOf(type) === -1 && typeof window[type] === 'function' && value instanceof window[type]);
      };



      return LongOperationHistoryItem;
   }
);
