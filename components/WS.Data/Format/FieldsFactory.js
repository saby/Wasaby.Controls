/* global define */
define('js!WS.Data/Format/FieldsFactory', [
   'Core/core-instance',
   'js!WS.Data/Di',
   'js!WS.Data/Format/BooleanField',
   'js!WS.Data/Format/IntegerField',
   'js!WS.Data/Format/RealField',
   'js!WS.Data/Format/MoneyField',
   'js!WS.Data/Format/StringField',
   'js!WS.Data/Format/XmlField',
   'js!WS.Data/Format/DateTimeField',
   'js!WS.Data/Format/DateField',
   'js!WS.Data/Format/TimeField',
   'js!WS.Data/Format/TimeIntervalField',
   'js!WS.Data/Format/LinkField',
   'js!WS.Data/Format/IdentityField',
   'js!WS.Data/Format/EnumField',
   'js!WS.Data/Format/FlagsField',
   'js!WS.Data/Format/RecordField',
   'js!WS.Data/Format/RecordSetField',
   'js!WS.Data/Format/BinaryField',
   'js!WS.Data/Format/UuidField',
   'js!WS.Data/Format/RpcFileField',
   'js!WS.Data/Format/ObjectField',
   'js!WS.Data/Format/ArrayField',
   'js!WS.Data/Utils'
], function (
   CoreInstance,
   Di,
   BooleanField,
   IntegerField,
   RealField,
   MoneyField,
   StringField,
   XmlField,
   DateTimeField,
   DateField,
   TimeField,
   TimeIntervalField,
   LinkField,
   IdentityField,
   EnumField,
   FlagsField,
   RecordField,
   RecordSetField,
   BinaryField,
   UuidField,
   RpcFileField,
   ObjectField,
   ArrayField,
   Utils
) {
   'use strict';

   /**
    * Фабрика полей - конструирует поля по декларативному описанию
    * @class WS.Data/Format/FieldsFactory
    * @public
    * @author Мальцев Алексей
    */

   var FieldsFactory = /** @lends WS.Data/Format/FieldsFactory.prototype */{
      /**
       * @typedef {String} FieldType
       * @variant boolean Логическое
       * @variant integer Число целое
       * @variant real Число вещественное
       * @variant money Деньги
       * @variant string Строка
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
       * @variant object Объект
       * @variant array Массив
       */

      /**
       * @typedef {Object} FieldDeclaration
       * @property {String} name Имя поля
       * @property {FieldType|Function|String} type Тип поля (название или конструктор)
       * @property {*} defaultValue Значение поля по умолчанию
       * @property {Boolean} nullable Значение может быть null
       * @property {*} [*] Доступны любые опции, которые можно передавать в конструктор (WS.Data/Format/*Field) данного типа поля. Например опция precision для типа @{link WS.Data/Format/MoneyField money}: {name: 'amount', type: 'money', precision: 4}
       */

      _moduleName: 'WS.Data/Format/FieldsFactory',

      //region Public methods

      /**
       * Конструирует формат поля по декларативному описанию
       * @param {FieldDeclaration} declaration Декларативное описание
       * @return {WS.Data/Format/Field}
       * @static
       */
      create: function(declaration) {
         if (Object.getPrototypeOf(declaration) !== Object.prototype) {
            throw new TypeError(this._moduleName + '::create(): declaration should be an instance of Object');
         }

         var type = declaration.type;
         if (typeof type === 'string') {
            switch (type.toLowerCase()) {
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
                  Utils.logger.error(FieldsFactory._moduleName + '::create()', 'Type "text" has been removed in 3.7.5. Use "string" instead.');
                  declaration.type = 'string';
                  return new StringField(declaration);
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
               case 'link':
                  return new LinkField(declaration);
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
                  Utils.logger.error(FieldsFactory._moduleName + '::create()', 'Type "hierarchy" has been removed in 3.7.5. Use "identity" instead.');
                  declaration.type = 'identity';
                  return new IdentityField(declaration);
               case 'object':
                  return new ObjectField(declaration);
               case 'array':
                  return new ArrayField(declaration);
            }

            if (Di.isRegistered(type)) {
               type = Di.resolve(type);
            }
         }

         if (typeof type === 'function') {
            var inst = Object.create(type.prototype);
            if (CoreInstance.instanceOfModule(inst, 'WS.Data/Entity/Record')) {
               return new RecordField(declaration);
            } else if (CoreInstance.instanceOfModule(inst, 'WS.Data/Collection/RecordSet')) {
               return new RecordSetField(declaration);
            } else if (CoreInstance.instanceOfModule(inst, 'WS.Data/Types/Enum')) {
               return new EnumField(declaration);
            } else if (CoreInstance.instanceOfModule(inst, 'WS.Data/Types/Flags')) {
               return new FlagsField(declaration);
            } else if (inst instanceof Array) {
               return new ArrayField(declaration);
            } else if (inst instanceof Date) {
               return new DateField(declaration);
            } else if (inst instanceof String) {
               return new StringField(declaration);
            } else if (inst instanceof Number) {
               return new RealField(declaration);
            } else if (type === Object) {
               return new ObjectField(declaration);
            }
         }

         throw new TypeError(this._moduleName + '::create(): unsupported field type ' + (typeof type === 'function' ? type.name : '"' + type + '"'));
      }

      //endregion Public methods

   };

   return FieldsFactory;
});
