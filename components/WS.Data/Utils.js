/* global define */
define('js!WS.Data/Utils', [
   'Core/Serializer',
   'Core/core-instance',
   'Core/IoC'
], function (
   Serializer,
   CoreInstance,
   IoC
) {
   /**
    * Утилиты для коллекций
    * @class WS.Data/Utils
    * @public
    * @author Мальцев Алексей
    */

   var Utils = /** @lends WS.Data/Utils.prototype */{
      _moduleName: 'WS.Data/Utils',

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

         //item._wsDataEntityIObject is equal to CoreInstance.instanceOfMixin(item, 'WS.Data/Entity/IObject')
         if (item && item._wsDataEntityIObject && item.has(property)) {
            return item.get(property);
         }

         var getter = this._getPropertyMethodName(property, 'get');
         if (typeof item[getter] === 'function' && !item[getter].deprecated) {
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

         //item._wsDataEntityIObject is equal to CoreInstance.instanceOfMixin(item, 'WS.Data/Entity/IObject')
         if (item && item._wsDataEntityIObject && item.has(property)) {
            return item.set(property, value);
         }

         var setter = this._getPropertyMethodName(property, 'set');
         if (typeof item[setter] === 'function' && !item[setter].deprecated) {
            return item[setter](value);
         }

         throw new ReferenceError('Object doesn\'t have setter for property "' + property + '".');
      },

      /**
       * Клонирует объект
       * @param {Object} object Объект
       * @return {Object} Клон объекта
       * @static
       */
      clone: function (object) {
         if (object instanceof Object) {
            if (object._wsDataEntityICloneable) {//it's equal to CoreInstance.instanceOfMixin(object, 'WS.Data/Entity/ICloneable')
               return object.clone();
            } else {
               var serializer = new Serializer();
               serializer.setDetectContainers(false);
               return JSON.parse(
                  JSON.stringify(object, serializer.serialize),
                  serializer.deserialize
               );
            }
         } else {
            return object;
         }
      },

      logger: {
         /**
          * Пишет в лог сообщение
          * @param {String} message Сообщение
          * @static
          */
         log: function () {
            var logger = IoC.resolve('ILogger');
            logger.log.apply(logger, arguments);
         },

         /**
          * Пишет в лог сообщение об ошибке
          * @param {String} message Сообщение
          * @static
          */
         error: function () {
            var logger = IoC.resolve('ILogger');
            logger.error.apply(logger, arguments);
         },

         /**
          * Пишет в лог информационное сообщение
          * @param {String} message Сообщение
          * @static
          */
         info: function () {
            var logger = IoC.resolve('ILogger');
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
            var error = new Error(message),
               at = 2 + offset,//текщий контекст -> вызвавший logStack -> вызвавший ошибку
               script = '',
               hash = '';

            if ('stack' in error) {
               var stack = (error.stack + '').split('\n');
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

            IoC.resolve('ILogger')[level](error.message + (script ? ' [' + script + ']' : ''));
         }
      },

      _getPropertyMethodName: function (property, prefix) {
         return prefix + property.substr(0, 1).toUpperCase() + property.substr(1);
      }
   };

   return Utils;
});
