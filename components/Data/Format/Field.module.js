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

      _moduleName: 'SBIS3.CONTROLS.Data.Format.Field',
      $protected: {
         _options: {
            /**
             * @cfg {*} Значение поля по умолчанию
             * @see getDefaultValue
             * @see setDefaultValue
             */
            defaultValue: undefined,

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
            nullable: false,

            /**
             * @cfg {Boolean} Поле является первичным ключом
             * @see isPrimaryKey
             * @see setPrimaryKey
             */
            primaryKey: false,

            /**
             * @cfg {Boolean} Запрещено изменять значение поля после создания записи
             * @see isReadOnly
             * @see setReadOnly
             */
            readOnly: false,

            /**
             * @cfg {FieldType} Тип поля
             * @see getType
             * @see setType
             */
            type: ''
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
       * Возвращает признак, что поле является первичным ключом
       * @returns {Boolean}
       * @see primaryKey
       * @see setPrimaryKey
       */
      isPrimaryKey: function () {
         return this._options.primaryKey;
      },

      /**
       * Устанавливает признак, что поле является первичным ключом
       * @param {Boolean} primaryKey Поле является первичным ключом
       * @see primaryKey
       * @see isPrimaryKey
       */
      setPrimaryKey: function (primaryKey) {
         this._options.primaryKey = primaryKey;
      },

      /**
       * Возвращает признак, что Запрещено изменять значение поля после создания записи
       * @returns {Boolean}
       * @see readOnly
       * @see setReadOnly
       */
      isReadOnly: function () {
         return this._options.readOnly;
      },

      /**
       * Устанавливает признак, что запрещено изменять значение поля после создания записи
       * @param {Boolean} readOnly Запрещено изменять значение поля после создания записи
       * @see readOnly
       * @see isReadOnly
       */
      setReadOnly: function (readOnly) {
         this._options.readOnly = readOnly;
      },

      /**
       * Возвращает тип поля
       * @returns {Boolean}
       * @see type
       * @see setType
       */
      getType: function () {
         return this._options.type;
      },

      /**
       * Устанавливает Тип поля
       * @param {Boolean} type Тип поля
       * @see type
       * @see getType
       */
      setType: function (type) {
         this._options.type = type;
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

   /**
    * Конструирует формат поля по декларативному описанию
    * @param {FieldDeclaration|FieldType} declaration Декларативное описание
    * @returns {SBIS3.CONTROLS.Data.Format.Field}
    * @static
    */
   Field.fromDeclaration = function(declaration) {
      throw new Error('Under construction');
   };

   return Field;
});
