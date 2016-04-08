/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Utils', [], function () {
   /**
    * Утилиты для коллекций
    * @class SBIS3.CONTROLS.Data.Utils
    * @public
    * @ignoreMethods extend override
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Utils.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Utils',

      /**
       * Наследует один модуль от другого
       * @param {Function} [child=Object] Конструктор потомка
       * @param {Function} parent Конструктор родителя
       * @param {Array.<Object>} mixins Миксины
       * @param {Object} overrides Переназначенные свойства и методы
       * @return {Function} Конструктор потомка
       * @static
       */
      extend: function (Child, Parent, mixins, overrides) {
         if (Child instanceof Array) {
            overrides = Parent;
            mixins = Child;
            Parent = undefined;
            Child = undefined;
         } else if (Parent instanceof Array) {
            overrides = mixins;
            mixins = Parent;
            Parent = Child;
            Child = undefined;
         }
         if (!mixins instanceof Array) {
            overrides = mixins;
            mixins = undefined;
         }

         if (Child === undefined) {
            this._defaultConstructor = this._defaultConstructor || function() {
               Parent && Parent.prototype.constructor.apply(this, arguments);
            };
            Child = overrides.hasOwnProperty('constructor') ? overrides.constructor : this._defaultConstructor ;
         }

         if (Parent === undefined) {
            Parent = Object;
         }

         var Proxy = function () {};
         Proxy.prototype = Parent.prototype;
         Child.prototype = new Proxy();
         Child.prototype.constructor = Child;
         Child.superclass = Parent.prototype;

         if (mixins) {
            for (var i = 0, count = mixins.length; i < count; i++) {
               this.mixin(Child.prototype, mixins[i]);
            }
         }

         if (overrides) {
            delete overrides.constructor;
            this.override(Child.prototype, overrides);
         }

         return Child;
      },

      /**
       * Добавляет примесь в модуль
       * @param {Object} target Прототип модуля
       * @param {Object} mixin Примесь
       * @static
       */
      mixin: function (target, mixin) {
         if (mixin instanceof Object) {
            for (var key in mixin) {
               if (mixin.hasOwnProperty(key)) {
                  if (target.hasOwnProperty(key) &&
                     target[key] instanceof Function
                  ) {
                     target[key] = target[key].callAround(mixin[key]);
                  } else {
                     target[key] = mixin[key];
                  }
               }
            }
         }
      },

      /**
       * Перезаписывает свойства одного объекта свойствами другого
       * @param {Object} target Объект, в которые пишем
       * @param {Object} source Объект, из которого получаем
       * @static
       */
      override: function (target, source) {
         if (source instanceof Object) {
            for (var key in source) {
               if (source.hasOwnProperty(key)) {
                  if (target.hasOwnProperty(key) &&
                     target[key] instanceof Function
                  ) {
                     target[key] = target[key].callAround(source[key]);
                  } else {
                     target[key] = source[key];
                  }
               }
            }
         }
      },

      /**
       * Возвращает значение свойства элемента
       * @param {*} item Элемент.
       * @param {String} property Название свойства.
       * @static
       */
      getItemPropertyValue: function (item, property) {
         property = property || '';

         if (item === null || typeof item !== 'object') {
            return undefined;
         }

         if (property in item) {
            return item[property];
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IPropertyAccess') && item.has(property)) {
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

         if (item === null || typeof item !== 'object') {
            throw new TypeError('Argument item should be an instance of Object');
         }

         if (property in item) {
            item[property] = value;
         }

         if ($ws.helpers.instanceOfMixin(item, 'SBIS3.CONTROLS.Data.IPropertyAccess') && item.has(property)) {
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
});
