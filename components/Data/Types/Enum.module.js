/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Enum', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'
], function (IEnumerable, ArrayEnumerator) {
   /**
    * Тип данных перечисляемое.
    * @class SBIS3.CONTROLS.Data.Types.Enum
    * @mixin SBIS3.CONTROLS.Data.Data.Types.IEnumerable
    * @public
    * @author Ганшнин Ярослав
    */
   'use strict';
   var Enum = $ws.core.extend({}, [IEnumerable], {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Enum',
      $protected: {
         _options: {
            data: [],
            currentValue: undefined
         },
         _enumerator: undefined
      },
      $constructor: function (cfg) {
         if (!($ws.helpers.type(cfg.data) == 'array')) {
            throw new Error('The data must be instance of an array');
         }
      },
      each: function (callback, context) {
         context = context || this;
         $ws.helpers.forEach(this._options.data, callback, context);
      },
      toArray: function () {
         return this._options.data;
      },
      getEnumerator: function () {
         if (!this._enumerator) {
            this._enumerator = new ArrayEnumerator({
               items: this._options.data
            });
         }
         return this._enumerator;
      },
      /**
       * Возвращает текущее значение
       * @returns {Number}
       */
      get: function () {
         return this._options.currentValue;
      },
      /**
       * Устанаваливает текущее значение
       * @param index {index} Идентификатор записи
       */
      set: function (index) {
         if (index in this._options.data || index === null) {
            this._options.currentValue = index;
         }
         else {
            throw 'The index is out of range';
         }
      },
      /**
       * Возвращает текущее значение
       * @deprecated Будет удалено с 3.8.0 Используйте {@link get}
       * @returns {Number}
       */
      getCurrentValue: function () {
         $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Types.Enum:getCurrentValue', 'Начиная с версии 3.7.3 метод getCurrentValue является устаревшим, используйте метод get.');
         return this.get();
      },
      /**
       * Устанаваливает элемент текущим по значению
       * @param value {String}
       */
      setByValue: function (value) {
         var index = Array.indexOf(this._options.data, value);
         if (index !== -1 || value === null) {
            this._options.currentValue = index !== -1 ? index : null;
         }
         else {
            throw "The value was not found in the dictionary";
         }
      },
      /**
       * Возвращает текстовое значение
       */
      toString: function () {
         return this._otions.data[this.get()];
      },
      /**
       * Возвращает представление Enum в виде объекта.
       * @deprecated Будет удалено с 3.8.0 Используйте {@link toArray}
       * @returns {Number}
       */
      getValues: function () {
         $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Types.Enum:getValues', 'Начиная с версии 3.7.3 метод getCurrentValue является устаревшим, используйте метод toArray.');
         var values = {};
         this.each(function (key, index) {
            values[index] = key;
         });
         return values;
      },
      equals: function (value) {
         if (value instanceof Enum) {
            if (this.get() !== value.get()) {
               return false;
            }
            var equal = true,
               data = this._options.data,
               len = 0;
            value.each(function (name, index) {
               if (equal && name !== data[index]) {
                  equal = false;
               }
               len++;
            });
            return equal && len == this._options.data.length;
         }
         return false;
      }
   });
   return Enum;
});
