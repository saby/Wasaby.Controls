/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Model', [
   'js!SBIS3.CONTROLS.Data.IPropertyAccess',
   'js!SBIS3.CONTROLS.Data.IHashable',
   'js!SBIS3.CONTROLS.Data.HashableMixin',
   'js!SBIS3.CONTROLS.Data.Adapter.Json',
   'js!SBIS3.CONTROLS.Data.Factory'
], function (IPropertyAccess, IHashable, HashableMixin, JsonAdapter) {
   'use strict';

   /**
    * Модель - обеспечивает доступ к данным
    * @class SBIS3.CONTROLS.Data.Model
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.IPropertyAccess
    * @mixes SBIS3.CONTROLS.Data.IHashable
    * @mixes SBIS3.CONTROLS.Data.HashableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Model = $ws.proto.Abstract.extend([IPropertyAccess, IHashable, HashableMixin], /** @lends SBIS3.CONTROLS.Data.Model.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Model',
      $protected: {
         _options: {
            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными
             */
            adapter: undefined,

            /**
             * @cfg {SBIS3.CONTROLS.Source.BaseSource} Источник данных
             */
            source: undefined,

            /**
             * @cfg {Object} Данные в "сыром" виде
             */
            data: {},

            /**
             * @cfg {String} Поле, содержащее первичный ключ
             */
            idProperty: ''
         },

         _hashPrefix: 'model-',

         /**
          * @var {Boolean} Признак, что модель существует в источнике данных
          */
         _isStored: false,

         /**
          * @var {Boolean} Признак, что модель удалена из источника данных
          */
         _isDeleted: false,

         /**
          * @var {Boolean} Признак, что модель изменения модели не синхронизированы с харнилищем данных
          */
         _isChanged: false,
         /**
         * @var {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с записью
         */
         _adapterForRecord: undefined,
         /**
          * @var {Object} Объект содержащий приведенные значения модели
          */
         _fieldsCache: {}
      },

      $constructor: function () {
         this.setData(this._options.data);
         this._options.idProperty = this._options.idProperty || '';
         this._initAdapter();
         this._publish('onPropertyChange');
      },

      // region public
      /**
       * Возвращает источник данных
       * @returns {SBIS3.CONTROLS.Data.Source.BaseSource}
       */
      getSource: function () {
         return this._options.source;
      },

      /**
       * Устанавливает источник данных
       * @param {SBIS3.CONTROLS.Data.Source.BaseSource} source
       */
      setSource: function (source) {
         this._options.source = source;
         this._fieldsCache = {};
      },

      /**
       * Возвращает адаптер для работы с данными
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       */
      getAdapter: function () {
         return this._adapterForRecord;
      },

      /**
       * Устанавливает адаптер для работы с данными
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter
       */
      setAdapter: function (adapter) {
         this._options.adapter = adapter;
         this._fieldsCache = {};
      },

      /**
       * Клонирует модель
       * @returns {SBIS3.CONTROLS.Data.Model}
       */
      clone: function() {
         return new Model(this._options);
      },

      /**
       * Объединяет модель с данными и состоянием другой модели
       * @param {SBIS3.CONTROLS.Data.Model} model Модель, с которой будет произведено объединение
       */
      merge: function (model) {
         //FIXME: подразумевается, что адаптеры моделей должны быть одинаковы. Сделать объединение data через адаптеры.
         $ws.core.merge(this._options.data, model._options.data);
         this._isStored = model._isStored;
         this._isChanged = model._isChanged;
         this._isDeleted = model._isDeleted;
      },

      /**
       * Загружает модель из источника данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет обновленный инстанс модели.
       */
      load: function() {
         this._checkSource();
         var self = this;
         return this._options.source.read(this.getId()).addCallback((function(instance) {
            self.setData(instance.getData());
            self._setChanged(false);
            return self;
         }).bind(this));
      },

      /**
       * Сохраняет модель в источник данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет обновленный инстанс модели.
       */
      save: function() {
         this.validate();
         this._checkSource();
         var self = this;
         return this._options.source.update(this).addCallback((function() {
            self._setChanged(false);
            return self;
         }).bind(this));
      },

      /**
       * Удаляет модель в источника данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет обновленный инстанс модели.
       */
      remove: function() {
         this._checkSource();
         var self = this;
         return this._options.source.destroy(this.getId()).addCallback((function() {
            self._fieldsCache = {};
            self._setDeleted(true);
            self.setStored(false);
            return self;
         }).bind(this));
      },

      /**
       * Запускает валидацию модели
       */
      validate: function() {
      },

      /**
       * Возвращает признак, что модель удалена
       * @returns {Boolean}
       */
      isDeleted: function () {
         return this._isDeleted;
      },

      /**
       * Возвращает признак, что модель изменена
       * @returns {Boolean}
       */
      isChanged: function () {
         return this._isChanged;
      },

      /**
       * Возвращает значение первичного ключа модели
       * @returns {*}
       */
      getId: function () {
         if (!this._options.idProperty) {
            throw new Error('Key property is not defined');
         }
         return this.get(this._options.idProperty);
      },

      /**
       * Возвращает свойство, в котором хранится первичный ключ модели
       * @returns {String}
       */
      getIdProperty: function () {
         return this._options.idProperty;
      },
      /**
       * Устанавливает свойство, в котором хранится первичный ключ модели
       * @param {String} idProperty Первичный ключ модели.
       */
      setIdProperty: function (idProperty) {
         this._options.idProperty = idProperty;
      },
      /**
       * Возвращает данные модели в "сыром" виде
       * @returns {Object}
       */
      getData: function () {
         return this._options.data;
      },

      /**
       * Устанавливает данные модели в "сыром" виде
       * @param {Object} data Данные модели
       */
      setData: function (data) {
         this._options.data = data || {};
         this._fieldsCache = {};
      },

      /**
       * Возвращает признак, что модель существует в источнике данных
       * @returns {Boolean}
       */
      isStored: function () {
         return this._isStored;
      },

      /**
       * Устанавливает, существует ли модель в источнике данных
       * @param {Boolean} stored Модель существует в источнике данных
       */
      setStored: function (stored) {
         this._isStored = stored;
      },

      /**
      * возвращает строку с данными в формате json
      * @returns {String}
      */
      toString: function() {
         return JSON.stringify(this._options.data);
      },

      // endregion public

      //region protected

      /**
       * проверяет наличие источника данных
       * @private
       */
      _checkSource: function () {
         if (!this._options.source) {
            throw new Error('Source is not defined');
         }
      },

      /**
       *
       * инифиализация адаптера
       * @private
       */
      _initAdapter: function() {
         if (this._options.adapter) {
            this._adapterForRecord = this._options.adapter.forRecord();
            return;
         }
         if (this._options.source && this._options.source.getAdapter()) {
            var adapter = this._options.source.getAdapter();
            this._options.adapter = adapter;
            this._adapterForRecord = adapter.forRecord();
            return;
         }
         this._options.adapter = new JsonAdapter();
         this._adapterForRecord = new JsonAdapter().forRecord();
      },

      /**
       * Устанавливает, удалена ли модель
       * @param {Boolean} deleted Модель удалена
       * @private
       */
      _setDeleted: function (deleted) {
         this._isDeleted = deleted;
      },

      /**
       * Устанавливает изменена ли модель
       * @param {Boolean} changed Модель изменена
       * @returns {Boolean}
       */
      _setChanged: function (changed) {
         this._isChanged = changed;
      },

      //endregion protected

      // region SBIS3.CONTROLS.Data.IPropertyAccess
      /**
       * Возвращает значение свойства
       * @param {String} name Название свойства
       * @returns {*}
       */
      get: function (name) {
         if (this._fieldsCache.hasOwnProperty(name)) {
            return this._fieldsCache[name];
         }

         var adapter = this.getAdapter(),
            dataValue = adapter.get(this._options.data, name),
            data = adapter.getFullFieldData(this._options.data, name),
            value = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Factory').cast(
               dataValue,
               data.type,
               this._options.adapter,//в фабрику нужно передавать полный адаптер
               data.meta
            );
         this._fieldsCache[name] =  value;
         return value;
      },

      /**
       * Устанавливает значение свойства
       * @param {String} name Название свойства
       * @param {*} value Значение свойства
       */
      set: function (name, value) {
         if (!name) {
            $ws.single.ioc.resolve('ILogger').error('SBIS3.CONTROLS.Data.Model::set()', 'Property name is empty');
         }
         if (this.get(name) !== value) {
            this.getAdapter().set(this._options.data, name, value);
            this._setChanged(true);
            delete this._fieldsCache[name];
            this._notify('onPropertyChange', name, value);
         }
      }
      // endregion SBIS3.CONTROLS.Data.IPropertyAccess
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Model', function(config) {
      return new Model(config);
   });
   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.ModelConstructor', function() {
      return Model;
   });

   return Model;
});
