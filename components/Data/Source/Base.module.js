/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Base', [
   'js!SBIS3.CONTROLS.Data.Source.ISource',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Model',
   'js!SBIS3.CONTROLS.Data.Collection.RecordSet',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (ISource, DataSet, Di, Utils) {
   'use strict';

   /**
    * Базовый источник данных
    * @class SBIS3.CONTROLS.Data.Source.Base
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.Source.ISource
    * @public
    * @author Мальцев Алексей
    */

   var Base = $ws.proto.Abstract.extend([ISource], /** @lends SBIS3.CONTROLS.Data.Source.Base.prototype */{
      /**
       * @event onDataSync При изменении синхронизации данных с источником
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param (Array.<SBIS3.CONTROLS.Data.Model>) records Измененные записи
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Source.Base',

      $constructor: function (cfg) {
         this._publish('onDataSync');

         cfg = cfg || {};
         //Deprecated
         if ('resource' in cfg && !('endpoint' in cfg)) {
            Utils.logger.stack(this._moduleName + '::$constructor(): option "resource" is deprecated and will be removed in 3.7.4. Use "endpoint.contract" instead.', 3);
            this._options.endpoint.contract = cfg.resource;
         }

         //Shortcut support
         if (typeof this._options.endpoint === 'string') {
            this._options.endpoint = {
               contract: this._options.endpoint
            };
         }
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      getEndpoint: function () {
         return this._options.endpoint;
      },

      getBinding: function () {
         return this._options.binding;
      },

      setBinding: function (binding) {
         this._options.binding = binding;
      },

      /**
       * Возвращает ресурс, с которым работает источник
       * @deprecated Метод будет удален в 3.7.4, используйте getEndpoint().contract
       * @returns {String}
       */
      getResource: function () {
         Utils.logger.stack(this._moduleName + '::getResource(): method is deprecated and will be removed in 3.7.4. Use "getEndpoint().contract" instead.');
         return this._options.endpoint.contract || '';
      },

      getAdapter: function () {
         if (typeof this._options.adapter === 'string') {
            this._options.adapter = Di.resolve(this._options.adapter);
         }
         return this._options.adapter;
      },

      setAdapter: function (adapter) {
         this._options.adapter = adapter;
      },

      getModel: function () {
         return this._options.model;
      },

      setModel: function (model) {
         this._options.model = model;
      },

      getListModule: function () {
         return this._options.listModule;
      },

      setListModule: function (listModule) {
         this._options.listModule = listModule;
      },

      getIdProperty: function () {
         return this._options.idProperty;
      },

      setIdProperty: function (name) {
         this._options.idProperty = name;
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Protected methods

      /**
       * Определяет название свойства с первичным ключем по данным
       * @param {*} data Сырые данные
       * @returns {String}
       * @protected
       */
      _getIdPropertyByData: function(data) {
         return this.getAdapter().getKeyField(data) || '';
      },

      /**
       * Создает новый экземпляр модели
       * @param {*} model Данные модели
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @protected
       */
      _getModelInstance: function (data) {
         return Di.resolve(this._options.model, {
            rawData: data,
            adapter: this.getAdapter(),
            idProperty: this.getIdProperty()
         });
      },

      /**
       * Создает новый экземпляр списка
       * @param {*} model Данные списка
       * @returns {SBIS3.CONTROLS.Data.Collection.List}
       * @protected
       */
      _getListInstance: function (data) {
         return Di.resolve(this._options.listModule, {
            rawData: data,
            adapter: this.getAdapter(),
            idProperty: this.getIdProperty()
         });
      },

      /**
       * Создает новый экземпляр dataSet
       * @param {Object} cfg Опции конструктора
       * @returns {SBIS3.CONTROLS.Data.Source.DataSet}
       * @protected
       */
      _getDataSetInstance: function (cfg) {
         return new DataSet($ws.core.merge({
            source: this,
            adapter: this.getAdapter(),
            model: this.getModel(),
            listModule: this.getListModule(),
            idProperty: this.getIdProperty() || this._getIdPropertyByData(cfg.rawData || null)
         }, cfg, {
            rec: false
         }));
      },

      /**
       * Перебирает все записи выборки
       * @param {*} data Выборка
       * @param {Function} callback Ф-я обратного вызова для каждой записи
       * @param {Object} context Конекст
       * @protected
       */
      _each: function (data, callback, context) {
         var tableAdapter = this.getAdapter().forTable(data),
            index,
            count;

         for (index = 0, count = tableAdapter.getCount(); index < count; index++) {
            callback.call(context || this, tableAdapter.at(index), index);
         }
      },

      //endregion Protected methods

      //TODO: совместимость с API SBIS3.CONTROLS.BaseSource - выпилить после перехода на ISource
      //region SBIS3.CONTROLS.BaseSource

      sync: function (data) {
         //Utils.logger.stack('SBIS3.CONTROLS.Data.Source.Base: method sync() is deprecated and will be removed in 3.7.4. Use SBIS3.CONTROLS.Data.Model::sync() instead.');

         var result;
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Model')) {
            result = data.sync();
         } else if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            result = data.saveChanges(this);
         } else {
            throw new Error('Invalid argument');
         }

         result.addCallback((function() {
            this._notify('onDataSync');
         }).bind(this));

         return result;
      }

      //endregion SBIS3.CONTROLS.BaseSource

   });

   return Base;
});
