/* global define */
define('js!WS.Data/Format/Field', [
   'js!WS.Data/Entity/ICloneable',
   'js!WS.Data/Entity/IEquatable',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Entity/CloneableMixin',
   'Core/helpers/collection-helpers'
], function (
   ICloneable,
   IEquatable,
   Abstract,
   OptionsMixin,
   SerializableMixin,
   CloneableMixin,
   CollectionHelpers
) {
   'use strict';

   /**
    * Прототип поля записи.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Format/Field
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Entity/ICloneable
    * @implements WS.Data/Entity/IEquatable
    * @mixes WS.Data/Entity/OptionsMixin
    * @mixes WS.Data/Entity/SerializableMixin
    * @mixes WS.Data/Entity/CloneableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Field = Abstract.extend([ICloneable, IEquatable, OptionsMixin, SerializableMixin, CloneableMixin], /** @lends WS.Data/Format/Field.prototype */{
      _moduleName: 'WS.Data/Format/Field',

      /**
       * @cfg {String} Имя поля
       * @name WS.Data/Format/Field#name
       * @see getName
       * @see setName
       */
      _$name: '',

      /**
       * @cfg {String|Function} Модуль, который является конструктором значения поля
       * @name WS.Data/Format/Field#type
       * @see getType
       * @see WS.Data/Di
       */
      _$type: null,

      /**
       * @cfg {*} Значение поля по умолчанию
       * @name WS.Data/Format/Field#defaultValue
       * @see getDefaultValue
       * @see setDefaultValue
       */
      _$defaultValue: null,

      /**
       * @cfg {Boolean} Значение может быть null
       * @name WS.Data/Format/Field#nullable
       * @see isNullable
       * @see setNullable
       */
      _$nullable: true,

      constructor: function $Field(options) {
         Field.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      //region WS.Data/Entity/IEquatable

      /**
       * Сравнивает 2 формата поля на идентичность: совпадает тип, название, значение по умолчанию, признак isNullable. Для полей со словарем - словарь.
       * @param {WS.Data/Format/Field} to Формат поля, с которым сравнить
       * @return {Boolean}
       */
      isEqual: function (to) {
         if (to === this) {
            return true;
         }
         var selfProto = Object.getPrototypeOf(this),
            toProto = Object.getPrototypeOf(to);

         return selfProto === toProto &&
            this.getName() === to.getName() &&
            CollectionHelpers.isEqualObject(this.getDefaultValue(), to.getDefaultValue()) &&
            this.isNullable() === to.isNullable();
      },

      //endregion WS.Data/Entity/IEquatable

      //region Public methods

      /**
       * Возвращает тип поля
       * @return {String}
       */
      getType: function () {
         return this._$type || this._moduleName
            .split('/')
            .pop()
            .slice(0, -5);//*Field
      },

      /**
       * Возвращает имя поля
       * @return {String}
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
       * @return {*}
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
       * @return {Boolean}
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
       * @param {WS.Data/Format/Field} format Формат поля, который надо скопировать
       */
      copyFrom: function (format) {
         var formatOptions = format._getOptions(),
            key,
            option;
         for (option in formatOptions) {
            if (formatOptions.hasOwnProperty(option)) {
               key = '_$' + option;
               if (key in this) {
                  this[key] = formatOptions[option];
               }
            }
         }
      }

      //endregion Public methods

   });
   
   return Field;
});
