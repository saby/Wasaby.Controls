/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.Field', [
   'js!SBIS3.CONTROLS.Data.ICloneable',
   'js!SBIS3.CONTROLS.Data.CloneableMixin',
   'js!SBIS3.CONTROLS.Data.SerializableMixin'
], function (ICloneable, CloneableMixin, SerializableMixin) {
   'use strict';

   /**
    * Прототип поля записи (абстрактный класс)
    * @class SBIS3.CONTROLS.Data.Format.Field
    * @mixes SBIS3.CONTROLS.Data.ICloneable
    * @mixes SBIS3.CONTROLS.Data.CloneableMixin
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Field = $ws.core.extend({}, [ICloneable, CloneableMixin, SerializableMixin], /** @lends SBIS3.CONTROLS.Data.Format.Field.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.Field',
      $protected: {
         _options: {
            /**
             * @cfg {String} Имя поля
             * @see getName
             * @see setName
             */
            name: '',

            /**
             * @cfg {*} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: null,

            /**
             * @cfg {Boolean} Значение может быть null
             * @see isNullable
             * @see setNullable
             */
            nullable: true
         }
      },

      //region SBIS3.CONTROLS.Data.SerializableMixin
      //endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region Public methods

      /**
       * Возвращает тип поля
       * @returns {String}
       */
      getType: function () {
         return this._moduleName
            .split('.')
            .pop()
            .slice(0, -5);//*Field
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
       * Копирует формат поля из другого формата
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля, который надо скопировать
       */
      copyFrom: function (format) {
         $ws.core.merge(this._options, format._options);
      },

      /**
       * Сравнивает 2 формата поля на идентичность: совпадает тип, название, значение по умолчанию, признак isNullable. Для полей со словарем - словарь.
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля, с которым сравнить
       * @returns {Boolean}
       */
      isEqual: function (format) {
         if (format === this) {
            return true;
         }
         var selfProto = Object.getPrototypeOf(this),
            formatProto = Object.getPrototypeOf(format);

         return selfProto === formatProto &&
            this.getName() === format.getName() &&
            $ws.helpers.isEqualObject(this.getDefaultValue(), format.getDefaultValue()) &&
            this.isNullable() === format.isNullable();
      }

      //endregion Public methods

   });
   
   return Field;
});
