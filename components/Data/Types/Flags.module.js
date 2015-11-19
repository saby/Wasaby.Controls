/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Flags', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator'
], function (IEnumerable, ArrayEnumerator) {
   'use strict';
   /**
    * Интерфейс флагов
    * @mixin SBIS3.CONTROLS.Data.Types.IEnumerable
    * @public
    * @author Ганшин Ярослав
    */

   var Flags = $ws.core.extend({}, [IEnumerable], {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Flags',
      $protected: {
         _options: {
            data: {}
         },
         _selected: [],
         _enumerator: undefined,
         _indexed: [],
         _length: undefined
      },
      $constructor: function (cfg) {
         var data = cfg.data;
         if (!(data instanceof Object)) {
            throw new Error('Data must be instance of an object');
         }
         this._length = 0;
         for (var key in data) {
            if (data.hasOwnProperty(key)) {
               data[key] = this._prepareValue(data[key]);
               this._length++;
            }
         }
         if (!cfg.indexed) {
            this._buildIndex(cfg);
         }
      },
      /**
       * Возвращает значение флага по названию
       * @param name {String} Название флага
       * @returns {Boolean|Null}
       */
      get: function (name) {
         var data = this._options.data;
         if (data.hasOwnProperty(name)) {
            return data[name];
         }
         return undefined;
      },
      /**
       * Устанавливает значение флага по названию
       * @param name {String} Название флага
       * @param value {Boolean|Null} Значение
       */
      set: function (name, value) {
         var data = this._options.data;
         if (data.hasOwnProperty(name)) {
            data[name] = value === null ? null : !!value;
         } else {
            throw new Error('The name "'+name+'" doesnt found in dictionary');
         }
      },
      /**
       * Возвращает значение флага по индексу
       * @param index {Number} Индекс флага
       * returns {Boolean|Null}
       */
      getByIndex: function (index) {
         var key = this._getKeByIndex(index);
         return this.get(key);
      },
      /**
       * Устанавливает значение флага по индексу
       * @param index {Number} - индекс флага
       * @param value {Boolean|Null} - значение флага
       */
      setByIndex: function (index, value) {
         var key = this._getKeByIndex(index);
         if(typeof key === 'undefined'){
            throw new Error('The index is out of range');
         }
         this.set(key, value);
      },
      /**
       * Установить всем флагам false
       */
      setFalseAll: function () {
         this._setAll(false);
      },
      /**
       * Установить всем флагам true
       */
      setTrueAll: function () {
         this._setAll(true);
      },
      /**
       * Установить всем флагам null
       */
      setNullAll: function () {
         this._setAll(null);
      },
      /**
       * Сравнивает с флагами
       * @param obj {Flags} - Объект Flags
       * returns {Boolean}
       */
      equals: function (value) {
         if (!(value instanceof Flags)) {
            throw new Error("Value isn't a flags");
         }
         var result = true,
            self = this,
            len = 0;
         value.each(function (value, key) {
            if (result && self.get(key) === value)
               len++;
            else
               result = false;
         });
         if (result && this._length === len) {
            return true;
         }
         return false;
      },
      each: function (callback, context) {
         context = context || this;
         var enumerator = this.getEnumerator(),
            key, index = 0;
         this._enumerator.reset();
         while ((key = enumerator.getNext())) {
            callback.call(context, key, index++);
         }
      },
      getEnumerator: function () {
         if (!this._enumerator) {
            this._enumerator = new ArrayEnumerator({
               items: this._indexed
            });
         }
         return this._enumerator;
      },
      _prepareValue: function (value) {
         return value === null ? null : !!value;
      },
      _buildIndex: function () {
         var data = this._options.data;
         this._indexed = [];
         for (var key in data) {
            if (data.hasOwnProperty(key)) {
               this._indexed.push(key);
            }
         }
      },
      _getKeByIndex: function (index) {
         return this._indexed[index];
      },
      _setAll: function (value) {
         var data = this._options.data;
         value = this._prepareValue(value);
         for (var key in data) {
            if (data.hasOwnProperty(key)) {
               data[key] = value;
            }
         }
      }
   });
   return Flags;
});
