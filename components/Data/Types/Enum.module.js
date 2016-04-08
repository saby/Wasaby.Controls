/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Enum', [
   'js!SBIS3.CONTROLS.Data.Types.Dictionary',
   'js!SBIS3.CONTROLS.Data.ContextField.Enum',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Dictionary, ContextFieldEnum, Di, Utils) {
   'use strict';

   /**
    * Тип данных перечисляемое.
    * @class SBIS3.CONTROLS.Data.Types.Enum
    * @extends SBIS3.CONTROLS.Data.Types.Dictionary
    * @public
    * @author Ганшнин Ярослав
    */

   var Enum = Dictionary.extend(/** @lends SBIS3.CONTROLS.Data.Types.Enum.prototype */ {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Enum',
      $protected: {
         _options: {
            /**
             * @cfg {Number|Null} Текущее значение
             */
            currentValue: null
         }
      },

      $constructor: function (cfg) {
         if ('data' in cfg && !('dictionary' in cfg)) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "data" is deprecated and will be removed in 3.7.4. Use option "dictionary" instead.', 1);
            var data = cfg.data;
            if (!(data instanceof Object)) {
               throw new TypeError('Option "data" must be an instance of Object');
            }
            for (var key in data) {
               if (data.hasOwnProperty(key)) {
                  this._options.dictionary.push(data[key]);
               }
            }
         }
      },

      //region Public methods

      /**
       * Возвращает текущее значение
       * @returns {Number|Null}
       */
      get: function () {
         return this._options.currentValue;
      },

      /**
       * Устанаваливает текущее значение
       * @param {Number|Null} index Индекс значения в словаре
       */
      set: function (index) {
         if (index === null || this._options.dictionary[index] !== undefined) {
            this._options.currentValue = index;
         } else {
            throw new ReferenceError(this._moduleName + '::set(): the index "' + index + '" is out of range');
         }
      },

      /**
       * Возвращает текущее значение
       * @deprecated Будет удалено с 3.7.4 Используйте {@link get}
       * @returns {Number}
       */
      getCurrentValue: function () {
         Utils.logger.stack(this._moduleName + '::getCurrentValue(): method is deprecated and will be removed in 3.7.4. Use get() instead.');
         return this.get();
      },

      /**
       * Устанаваливает элемент текущим по значению
       * @param value {String}
       */
      setByValue: function (value) {
         if (value === null) {
            this._options.currentValue = value;
            return;
         }
         var index = this._getIndex(value);
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::setByValue(): the value "' + value + '" doesn\'t found in dictionary');
         }
         this._options.currentValue = index;
      },

      /**
       * Возвращает представление Enum в виде массива.
       * @deprecated Будет удалено с 3.7.4 Используйте {@link each}
       * @returns {Array}
       */
      getValues: function () {
         Utils.logger.stack(this._moduleName + '::getValues(): method is deprecated and will be removed in 3.7.4. Use each() instead.');
         var values = [];
         this.each(function (key, index) {
            values[index] = key;
         });
         return values;
      },

      /**
       * Сравнивает с дргуим экземпляром перечисляемого - должен полностью совпадать словарь и текущее значение
       * @param {SBIS3.CONTROLS.Data.Types.Enum} value
       * @returns {boolean}
       */
      equals: function (value) {
         if (!(value instanceof Enum)) {
            return false;
         }

         if (!Enum.superclass.equals.call(this, value)) {
            return false;
         }

         return this.get() === value.get();
      }

      //endregion Public methods
   });

   Di.register('data.types.enum', Enum);
   $ws.proto.Context.registerFieldType(new ContextFieldEnum({module: Enum}));

   return Enum;
});
