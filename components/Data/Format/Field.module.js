/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.Field', [
], function () {
   'use strict';

   /**
    * Формат поля записи
    * @class SBIS3.CONTROLS.Data.Format.Field
    * @public
    * @author Мальцев Алексей
    */

   var Field = $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Format.Field.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.Field',
      $protected: {
         _options: {
            /**
             * @cfg {*} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: null,

            /**
             * @cfg {String} Имя поля
             * @see getName
             * @see setName
             */
            name: '',

            /**
             * @cfg {Boolean} Значение может быть null
             * @see isNullable
             * @see setNullable
             */
            nullable: false
         }
      },

      //region Public methods

      /**
       * Возвращает значение поля по умолчанию
       * @returns {*}
       * @see defaultValue
       * @see setDefaultValue
       */
      getDefaultValue: function () {
         return this._options.defaultValue;
      },

      /**
       * Устанавливает значение поля по умолчанию
       * @param {*} value Значение поля по умолчанию
       * @see defaultValue
       * @see getDefaultValue
       */
      setDefaultValue: function (value) {
         this._options.defaultValue = value;
      },

      /**
       * Возвращает имя поля
       * @returns {String}
       * @see name
       * @see setName
       */
      getName: function () {
         return this._options.name;
      },

      /**
       * Устанавливает имя поля
       * @param {String} name Имя поля
       * @see name
       * @see getName
       */
      setName: function (name) {
         this._options.name = name;
      },

      /**
       * Возвращает признак, что значение может быть null
       * @returns {Boolean}
       * @see name
       * @see setNullable
       */
      isNullable: function () {
         return this._options.nullable;
      },

      /**
       * Устанавливает признак, что значение может быть null
       * @param {Boolean} nullable Значение может быть null
       * @see name
       * @see isNullable
       */
      setNullable: function (nullable) {
         this._options.nullable = nullable;
      },

      /**
       * Клонирует формат поля
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       */
      clone: function () {
         throw new Error('Under construction');
      },

      /**
       * Копирует формат поля из другого формата
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля, который надо скопировать
       */
      copyFrom: function (format) {
         throw new Error('Under construction');
      },

      /**
       * Сравнивает 2 формата поля на идентичность: совпадает набор названий и порядок полей. Для полей со словарем - словарь.
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля, с которым сравнить
       * @returns {Boolean}
       */
      isEqual: function (format) {
         throw new Error('Under construction');
      }

      //endregion Public methods

   });
   
   return Field;
});
