/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.DataStrategyArray',
   'js!SBIS3.CONTROLS.DataStrategyBL'
], function (DataStrategyArray, DataStrategyBL) {
   'use strict';
   return $ws.proto.Abstract.extend({
      $protected: {
         _data: [],
         _dataSource: undefined,
         _strategy: null,
         options: {
            dataSource: undefined,
            data: undefined,
            strategy: 'DataStrategyBL' // пока по дефолту оставим так
         }
      },
      $constructor: function () {
         this._dataSource = this._options.dataSource;
         this._strategy = this._options.strategy;

         if (this._options.data) {
            this._prepareData(this._options.data, this._options.fields);
         }

      },
      addRecord: function (record) {
         this._data.push(record);
      },
      _prepareData: function (data, fields) {
         var self = this;

         self._data = [];

         switch (self._strategy) {
            case 'DataStrategyBL':
               self._data = (new DataStrategyBL()).prepareData(data['d'], data['s']);
               break;
            case 'DataStrategyArray':
               self._data = (new DataStrategyArray()).prepareData(data, fields);
               break;
         }


      },

      each: function (iterateCallback, context) {
         var self = this,
            data = self._data,
            length = data.length;

         for (var i = 0; i < length; i++) {
            iterateCallback.call(context, data[i]);
         }

      }

   });
});