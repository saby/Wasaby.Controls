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
         _strategy: null,
         _rawData: [],
         _keyField: undefined,
         _options: {
            data: undefined,
            keyField: '',
            strategy: 'DataStrategyBL' // пока по дефолту оставим так
         }
      },
      $constructor: function () {

         if (this._options.data) {
            this._prepareData(this._options.data);
         }

         //FixME: сделаем глобальный объект со всеми стратегиями и свитч будет не нужен?
         switch (this._options.strategy) {
            case 'DataStrategyBL':
               this._strategy = new DataStrategyBL();
               this._keyField=this._strategy.getKey(this._rawData);
               break;
            case 'DataStrategyArray':
               this._strategy = new DataStrategyArray();
               if (this._options.keyField) {
                  this._keyField = this._options.keyField;
               }
               break;
         }

      },

      _prepareData: function (data) {
         var self = this;
         self._rawData = data;
      },

      getRawData: function () {
         return this._rawData;
      },

      getKey: function (item) {
         return item.get(this._keyField);
      },

      getRecordByKeyField: function(key){
         console.log(this._data)

         return key;
      },

      getStrategy:function(){
         return this._strategy;
      }

   });
});