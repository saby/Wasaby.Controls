/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceXHRKladr', [
   'js!SBIS3.CONTROLS.DataSourceXHR',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.Record'
], function (DataSourceXHR, DataSet, Record) {
   'use strict';
   return DataSourceXHR.extend({
      $protected: {
         _options: {
            url: '/kladr/service/settlement'
         }
      },
      $constructor: function (cfg) {
         var self = this;
         var adapter = (cfg.adapter) ? cfg.adapter : 'js!SBIS3.CONTROLS.DataAdapterKladr';
         require([adapter], function (Adapter) {
            self._adapter = new Adapter({});
         });
      },

      query: function (data) {
         var def = new $ws.proto.Deferred();
         this._execute(data).addCallback(function (result) {
            // тут надо намутить адаптер и возврат датасета
            var
               res,
               ds = new DataSet({});
            try {
               res = JSON.parse(result);
               $ws.helpers.forEach(res, function (value) {
                  ds.addRecord(new Record({row: value}));
               });
            }
            catch (e) {
               throw new TypeError('Responce parse error');
            }
            def.callback(ds);
         });
         return def;
      }

   });
});