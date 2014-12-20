/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSet', ['js!SBIS3.CONTROLS.Record'], function (Record) {
   'use strict';
   return $ws.proto.Abstract.extend({
      $protected: {
         _data: [],
         _dataSource: undefined,
         _strategy: null,
         options: {
            dataSource: undefined,
            data: undefined,
            strategy: 'SBIS300' // пока по дефолту оставим так
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

         switch (self._strategy){
            case 'SBIS300':
               for (var i = 0, length = data['d'].length; i < length; i++) {
                  self._data.push(
                     new Record({
                        columns: data['s'],
                        row: data['d'][i]
                     })
                  );
               }
               break;

            case 'Array':
               for (var i = 0, length = data.length; i < length; i++) {
                  self._data.push(
                     new Record({
                        columns: fields,
                        row: data[i]
                     })
                  );
               }
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