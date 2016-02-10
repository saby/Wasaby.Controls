/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.FormattableMixin', [
   'js!SBIS3.CONTROLS.Data.Format.Format',
   'js!SBIS3.CONTROLS.Data.Format.Field',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (Format, Field, Di) {
   'use strict';

   /**
    * Миксин, предоставляющий поведение владения форматом полей
    * @mixin SBIS3.CONTROLS.Data.FormattableMixin
    * @public
    * @author Мальцев Алексей
    */

   var FormattableMixin = /**@lends SBIS3.CONTROLS.Data.FormattableMixin.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {Object} Данные в "сыром" виде
             * @see getRawData
             * @see setRawData
             * @example
             * <pre>
             *    var user = new Record({
             *       rawData: {
             *          id: 1,
             *          firstName: 'John',
             *          lastName: 'Smith'
             *       }
             *    });
             *    user.get('id');//5
             *    user.get('firstName');//John
             * </pre>
             */
            rawData: null,

            /**
             * @cfg {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию {@link SBIS3.CONTROLS.Data.Adapter.Json}
             * @see getAdapter
             * @see setAdapter
             * @see SBIS3.CONTROLS.Data.Adapter.Json
             * @see SBIS3.CONTROLS.Data.Di
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
            adapter: 'adapter.json',

            /**
             * @cfg {SBIS3.CONTROLS.Data.Format.Format|Array.<SBIS3.CONTROLS.Data.Format.Field/FieldDeclaration>} Формат полей
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
             *    var users = new RecordSet({
             *       format: [{
             *          name: 'id'
             *          type: 'Integer'
             *       }, {
             *          name: 'login'
             *          type: 'String'
             *       }]
             *    });
             * </pre>
             */
            format: null
         }
      },

      //region Public methods

      /**
       * Возвращает данные в "сыром" виде
       * @returns {Object}
       * @see setRawData
       * @see rawData
       */
      getRawData: function() {
         return this._options.rawData;
      },

      /**
       * Устанавливает данные в "сыром" виде
       * @param rawData {Object} Данные в "сыром" виде
       * @see getRawData
       * @see rawData
       */
      setRawData: function(data) {
         this._options.rawData = data;
      },

      /**
       * Возвращает адаптер для работы с данными в "сыром" виде
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       * @see adapter
       * @see setAdapter
       */
      getAdapter: function () {
         if (
            typeof this._options.adapter === 'string' &&
            FormattableMixin._getDefaultAdapter !== this._getDefaultAdapter
         ) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.FormattableMixin', 'Method _getDefaultAdapter() is deprecated and will be removed in 3.7.4. Use \'adapter\' option instead.');
            this._options.adapter = this._getDefaultAdapter();
         }
         if (typeof this._options.adapter === 'string') {
            this._options.adapter = Di.resolve(this._options.adapter);
         }
         return this._options.adapter;
      },

      /**
       * Устанавливает адаптер для работы с данными в "сыром" виде
       * @param {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter
       * @see adapter
       * @see getAdapter
       */
      setAdapter: function (adapter) {
         this._options.adapter = adapter;
      },

      /**
       * Возвращает формат полей (в режиме только для чтения)
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @see format
       */
      getFormat: function () {
         return this._getFormat.clone();
      },

      /**
       * Добавляет поле в формат.
       * Если позиция не указана (или указана как -1), поле добавляется в конец формата.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.Field/FieldDeclaration} format Формат поля
       * @param {Number} [at] Позиция поля
       * @see format
       * @see removeField
       * @example
       * <pre>
       *    var record = new Record();
       *    record.addField({name: 'login', type: 'String'});
       *    record.addField({name: 'amount', type: 'Money'});
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
         this.getAdapter().addField(format, at);
         this._getFormat().add(format, at);
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
         this.getAdapter().removeField(name);
         this._getFormat().removeField(name);
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
         this.getAdapter().removeFieldAt(at);
         this._getFormat().removeAt(at);
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
       * Возвращает формат полей
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _getFormat: function () {
         if (
            !this.options.format ||
            !$ws.helpers.instanceOfModule(this.options.format, 'SBIS3.CONTROLS.Data.Format.Format')
         ) {
            this.options.format = this._buildFormat(this.options.format);
         }
         return this._options.format;
      },

      /**
       * Строит формат по описанию
       * @param {SBIS3.CONTROLS.Data.Format.Format|Array.<SBIS3.CONTROLS.Data.Format.Field/FieldDeclaration>} format Описание формата
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _buildFormat: function(format) {
         if (!format) {
            format = new Format();
         }
         if (Object.getPrototypeOf(format) === Array.prototype) {
            format = Format.fromDeclaration(format);
         }
         if (!$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Format')) {
            throw new TypeError('Format should be an instance of SBIS3.CONTROLS.Data.Format.Format');
         }
         return format;
      },

      /**
       * Строит формат поля по описанию
       * @param {SBIS3.CONTROLS.Data.Format.Field|SBIS3.CONTROLS.Data.Format.Field/FieldDeclaration} format Описание формата поля
       * @returns {SBIS3.CONTROLS.Data.Format.Field}
       * @protected
       */
      _buildField: function(format) {
         if (
            typeof format === 'string' ||
            Object.getPrototypeOf(format) === Object.prototype
         ) {
            format = Field.fromDeclaration(format);
         }
         if (!format || !$ws.helpers.instanceOfModule(format, 'SBIS3.CONTROLS.Data.Format.Field')) {
            throw new TypeError('Format should be an instance of SBIS3.CONTROLS.Data.Format.Field');
         }
         return format;
      }

      //endregion Protected methods
   };

   return FormattableMixin;
});
