/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Flags', [
   'js!SBIS3.CONTROLS.Data.Collection.IEnumerable',
   'js!SBIS3.CONTROLS.Data.Collection.ArrayEnumerator',
   'js!SBIS3.CONTROLS.Data.ContextField.Flags',
   'js!SBIS3.CONTROLS.Data.Di'
], function (IEnumerable, ArrayEnumerator, ContextFieldFlags, Di) {
   'use strict';
   /**
    * Тип данных набор флагов
    * @class SBIS3.CONTROLS.Data.Types.Flags
    * @mixes SBIS3.CONTROLS.Data.Collection.IEnumerable
    * @public
    * @author Ганшин Ярослав
    */

   var Flags = $ws.core.extend({}, [IEnumerable],/** @lends SBIS3.CONTROLS.Data.Types.Flags.prototype */ {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Flags',
      $protected: {
         _options: {
            data: {},

            /**
             * @cfg {Array.<String>} Словарь возможных значений
             */
            dictionary: [],

            /**
             * @cfg {Array.<Boolean|Null>} Выбранные значения согласно словарю
             */
            values: []
         },
         _enumerator: undefined
      },
      $constructor: function (cfg) {
         if ('data' in cfg && !('dictionary' in cfg) && !('values' in cfg)) {
            $ws.single.ioc.resolve('ILogger').log(this._moduleName + '::$constructor()', 'Option "data" is deprecated and will be removed in 3.7.4. Use options "dictionary" and "values" instead.');

            var data = cfg.data;
            if (!(data instanceof Object)) {
               throw new TypeError('Option "data" must be an instance of Object');
            }
            for (var key in data) {
               if (data.hasOwnProperty(key)) {
                  this._options.dictionary.push(key);
                  this._options.values.push(data[key]);
               }
            }
         }

         if (this._options.dictionary instanceof Object && this._options.dictionary instanceof Array) {
            var dictionary = [];
            for (var index in this._options.dictionary){
               if (this._options.dictionary.hasOwnProperty(index)) {
                  dictionary[index] = this._options.dictionary[index];
               }
            }
            this._options.dictionary = dictionary;
         }
      },

      /**
       * Возвращает значение флага по названию
       * @param name {String} Название флага
       * @returns {Boolean|Null}
       */
      get: function (name) {
         var index = this._getIndex(name);
         if (index > -1) {
            return this._options.values[index];
         }
         return undefined;
      },

      /**
       * Устанавливает значение флага по названию
       * @param name {String} Название флага
       * @param value {Boolean|Null} Значение
       */
      set: function (name, value) {
         var index = this._getIndex(name);
         if (index > -1) {
            this._options.values[index] = value === null ? null : !!value;
         } else {
            throw new ReferenceError('The name "' + name + '" doesn\'t found in dictionary');
         }
      },

      /**
       * Возвращает значение флага по индексу
       * @param index {Number} Индекс флага
       * returns {Boolean|Null}
       */
      getByIndex: function (index) {
         return this._options.values[index];
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
         this._options.values[index] = value;
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
         if (value instanceof Flags) {
            var result = true,
               self = this,
               len = 0;
            value.each(function (key) {
               if (result && self.get(key) === value.get(key)) {
                  len++;
               } else {
                  result = false;
               }
            });
            if (result && this._options.dictionary === len) {
               return true;
            }
         }
         return false;
      },

      each: function (callback, context) {
         context = context || this;
         var enumerator = this.getEnumerator(),
            key, index = 0;
         enumerator.reset();
         while ((key = enumerator.getNext())) {
            callback.call(context, key, index++);
         }
      },

      getEnumerator: function () {
         if (!this._enumerator) {
            this._enumerator = new ArrayEnumerator({
               items: this._options.dictionary
            });
         }
         return this._enumerator;
      },

      _getIndex: function (name) {
         return Array.indexOf(this._options.dictionary, name);
      },

      _prepareValue: function (value) {
         return value === null ? null : !!value;
      },

      _getKeByIndex: function (index) {
         return this._options.dictionary[index];
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

   Di.register('data.types.flags', Flags);
   $ws.proto.Context.registerFieldType(new ContextFieldFlags({module: Flags}));

   return Flags;
});
