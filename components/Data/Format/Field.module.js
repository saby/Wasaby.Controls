/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.Field', [
   'js!SBIS3.CONTROLS.Data.ICloneable',
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Entity.OptionsMixin',
   'js!SBIS3.CONTROLS.Data.SerializableMixin',
   'js!SBIS3.CONTROLS.Data.CloneableMixin'
], function (ICloneable, Abstract, OptionsMixin, SerializableMixin, CloneableMixin) {
   'use strict';

   /**
    * Прототип поля записи (абстрактный класс)
    * @class SBIS3.CONTROLS.Data.Format.Field
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.ICloneable
    * @mixes SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @mixes SBIS3.CONTROLS.Data.SerializableMixin
    * @mixes SBIS3.CONTROLS.Data.CloneableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Field = Abstract.extend([ICloneable, OptionsMixin, SerializableMixin, CloneableMixin], /** @lends SBIS3.CONTROLS.Data.Format.Field.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Format.Field',

      /**
       * @cfg {String} Имя поля
       * @name SBIS3.CONTROLS.Data.Format.Field#name
       * @see getName
       * @see setName
       */
      _$name: '',

      /**
       * @cfg {*} Значение поля по умолчанию
       * @name SBIS3.CONTROLS.Data.Format.Field#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: null,

      /**
       * @cfg {Boolean} Значение может быть null
       * @name SBIS3.CONTROLS.Data.Format.Field#nullable
       * @see isNullable
       * @see setNullable
       */
      _$nullable: true,

      //region SBIS3.CONTROLS.Data.SerializableMixin
      //endregion SBIS3.CONTROLS.Data.SerializableMixin

      constructor: function $Field(options) {
         Field.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

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
         return this._$name;
      },

      /**
       * Устанавливает имя поля
       * @param {String} name Имя поля
       * @see name
       * @see getName
       */
      setName: function (name) {
         this._$name = name;
      },

      /**
       * Возвращает значение поля по умолчанию
       * @returns {*}
       * @see defaultValue
       * @see setDefaultValue
       */
      getDefaultValue: function () {
         return this._$defaultValue;
      },

      /**
       * Устанавливает значение поля по умолчанию
       * @param {*} value Значение поля по умолчанию
       * @see defaultValue
       * @see getDefaultValue
       */
      setDefaultValue: function (value) {
         this._$defaultValue = value;
      },

      /**
       * Возвращает признак, что значение может быть null
       * @returns {Boolean}
       * @see name
       * @see setNullable
       */
      isNullable: function () {
         return this._$nullable;
      },

      /**
       * Устанавливает признак, что значение может быть null
       * @param {Boolean} nullable Значение может быть null
       * @see name
       * @see isNullable
       */
      setNullable: function (nullable) {
         this._$nullable = nullable;
      },

      /**
       * Копирует формат поля из другого формата
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля, который надо скопировать
       */
      copyFrom: function (format) {
         var options = this._getOptions(),
            formatOptions = format._getOptions(),
            option;
         for (option in options) {
            if (options.hasOwnProperty(option) &&
               formatOptions.hasOwnProperty(option)
            ) {
               this['_$' + option] = formatOptions[option];
            }
         }
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
