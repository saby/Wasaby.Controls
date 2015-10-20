/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Base', [
   'js!SBIS3.CONTROLS.Data.Source.ISource',
   'js!SBIS3.CONTROLS.Data.Model'
], function (ISource, Model) {
   'use strict';

   /**
    * Базовый источник данных
    * @class SBIS3.CONTROLS.Data.Source.Base
    * @mixes SBIS3.CONTROLS.Data.Source.ISource
    * @public
    * @author Мальцев Алексей
    */

   return $ws.core.extend({}, [ISource], /** @lends SBIS3.CONTROLS.Data.Source.Base.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.Base',
      $constructor: function (cfg) {
         this._options.model = 'model' in cfg ? cfg.model : Model;
      },

      after: {
         $constructor: function () {
            if (!this._options.adapter) {
               throw new Error('Data adapter is undefined');
            }
            if (!this._options.idProperty) {
               throw new Error('Model id property is undefined');
            }
         }
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      getAdapter: function () {
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

      getIdProperty: function () {
         return this._options.idProperty;
      },

      setIdProperty: function (name) {
         this._options.idProperty = name;
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Protected methods

      /**
       * Создает новый экзепляр модели
       * @param {*} model Данные модели
       * @returns {SBIS3.CONTROLS.Data.Model}
       * @private
       */
      _getModelInstance: function (data) {
         return new this._options.model({
            data: data,
            source: this,
            idProperty: this._options.idProperty
         });
      },

      /**
       * Перебирает все записи выборки
       * @param {*} data Выборка
       * @param {Function} callback Ф-я обратного вызова для каждой записи
       * @param {Object} context Конекст
       * @private
       */
      _each: function (data, callback, context) {
         var tableAdapter = this._options.adapter.forTable(),
            index,
            count;

         for (index = 0, count = tableAdapter.getCount(data); index < count; index++) {
            callback.call(context || this, tableAdapter.at(data, index), index);
         }
      }

      //endregion Protected methods

   });
});
