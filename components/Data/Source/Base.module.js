/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Base', [
   'js!SBIS3.CONTROLS.Data.Source.ISource',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Adapter.Json'
], function (ISource, DataSet, JsonAdapter) {
   'use strict';

   /**
    * Базовый источник данных
    * @class SBIS3.CONTROLS.Data.Source.Base
    * @extends $ws.proto.Abstract
    * @mixes SBIS3.CONTROLS.Data.Source.ISource
    * @public
    * @author Мальцев Алексей
    */

   return $ws.proto.Abstract.extend([ISource], /** @lends SBIS3.CONTROLS.Data.Source.Base.prototype */{
      /**
       * @event onDataSync При изменении синхронизации данных с источником
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param (SBIS3.CONTROLS.Data.Model[]) records Измененные записи
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Source.Base',

      $constructor: function () {
         this._publish('onDataSync');
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      getResource: function () {
         return this._options.resource;
      },

      getAdapter: function () {
         return this._options.adapter || (this._options.adapter = new JsonAdapter());
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
       * Определяет название свойства с первичным ключем, если оно не было задано
       * @param {*} data Сырые данные
       * @private
       */
      _detectIdProperty: function(data) {
         if (!this._options.idProperty) {
            this._options.idProperty = this.getAdapter().forRecord(data).getKeyField();
         }
      },

      /**
       * Создает новый экзепляр модели
       * @param {*} model Данные модели
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @private
       */
      _getModelInstance: function (data) {
         this._detectIdProperty(data);

         return new this._options.model({
            rawData: data,
            adapter: this.getAdapter(),
            idProperty: this.getIdProperty()
         });
      },

      /**
       * Создает новый экзепляр dataSet
       * @param {Object} cfg Опции конструктора
       * @returns {SBIS3.CONTROLS.Data.Source.DataSet}
       * @private
       */
      _getDataSetInstance: function (cfg) {
         return new DataSet($ws.core.merge({
            source: this,
            adapter: this.getAdapter(),
            model: this.getModel(),
            listModule: this.getListModule(),
            idProperty: this.getIdProperty()
         }, cfg, {
            rec: false
         }));
      },

      /**
       * Перебирает все записи выборки
       * @param {*} data Выборка
       * @param {Function} callback Ф-я обратного вызова для каждой записи
       * @param {Object} context Конекст
       * @private
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
         $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.Base', 'method sync() is deprecated and will be removed in 3.8.0. Use SBIS3.CONTROLS.Data.Model::sync() instead.');

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
});
