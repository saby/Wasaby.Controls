/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', [], function () {
   'use strict';
   return $ws.proto.Abstract.extend({
      $protected: {
         _data: [],
         _adapter: null
      },
      $constructor: function () {

      },
      addRecord: function (record) {
         this._data.push(record);
      },
      setAdapter: function (adapter) {
         var self=this;
         require([adapter], function (Adapter) {
            self._adapter = new Adapter({});
         });
      },
      setRawData: function (data) {
         this._raw = data;
      },
      getRecordByPrimaryKey: function (key) {
         if (this._adapter) {
            this._data = this._adapter.prepareData(this._raw);
         }
         return this._data[key];
      }
   });
});