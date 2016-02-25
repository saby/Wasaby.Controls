/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Format.FieldsFactory', [
   'js!SBIS3.CONTROLS.Data.Format.StringField'
], function (StringField) {
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
       * @variant Integer Число целое
       * @variant Double Число вещественное
       * @variant String Строка
       * @variant Text Текст
       * @variant Money Деньги
       * @variant Date Дата
       * @variant DateTime Дата и время
       * @variant Time Время
       * @variant Boolean Логическое
       * @variant Hierarchy Иерархия
       * @variant Identity Идентификатор
       * @variant Enum Перечисляемое
       * @variant Flags Флаги
       * @variant Link Связь
       * @variant RecordSet Выборка
       * @variant Record Запись
       * @variant Binary Двоичное
       * @variant UUID UUID
       * @variant RpcFile Файл-RPC
       * @variant TimeInterval Временной интервал
       * @variant XML Строка в формате XML
       * @variant ArrayInteger Массив целых чисел
       * @variant ArrayDouble Массив вещественных чисел
       * @variant ArrayString Массив строк
       * @variant ArrayText Массив текста
       * @variant ArrayMoney Массив денег
       * @variant ArrayDate Массив дат
       * @variant ArrayDateTime Массив дата/время
       * @variant ArrayTime Массив время
       * @variant ArrayBoolean Массив логических
       * @variant ArrayHierarchy Массив иерархий
       * @variant ArrayIdentity Массив идентификаторов
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
         var type = ('' + declaration.type).toLowerCase();
         switch (type) {
            case 'string':
               return new StringField(declaration);
            default:
               throw new TypeError(this._moduleName + '::create(): unsupported field type "' + type + '"');
         }
      }

      //endregion Public methods

   };

   return FieldsFactory;
});
