/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Core', [], function () {
   /**
    * Ядро системы типов
    * @class SBIS3.CONTROLS.Data.Core
    * @public
    * @ignoreMethods extend override
    * @author Мальцев Алексей
    */

   var _private = {
      contextualExtend: function(mixins, overrides) {
         return Core.extend(this, mixins, overrides);
      },
      mixinWrappers: {
         $around: 'callAround',
         $after: 'callNext',
         $before: 'callBefore'
      }
   };

   var Core = /** @lends SBIS3.CONTROLS.Data.Core.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Core',

      /**
       * Наследует один модуль от другого
       * @param {Function} parent Конструктор родителя
       * @param {Array.<Object>} mixins Миксины
       * @param {Object} overrides Переназначенные свойства и методы
       * @return {Function} Конструктор потомка
       * @static
       */
      extend: function (Parent, mixins, overrides) {
         if (!(Parent instanceof Function)) {
            overrides = mixins;
            mixins = Parent;
            Parent = Object;
         }
         if (!(mixins instanceof Array)) {
            overrides = mixins;
            mixins = undefined;
         }

         if (!overrides) {
            overrides = {};
         }
         if (!overrides.hasOwnProperty('constructor')) {
            overrides.constructor = function() {
               Parent.prototype.constructor.apply(this, arguments);
            };
         }

         var Child = overrides.constructor,
            Proxy = function () {};
         Proxy.prototype = Parent.prototype;
         Child.prototype = new Proxy();
         Child.superclass = Parent.prototype;

         if (mixins) {
            for (var i = 0, count = mixins.length; i < count; i++) {
               this.mixin(Child.prototype, mixins[i]);
            }
         }

         this.override(Child.prototype, overrides);

         Child.extend = _private.contextualExtend;

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
            if (!target._mixins) {
               target._mixins = [];
            }
            target._mixins.push(mixin);

            var wrappers = _private.mixinWrappers,
               item,
               key,
               wrapperMethod,
               wrapperKey;
            for (key in mixin) {
               if (mixin.hasOwnProperty(key)) {
                  item = mixin[key];
                  if (wrappers.hasOwnProperty(key)) {
                     wrapperMethod = wrappers[key];
                     for (wrapperKey in item) {
                        if (item.hasOwnProperty(wrapperKey)) {
                           if (target[wrapperKey] instanceof Function) {
                              target[wrapperKey] = target[wrapperKey][wrapperMethod](item[wrapperKey]);
                           } else {
                              target[wrapperKey] = item[wrapperKey];
                           }
                        }
                     }
                  } else {
                     target[key] = item;
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
                  target[key] = source[key];
               }
            }
         }
      }
   };

   return Core;
});
