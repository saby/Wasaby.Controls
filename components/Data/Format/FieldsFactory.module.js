/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FieldsFactory', [
   'js!SBIS3.CONTROLS.Data.Format.BooleanField',
   'js!SBIS3.CONTROLS.Data.Format.IntegerField',
   'js!SBIS3.CONTROLS.Data.Format.RealField',
   'js!SBIS3.CONTROLS.Data.Format.MoneyField',
   'js!SBIS3.CONTROLS.Data.Format.StringField',
   'js!SBIS3.CONTROLS.Data.Format.TextField',
   'js!SBIS3.CONTROLS.Data.Format.XmlField',
   'js!SBIS3.CONTROLS.Data.Format.DateTimeField',
   'js!SBIS3.CONTROLS.Data.Format.DateField',
   'js!SBIS3.CONTROLS.Data.Format.TimeField',
   'js!SBIS3.CONTROLS.Data.Format.TimeIntervalField',
   'js!SBIS3.CONTROLS.Data.Format.IdentityField',
   'js!SBIS3.CONTROLS.Data.Format.EnumField',
   'js!SBIS3.CONTROLS.Data.Format.FlagsField',
   'js!SBIS3.CONTROLS.Data.Format.RecordField',
   'js!SBIS3.CONTROLS.Data.Format.RecordSetField',
   'js!SBIS3.CONTROLS.Data.Format.BinaryField',
   'js!SBIS3.CONTROLS.Data.Format.UuidField',
   'js!SBIS3.CONTROLS.Data.Format.RpcFileField',
   'js!SBIS3.CONTROLS.Data.Format.HierarchyField',
   'js!SBIS3.CONTROLS.Data.Format.ObjectField',
   'js!SBIS3.CONTROLS.Data.Format.ArrayField'
], function (
   BooleanField,
   IntegerField,
   RealField,
   MoneyField,
   StringField,
   TextField,
   XmlField,
   DateTimeField,
   DateField,
   TimeField,
   TimeIntervalField,
   IdentityField,
   EnumField,
   FlagsField,
   RecordField,
   RecordSetField,
   BinaryField,
   UuidField,
   RpcFileField,
   HierarchyField,
   ObjectField,
   ArrayField
) {
   'use strict';

   /**
    * Фабрика полей - конструирует поля по декларативному описанию
    * @class SBIS3.CONTROLS.Data.Format.FieldsFactory
    * @public
    * @author Мальцев Алексей
    */

   var FieldsFactory = /** @lends SBIS3.CONTROLS.Data.Format.FieldsFactory.prototype */{
      /**
       * @typedef {String} FieldType
       * @variant boolean Логическое
       * @variant integer Число целое
       * @variant real Число вещественное
       * @variant money Деньги
       * @variant string Строка
       * @variant text Текст
       * @variant xml Строка в формате XML
       * @variant datetime Дата и время
       * @variant date Дата
       * @variant time Время
       * @variant timeinterval Временной интервал
       * @variant identity Идентификатор
       * @variant enum Перечисляемое
       * @variant flags Флаги
       * @variant record Запись
       * @variant model Модель
       * @variant recordset Выборка
       * @variant binary Двоичное
       * @variant uuid UUID
       * @variant rpcfile Файл-RPC
       * @variant hierarchy Иерархия
       * @variant object Объект
       * @variant array Массив
       */

      /**
       * @typedef {Object} FieldDeclaration
       * @property {String} name Имя поля
       * @property {FieldType} type Тип поля
       * @property {*} defaultValue Значение поля по умолчанию
       * @property {Boolean} nullable Значение может быть null
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Format.FieldsFactory',

      //region Public methods

      /**
       * Конструирует формат поля по декларативному описанию
       * @param {FieldDeclaration} declaration Декларативное описание
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       * @static
       */
      create: function(declaration) {
         if (Object.getPrototypeOf(declaration) !== Object.prototype) {
            throw new TypeError(this._moduleName + '::create(): declaration should be an instance of Object');
         }

         var type = ('' + declaration.type).toLowerCase();
         switch (type) {
            case 'boolean':
               return new BooleanField(declaration);
            case 'integer':
               return new IntegerField(declaration);
            case 'real':
               return new RealField(declaration);
            case 'money':
               return new MoneyField(declaration);
            case 'string':
               return new StringField(declaration);
            case 'text':
               return new TextField(declaration);
            case 'xml':
               return new XmlField(declaration);
            case 'datetime':
               return new DateTimeField(declaration);
            case 'date':
               return new DateField(declaration);
            case 'time':
               return new TimeField(declaration);
            case 'timeinterval':
               return new TimeIntervalField(declaration);
            case 'identity':
               return new IdentityField(declaration);
            case 'enum':
               return new EnumField(declaration);
            case 'flags':
               return new FlagsField(declaration);
            case 'record':
            case 'model':
               return new RecordField(declaration);
            case 'recordset':
               return new RecordSetField(declaration);
            case 'binary':
               return new BinaryField(declaration);
            case 'uuid':
               return new UuidField(declaration);
            case 'rpcfile':
               return new RpcFileField(declaration);
            case 'hierarchy':
               return new HierarchyField(declaration);
            case 'object':
               return new ObjectField(declaration);
            case 'array':
               return new ArrayField(declaration);
            default:
               throw new TypeError(this._moduleName + '::create(): unsupported field type "' + type + '"');
         }
      }

      //endregion Public methods

   };

   return FieldsFactory;
});
