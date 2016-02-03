/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.FormattableMixin', [
   'js!SBIS3.CONTROLS.Data.Format.Format',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (Format, Di) {
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
             * @cfg {SBIS3.CONTROLS.Data.Format.Format|Object} Формат полей
             * @see getFormat
             * @example
             * <pre>
             *    var user = new Record({
             *       format: new UserFormat
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
         if (!this._options.adapter) {
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
       * @param {SBIS3.CONTROLS.Data.Format.Field} format Формат поля
       * @param {Number} [at] Позиция поля
       * @see format
       * @see removeField
       */
      addField: function(format, at) {
         this._getFormat().add(format, at);
         this.getAdapter().addField(format, at);
      },

      /**
       * Удаляет поле из формата по имени.
       * Если поля с таким именем нет, генерирует исключение.
       * @param {String} name Имя поля
       * @see format
       * @see addField
       * @see removeFieldAt
       */
      removeField: function(name) {
         this.removeFieldAt(
            this._getFormat().getFieldndex(name)
         );
      },

      /**
       * Удаляет поле из формата по позиции.
       * Если позиция выходит за рамки допустимого индекса, генерирует исключение.
       * @param {Number} at Позиция поля
       * @see format
       * @see addField
       * @see removeField
       */
      removeFieldAt: function(at) {
         this._getFormat().removeAt(at);
         this.getAdapter().removeFieldAt(at);
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает адаптер по-умолчанию (можно переопределять в наследниках)
       * @protected
       * @deprecated Метод _getDefaultAdapter() не рекомендуется к использованию и будет удален в 3.7.4. Используйте опцию adapter.
       */
      _getDefaultAdapter: function() {
         if (FormattableMixin._getDefaultAdapter !== this._getDefaultAdapter) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Record', 'Method _getDefaultAdapter() is deprecated and will be removed in 3.7.4. Use \'adapter\' option instead.');
         }
         return 'adapter.json';
      },

      /**
       * Возвращает формат полей
       * @returns {SBIS3.CONTROLS.Data.Format.Format}
       * @protected
       */
      _getFormat: function () {
         this._buildFormat();
         return this._options.format;
      },

      /**
       * Строит формат (если еще не был построен)
       * @protected
       */
      _buildFormat: function() {
         if (!this.options.format) {
            this.options.format = new Format();
         }
         if (Object.getPrototypeOf(this.options.format) === Object.prototype) {
            this.options.format = Format.fromDeclaration(this.options.format);
         }
         if (!$ws.helpers.instanceOfModule(this.options.format, 'SBIS3.CONTROLS.Data.Format.Format')) {
            throw new TypeError('Format should be instance of SBIS3.CONTROLS.Data.Format.Format');
         }
      }

      //endregion Protected methods
   };

   return FormattableMixin;
});
