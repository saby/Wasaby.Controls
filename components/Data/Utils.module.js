/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Utils', [], function () {
   /**
    * Утилиты для коллекций
    * @class SBIS3.CONTROLS.Data.Utils
    * @public
    * @author Мальцев Алексей
    */

   var Utils = /** @lends SBIS3.CONTROLS.Data.Utils.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Utils',

      /**
       * Возвращает значение свойства элемента
       * @param {*} item Элемент.
       * @param {String} property Название свойства.
       * @static
       */
      getItemPropertyValue: function (item, property) {
         property = property || '';

         if (!(item instanceof Object)) {
            return undefined;
         }

         if (property in item) {
            return item[property];
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IObject') && item.has(property)) {
            return item.get(property);
         }

         var getter = this._getPropertyMethodName(property, 'get');
         if (typeof item[getter] === 'function') {
            return item[getter]();
         }

         return undefined;
      },

      /**
       * Устанавливает значение свойства элемента
       * @param {*} item Элемент.
       * @param {String} property Название свойства.
       * @param {*} value Значение свойства.
       * @static
       */
      setItemPropertyValue: function (item, property, value) {
         property = property || '';

         if (!(item instanceof Object)) {
            throw new TypeError('Argument item should be an instance of Object');
         }

         if (property in item) {
            item[property] = value;
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IObject') && item.has(property)) {
            return item.set(property, value);
         }

         var setter = this._getPropertyMethodName(property, 'set');
         if (typeof item[setter] === 'function') {
            return item[setter](value);
         }

         throw new ReferenceError('Object doesn\'t have setter for property "' + property + '".');
      },

      logger: {
         /**
          * Пишет в лог сообщение
          * @param {String} message Сообщение
          * @static
          */
         log: function () {
            var logger = $ws.single.ioc.resolve('ILogger');
            logger.log.apply(logger, arguments);
         },

         /**
          * Пишет в лог сообщение об ошибке
          * @param {String} message Сообщение
          * @static
          */
         error: function () {
            var logger = $ws.single.ioc.resolve('ILogger');
            logger.error.apply(logger, arguments);
         },

         /**
          * Пишет в лог информационное сообщение
          * @param {String} message Сообщение
          * @static
          */
         info: function () {
            var logger = $ws.single.ioc.resolve('ILogger');
            logger.info.apply(logger, arguments);
         },

         /**
          * Пишет в лог предупреждение с указанием файла, спровоцировавшего это предупреждение.
          * Для каждой точки файла предупреждение выводится только один раз.
          * @param {String} message Сообщение
          * @param {Number} [offset=0] Смещение по стеку
          * @param {String} [level=info] Уровень логирования
          * @static
          */
         stack: function (message, offset, level) {
            offset = offset || 0;
            level = level || 'info';
            var at = 2 + offset,//текщий контекст -> вызвавший logStack -> вызвавший ошибку
               script = '',
               hash = '';

            try {
               throw new Error(message);
            } catch (e) {
               if ('stack' in e) {
                  var stack = (e.stack + '').split('\n');
                  this._stackReg = this._stackReg || /:[0-9]+:[0-9]+/;
                  if (!this._stackReg.test(stack[0])) {
                     at++;//первой строкой может идти текст ошибки
                  }
                  script = stack.splice(at, 1).join('').trim();
                  hash = message + script;
                  this._stackPoints = this._stackPoints || {};
                  if (this._stackPoints.hasOwnProperty(hash)) {
                     return;
                  }
                  this._stackPoints[hash] = true;
               }
               $ws.single.ioc.resolve('ILogger')[level](e.message + (script ? ' [' + script + ']' : ''));
            }
         }
      },

      _getPropertyMethodName: function (property, prefix) {
         return prefix + property.substr(0, 1).toUpperCase() + property.substr(1);
      }
   };

   return Utils;
});
