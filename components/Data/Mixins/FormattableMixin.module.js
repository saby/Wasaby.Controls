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
       * @see getRawData
       * @see setRawData
       * @remark
       * Данные должны быть в формате, поддерживаемом адаптером {@link adapter}.
       * @example
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
       * @example
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
      $rawData: null,

      /**
       * @cfg {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию {@link SBIS3.CONTROLS.Data.Adapter.Json}
       * @see getAdapter
       * @see setAdapter
       * @see SBIS3.CONTROLS.Data.Adapter.Json
       * @see SBIS3.CONTROLS.Data.Di
       * @remark
       * Адаптер должен быть предназначен для формата, в котором описаны сырые данные {@link rawData}.
       * По умолчанию обрабатываются данные в формате JSON (ключ -> значение).
       * @example
       * <pre>
       *    var user = new Record({
       *       adapter: 'adapter.sbis'
       *    });
       * </pre>
       * @example
       * <pre>
       *    var user = new Record({
       *       adapter: new SbisAdapter()
       *    });
       * </pre>
       */
      $adapter: 'adapter.json',

      /**
       * @cfg {SBIS3.CONTROLS.Data.Format.Format|Array.<SBIS3.CONTROLS.Data.Format.FieldsFactory/FieldDeclaration.typedef>} Формат полей
       * @see getFormat
       * @example
       * <pre>
       *    define('js!My.Module', [
       *       'js!My.Format.User'
       *    ], function (UserFormat) {
       *       var user = new Record({
       *          format: new UserFormat
       *       });
       *    });
       * </pre>
       * @example
       * <pre>
       *    define('js!My.Module', [
       *       'js!My.Format.User'
       *    ], function (UserFormat) {
       *       var users = new RecordSet({
       *          format: new UserFormat
       *       });
       *    });
       * </pre>
       * @example
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
       * @example
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
      $format: null,

      /**
       * @member {SBIS3.CONTROLS.Data.Adapter.ITable|SBIS3.CONTROLS.Data.Adapter.IRecord} Адаптер для cырых данных
       */
      _rawDataAdapter: null,

      /**
       * @member {Array.<String>} Описание всех полей, полученных из данных в "сыром" виде
       */
      _rawDataFields: null,

      /**
       *@member {Boolean} Формат был задан пользователем явно
       */
      _directFormat: false,

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
            if (this.$rawData && this.$rawData.$type) {
               this.$rawData._type = this.$rawData.$type;
               delete this.$rawData.$type;
            }
         };
      },

      //region Public methods

      constructor: function $FormattableMixin(cfg) {
         if(cfg && cfg.format) {
            this._directFormat = true;

            this._getFormat().each(function(fieldFormat) {
               try {
                  this._getRawDataAdapter().addField(fieldFormat);
               } catch (e) {
                  Utils.logger.info(this._moduleName + '::constructor(): can\'t add raw data field (' + e.message + ')');
               }
            }, this);
         }
      },

      /**
       * Возвращает данные в "сыром" виде
       * @returns {Object}
       * @see setRawData
       * @see rawData
       */
      getRawData: function() {
         return this.$rawData;
      },

      /**
       * Устанавливает данные в "сыром" виде
       * @param data {Object} Данные в "сыром" виде
       * @see getRawData
       * @see rawData
       */
      setRawData: function(data) {
         this.$rawData = data;
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
            typeof this.$adapter === 'string' &&
            FormattableMixin._getDefaultAdapter !== this._getDefaultAdapter
         ) {
            Utils.logger.info('SBIS3.CONTROLS.Data.FormattableMixin: method _getDefaultAdapter() is deprecated and will be removed in 3.7.4. Use \'adapter\' option instead.');
            this.$adapter = this._getDefaultAdapter();
         }
         if (typeof this.$adapter === 'string') {
            this.$adapter = Di.resolve(this.$adapter);
         }
         return this.$adapter;
      },

      /**
       * Устанавливает адаптер для работы с данными в "сыром" виде
       * @param {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter
       * @see adapter
       * @see getAdapter
       */
      setAdapter: function (adapter) {
         this.$adapter = adapter;
         this._resetRawDataAdapter();
      },

      /**
       * Возвращает формат полей (в режиме только для чтения)
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @see format
       */
      getFormat: function () {
         return this._getFormat().clone();
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
         this._getFormat().add(format, at);
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
         this._getFormat().removeField(name);
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
         this._getFormat().removeAt(at);
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
            if (this.$rawData !== this._rawDataAdapter.getData()) {
               this.$rawData = this._rawDataAdapter.getData();
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
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _getFormat: function () {
         if (
            !this.$format ||
            !$ws.helpers.instanceOfModule(this.$format, 'SBIS3.CONTROLS.Data.Format.Format')
         ) {
            this.$format = this._buildFormat(this.$format);
         }
         return this.$format;
      },

      /**
       * Очищает формат полей. Это можно сделать только если формат не был установлен явно.
       * @protected
       */
      _clearFormat: function (){
         if (this._isDirectFormat()) {
            throw new Error(this._moduleName + ': format can\'t be cleared because it\'s defined directly.');
         }
         this.$format = null;
      },

      /**
       * Возвращает признак, что формат полей был установлен явно
       * @returns {Boolean}
       * @protected
       */
      _isDirectFormat: function () {
         return this._directFormat;
      },

      /**
       * Строит формат полей по описанию
       * @param {SBIS3.CONTROLS.Data.Format.Format|Array.<SBIS3.CONTROLS.Data.Format.FieldsFactory/FieldDeclaration.typedef>} format Описание формата
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _buildFormat: function(format) {
         if (!format) {
            var fields = null;
            try {
               fields = this._getRawDataFields();
            } catch (e) {
            }
            if (fields) {
               var i;
               format = new Format();
               for (i = 0; i < fields.length; i++) {
                  format.add(this._getRawDataFormat(fields[i]));
               }
            }
         }

         if (format && Object.getPrototypeOf(format) === Array.prototype) {
            format = FormatsFactory.create(format);
         }

         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Format')) {
            format = new Format();
         }

         return format;
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
            (format && !format.$constructor)
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
