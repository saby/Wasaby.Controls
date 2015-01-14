/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [
   'js!SBIS3.CONTROLS.DataStrategyArray',
   'js!SBIS3.CONTROLS.DataStrategyBL'
], function (DataStrategyArray, DataStrategyBL) {
   'use strict';
   return $ws.proto.Abstract.extend({
      strategy: null,
      $protected: {
         _rawData: [],
         _options: {
            data: undefined,
            strategy: 'DataStrategyBL' // пока по дефолту оставим так
         }
      },
      $constructor: function () {

         //FixME: сделаем глобальный объект со всеми стратегиями и свитч будет не нужен?
         switch (this._options.strategy) {
            case 'DataStrategyBL':
               this.strategy = new DataStrategyBL();
               break;
            case 'DataStrategyArray':
               this.strategy = new DataStrategyArray();
               break;
         }

         if (this._options.data) {
            this._prepareData(this._options.data);
         }

      },

      _prepareData: function (data) {
         var self = this;
         self._rawData = data;
      },

      getRawData: function () {
         return this._rawData;
      }

   });
});