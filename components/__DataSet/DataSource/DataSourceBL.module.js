/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceBL', ['js!SBIS3.CONTROLS.DataSourceXHR'], function (DataSourceXHR) {
   'use strict';
   return DataSourceXHR.extend({
      $protected: {
         _options: {
            url: $ws._const.defaultServiceUrl,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
         },
         _object: ''
      },
      $constructor: function (cfg) {
         this._object = cfg.object;
      },
      read: function () {

      },
      query: function (data) {
         var def = new $ws.proto.Deferred();
         var self = this;
         var req = $ws.helpers.jsonRpcPreparePacket(this._object + '.' + data.method, {"ДопПоля": [], "Фильтр": {"d": [], "s": []}, "Сортировка": null, "Навигация": null})
         this._execute(req.reqBody, req.reqHeaders).addCallback(function (result) {
            var model = new $ws.proto.RecordSet({dataSource: self, readerParams: { adapterType: 'TransportAdapterStatic', adapterParams: { data: result.result } } });
            var recursionFunction = function (rec) {
               if (rec instanceof $ws.proto.Record) {
                  var columns = rec.getColumns();
                  for (var i = 0, l = columns.length; i < l; i++) {
                     recursionFunction(rec.get(columns[i]));
                  }
               }
               else if (rec instanceof $ws.proto.RecordSet) {
                  for (var j = 0, c = rec.getRecordCount(); j < c; j++) {
                     recursionFunction(rec.at(0));
                  }
               }
            };

            recursionFunction(model);

            def.callback(model);
         });
         return def;
      },
      create: function () {
      },
      destroy: function () {
      },
      update: function () {
      }
   });
});