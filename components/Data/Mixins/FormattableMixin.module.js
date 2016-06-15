/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.FormattableMixin', [
   'js!SBIS3.CONTROLS.Data.Format.Format',
   'js!SBIS3.CONTROLS.Data.Format.FormatsFactory',
   'js!SBIS3.CONTROLS.Data.Format.FieldsFactory',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (
   Format,
   FormatsFactory,
   FieldsFactory,
   Di,
   Utils
) {
   'use strict';

   /**
    * Миксин, предоставляющий поведение владения форматом полей
    * @mixin SBIS3.CONTROLS.Data.FormattableMixin
    * @public
    * @ignoreMethods notifyFormatChanged
    * @author Мальцев Алексей
    */

   var FormattableMixin = /**@lends SBIS3.CONTROLS.Data.FormattableMixin.prototype */{
      /**
       * @cfg {Object} Данные в "сыром" виде
       * @name SBIS3.CONTROLS.Data.FormattableMixin#rawData
       * @see getRawData
       * @see setRawData
       * @remark
       * Данные должны быть в формате, поддерживаемом адаптером {@link adapter}.
       * @example
       * Создадим новую запись сотрудника:
       * <pre>
       *    var user = new Record({
       *       rawData: {
       *          id: 1,
       *          firstName: 'John',
       *          lastName: 'Smith'
       *       }
       *    });
       *    user.get('id');//1
       *    user.get('firstName');//John
       *    user.get('lastName');//Smith
       * </pre>
       * Создадим рекордсет с персонажами фильма:
       * <pre>
       *    var characters = new RecordSet({
       *       rawData: [{
       *          id: 1,
       *          firstName: 'John',
       *          lastName: 'Connor',
       *          role: 'Savior'
       *       }, {
       *          id: 2,
       *          firstName: 'Sarah',
       *          lastName: 'Connor'
       *          role: 'Mother'
       *       }, {
       *          id: 3,
       *          firstName: '-',
       *          lastName: 'T-800'
       *          role: 'Terminator'
       *       }]
       *    });
       *    characters.at(0).get('firstName');//John
       *    characters.at(0).get('lastName');//Connor
       *    characters.at(1).get('firstName');//Sarah
       *    characters.at(1).get('lastName');//Connor
       * </pre>
       */
      _$rawData: null,

      /**
       * @cfg {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию {@link SBIS3.CONTROLS.Data.Adapter.Json}
       * @name SBIS3.CONTROLS.Data.FormattableMixin#adapter
       * @see getAdapter
       * @see setAdapter
       * @see SBIS3.CONTROLS.Data.Adapter.Json
       * @see SBIS3.CONTROLS.Data.Di
       * @remark
       * Адаптер должен быть предназначен для формата, в котором описаны сырые данные {@link rawData}.
       * По умолчанию обрабатываются данные в формате JSON (ключ -> значение).
       * @example
       * Создадим запись с адаптером для данных в формате БЛ СБИС, внедренным в виде названия зарегистрированной зависимости:
       * <pre>
       *    var user = new Record({
       *       adapter: 'adapter.sbis'
       *    });
       * </pre>
       * Создадим запись с адаптером для данных в формате БЛ СБИС, внедренным в виде готового экземпляра:
       * <pre>
       *    var user = new Record({
       *       adapter: new SbisAdapter()
       *    });
       * </pre>
       */
      _$adapter: 'adapter.json',

      /**
       * @cfg {SBIS3.CONTROLS.Data.Format.Format|Array.<SBIS3.CONTROLS.Data.Format.FieldsFactory/FieldDeclaration.typedef>} Формат полей
       * @name SBIS3.CONTROLS.Data.FormattableMixin#format
       * @see getFormat
       * @example
       * Создадим запись с форматом полей, внедренным в виде готового экземпляра:
       * <pre>
       *    define('js!My.Module', [
       *       'js!My.Format.User'
       *    ], function (UserFormat) {
       *       var user = new Record({
       *          format: new UserFormat
       *       });
       *    });
       * </pre>
       * Создадим рекордсет с форматом полей, внедренным в виде готового экземпляра:
       * <pre>
       *    define('js!My.Module', [
       *       'js!My.Format.User'
       *    ], function (UserFormat) {
       *       var users = new RecordSet({
       *          format: new UserFormat
       *       });
       *    });
       * </pre>
       * Создадим запись с форматом полей, внедренным в декларативном виде:
       * <pre>
       *    var user = new Record({
       *       format: [{
       *          name: 'id'
       *          type: 'integer'
       *       }, {
       *          name: 'login'
       *          type: 'string'
       *       }]
       *    });
       * </pre>
       * Создадим рекордсет с форматом полей, внедренным в декларативном виде:
       * <pre>
       *    var users = new RecordSet({
       *       format: [{
       *          name: 'id'
       *          type: 'integer'
       *       }, {
       *          name: 'login'
       *          type: 'string'
       *       }]
       *    });
       * </pre>
       */
      _$format: null,

      /**
       * @member {SBIS3.CONTROLS.Data.Format.Format} Формат полей (собранный из опции или в результате манипуляций)
       */
      _format: null,

      /**
       * @member {SBIS3.CONTROLS.Data.Adapter.ITable|SBIS3.CONTROLS.Data.Adapter.IRecord} Адаптер для cырых данных
       */
      _rawDataAdapter: null,

      /**
       * @member {Array.<String>} Описание всех полей, полученных из данных в "сыром" виде
       */
      _rawDataFields: null,

      constructor: function $FormattableMixin(options) {
         //FIXME: поддержка старого extend
         if (!this._$format && this._options && this._options.format) {
            this._$format = this._options.format;
         }

         if (this._$format) {
            var adapter = this._getRawDataAdapter(),
               fields = adapter.getFields();
               this._getFormat(true).each(function(fieldFormat) {
                  try {
                     if (Array.indexOf(fields, fieldFormat.getName()) === -1) {
                        adapter.addField(fieldFormat);
                     }
                  } catch (e) {
                     Utils.logger.info(this._moduleName + '::constructor(): can\'t add raw data field (' + e.message + ')');
                  }
               }, this);
         }
      },

      //region SBIS3.CONTROLS.Data.SerializableMixin

      _getSerializableState: function(state) {
         //Prevent core reviver for rawData
         if (state.$options.rawData && state.$options.rawData._type) {
            state.$options.rawData.$type = state.$options.rawData._type;
            delete state.$options.rawData._type;
         }

         return state;
      },

      _setSerializableState: function(state) {
         //Restore value hidden from core reviver
         return function() {
            if (this._$rawData && this._$rawData.$type) {
               this._$rawData._type = this._$rawData.$type;
               delete this._$rawData.$type;
            }
         };
      },

      //endregion SBIS3.CONTROLS.Data.SerializableMixin

      //region Public methods

      /**
       * Возвращает данные в "сыром" виде
       * @returns {Object}
       * @see setRawData
       * @see rawData
       */
      getRawData: function() {
         return this._$rawData;
      },

      /**
       * Устанавливает данные в "сыром" виде
       * @param data {Object} Данные в "сыром" виде
       * @see getRawData
       * @see rawData
       */
      setRawData: function(data) {
         this._$rawData = data;
         this._resetRawDataAdapter();
         this._resetRawDataFields();
      },

      /**
       * Возвращает адаптер для работы с данными в "сыром" виде
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @see adapter
       * @see setAdapter
       */
      getAdapter: function () {
         if (
            !(this._$adapter instanceof Object) &&
            FormattableMixin._getDefaultAdapter !== this._getDefaultAdapter
         ) {
            Utils.logger.info('SBIS3.CONTROLS.Data.FormattableMixin: method _getDefaultAdapter() is deprecated and will be removed in 3.7.4. Use \'adapter\' option instead.');
            this._$adapter = this._getDefaultAdapter();
         }

         if (this._$adapter && !(this._$adapter instanceof Object)) {
            this._$adapter = Di.resolve(this._$adapter);
         }
         return this._$adapter;
      },

      /**
       * Устанавливает адаптер для работы с данными в "сыром" виде
       * @param {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter
       * @see adapter
       * @see rawData
       * @see getAdapter
       */
      setAdapter: function (adapter) {
         this._$adapter = adapter;
         this._resetRawDataAdapter();
      },

      /**
       * Возвращает формат полей (в режиме только для чтения)
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @see format
       */
      getFormat: function () {
         return this._getFormat(true).clone();
      },

      /**
       * Добавляет поле в формат.
       * Если позиция не указана (или указана как -1), поле добавляется в конец формата.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.FieldsFactory/FieldDeclaration.typedef} format Формат поля
       * @param {Number} [at] Позиция поля
       * @see format
       * @see removeField
       * @example
       * <pre>
       *    var record = new Record();
       *    record.addField({name: 'login', type: 'string'});
       *    record.addField({name: 'amount', type: 'money'});
       * </pre>
       * @example
       * <pre>
       *    var recordset = new RecordSet();
       *    recordset.addField(new StringField({name: 'login'}));
       *    recordset.addField(new MoneyField({name: 'amount'}));
       * </pre>
       */
      addField: function(format, at) {
         format = this._buildField(format);
         this._getFormat(true).add(format, at);
         this._getRawDataAdapter().addField(format, at);
         this._resetRawDataFields();
      },

      /**
       * Удаляет поле из формата по имени.
       * Если поля с таким именем нет, генерирует исключение.
       * @param {String} name Имя поля
       * @see format
       * @see addField
       * @see removeFieldAt
       * @example
       * <pre>
       *    record.removeField('login');
       * </pre>
       */
      removeField: function(name) {
         this._getFormat(true).removeField(name);
         this._getRawDataAdapter().removeField(name);
         this._resetRawDataFields();
      },

      /**
       * Удаляет поле из формата по позиции.
       * Если позиция выходит за рамки допустимого индекса, генерирует исключение.
       * @param {Number} at Позиция поля
       * @see format
       * @see addField
       * @see removeField
       * @example
       * <pre>
       *    record.removeFieldAt(0);
       * </pre>
       */
      removeFieldAt: function(at) {
         this._getFormat(true).removeAt(at);
         this._getRawDataAdapter().removeFieldAt(at);
         this._resetRawDataFields();
      },
      
      /**
       * Уведомляет об изменении формата при композиции/агрегации инстансов общим владельцем
       * @param {String} methodName Имя метода, модифицировавшего формат
       * @param {Array} args Аргументы метода, модифицировавшего формат
       */
      notifyFormatChanged: function (methodName, args) {
         this._resetRawDataAdapter();
         this._resetRawDataFields();
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает адаптер по-умолчанию
       * @protected
       * @deprecated Метод _getDefaultAdapter() не рекомендуется к использованию и будет удален в 3.7.4. Используйте опцию adapter.
       */
      _getDefaultAdapter: function() {
         return 'adapter.json';
      },

      /**
       * Возвращает адаптер для сырых данных
       * @returns {SBIS3.CONTROLS.Data.Adapter.ITable|SBIS3.CONTROLS.Data.Adapter.IRecord}
       * @protected
       */
      _getRawDataAdapter: function () {
         if (!this._rawDataAdapter) {
            this._rawDataAdapter = this._createRawDataAdapter();
            if (this._$rawData !== this._rawDataAdapter.getData()) {
               this._$rawData = this._rawDataAdapter.getData();
            }
         }

         return this._rawDataAdapter;
      },

      /**
       * Создает адаптер для сырых данных
       * @returns {SBIS3.CONTROLS.Data.Adapter.ITable|SBIS3.CONTROLS.Data.Adapter.IRecord}
       * @protected
       */
      _createRawDataAdapter: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Сбрасывает адаптер для сырых данных
       * @protected
       */
      _resetRawDataAdapter: function () {
         this._rawDataAdapter = null;
      },

      /**
       * Возвращает список полей записи, полученный из "сырых" данных
       * @returns {Array.<String>}
       * @protected
       */
      _getRawDataFields: function() {
         return this._rawDataFields || (this._rawDataFields = this._getRawDataAdapter().getFields());
      },
      
      /**
       * Сбрасывает список полей записи, полученный из "сырых" данных
       * @protected
       */
      _resetRawDataFields: function() {
         this._rawDataFields = null;
      },

      /**
       * Возвращает формат поля из адаптера сырых данных
       * @param {String} name Имя поля
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       * @protected
       */
      _getRawDataFormat: function(name) {
         return this._getRawDataAdapter().getFormat(name);
      },

      /**
       * Возвращает формат полей
       * @param {Boolean} [build=false] Принудительно создать, если не задан
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _getFormat: function (build) {
         if (!this._format && this._$format) {
            this._format = this._buildFormat(this._$format);
         }
         if (build && !this._format) {
            this._format = this._buildFormatByRawData();
         }

         return this._format;
      },

      /**
       * Очищает формат полей. Это можно сделать только если формат не был установлен явно.
       * @protected
       */
      _clearFormat: function (){
         if (this._hasFormat()) {
            throw new Error(this._moduleName + ': format can\'t be cleared because it\'s defined directly.');
         }
         this._format = null;
      },

      /**
       * Возвращает признак, что формат полей был установлен явно
       * @returns {Boolean}
       * @protected
       */
      _hasFormat: function () {
         return !!this._format;
      },

      /**
       * Строит формат полей по описанию
       * @param {SBIS3.CONTROLS.Data.Format.Format|Array.<SBIS3.CONTROLS.Data.Format.FieldsFactory/FieldDeclaration.typedef>} format Описание формата
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _buildFormat: function(format) {
         if (format && Object.getPrototypeOf(format) === Array.prototype) {
            format = FormatsFactory.create(format);
         }

         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Format')) {
            format = new Format();
         }

         return format;
      },

      /**
       * Строит формат полей сырым данным
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _buildFormatByRawData: function() {
         var format = new Format(),
            fields = this._getRawDataFields();
         if (fields && fields.length) {
            var i;
            for (i = 0; i < fields.length; i++) {
               format.add(this._getRawDataFormat(fields[i]));
            }
         }
         return format;
      },

      /**
       * Возвращает признак, что другой объект имеет такой же формат полей
       * @param {SBIS3.CONTROLS.Data.FormattableMixin} some
       * @returns {Boolean}
       * @protected
       */
      _hasEqualFormat: function (some) {
         var format = this._getFormat(),
            someFormat = some._getFormat();
         return format ? format.isEqual(someFormat) : format === someFormat;
      },

      /**
       * Возвращает формат поля с указанным названием
       * @param {String} name Название поля
       * @return {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.UniversalField}
       * @protected
       */
      _getFieldFormat: function(name) {
         if (this._$format) {
            var fields = this._getFormat(true);
            var index = fields.getFieldIndex(name);
            if (index > -1) {
               return fields.at(index);
            }
            throw new ReferenceError(this._moduleName + ': field "' + name + '" is not defined in the format');
         }

         return this._getRawDataAdapter().getSharedFormat(name);
      },

      /**
       * Строит формат поля по описанию
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.FieldsFactory/FieldDeclaration.typedef} format Описание формата поля
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       * @protected
       */
      _buildField: function(format) {
         if (
            typeof format === 'string' ||
            Object.getPrototypeOf(format) === Object.prototype
         ) {
            format = FieldsFactory.create(format);
         }
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError(this._moduleName + ': format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         return format;
      }

      //endregion Protected methods
   };

   return FormattableMixin;
});
