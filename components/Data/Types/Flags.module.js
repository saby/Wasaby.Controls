/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Types.Flags', [
   'js!SBIS3.CONTROLS.Data.Types.Dictionary',
   'js!SBIS3.CONTROLS.Data.ContextField.Flags',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Dictionary, ContextFieldFlags, Di) {
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
            data: {},

            /**
             * @cfg {Array.<Boolean|Null>} Выбранные значения согласно словарю
             */
            values: []
         }
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
