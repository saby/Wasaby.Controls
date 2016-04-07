/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Flags', [
   'js!SBIS3.CONTROLS.Data.Types.Dictionary',
   'js!SBIS3.CONTROLS.Data.ContextField.Flags',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (Dictionary, ContextFieldFlags, Di, Utils) {
   'use strict';

   /**
    * Тип данных набор флагов
    * @class SBIS3.CONTROLS.Data.Types.Flags
    * @extends SBIS3.CONTROLS.Data.Types.Dictionary
    * @public
    * @author Ганшин Ярослав
    */

   var Flags = Dictionary.extend(/** @lends SBIS3.CONTROLS.Data.Types.Flags.prototype */ {
      _moduleName: 'SBIS3.CONTROLS.Data.Types.Flags',
      $protected: {
         _options: {
            /**
             * @cfg {Array.<Boolean|Null>} Выбранные значения согласно словарю
             */
            values: []
         }
      },

      $constructor: function (cfg) {
         if ('data' in cfg && !('dictionary' in cfg) && !('values' in cfg)) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "data" is deprecated and will be removed in 3.7.4. Use options "dictionary" and "values" instead.', 1);
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
      },

      //region Public methods

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
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::set(): the value "' + name + '" doesn\'t found in dictionary');
         }
         this._options.values[index] = this._prepareValue(value);
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
         this._options.values[index] = this._prepareValue(value);
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
       * Сравнивает с дргуим экземпляром флагов - должен полностью совпадать словарь и набор значений
       * @param {SBIS3.CONTROLS.Data.Types.Flags} value Объект Flags
       * returns {Boolean}
       */
      equals: function (value) {
         if (!(value instanceof Flags)) {
            return false;
         }

         if (!Flags.superclass.equals.call(this, value)) {
            return false;
         }

         var enumerator = this.getEnumerator(),
            key;
         while ((key = enumerator.getNext())) {
            if (this.get(key) !== value.get(key)) {
               return false;
            }
         }

         return true;
      },

      //endregion Public methods

      //region Protected methods

      _prepareValue: function (value) {
         return value === null ? null : !!value;
      },

      _setAll: function (value) {
         var dictionary = this._options.dictionary,
            values = this._options.values,
            index;
         for (index in dictionary) {
            if (dictionary.hasOwnProperty(index)) {
               values[index] = value;
            }
         }
      }

      //endregion Protected methods
   });

   Di.register('data.types.flags', Flags);
   $ws.proto.Context.registerFieldType(new ContextFieldFlags({module: Flags}));

   return Flags;
});
