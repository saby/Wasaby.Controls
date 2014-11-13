/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceXHRKladr', [
   'js!SBIS3.CONTROLS.DataSourceXHR',
   'js!SBIS3.CONTROLS.DataSet'
], function (DataSourceXHR, DataSet) {
   'use strict';
   return DataSourceXHR.extend({
      $protected: {
         _options: {
            url: '/kladr/service/settlement'
         }
      },
      $constructor: function (cfg) {
         this._adapter = (cfg.adapter) ? cfg.adapter : 'js!SBIS3.CONTROLS.DataAdapterKladr';
      },

      query: function (data) {
         var
            self = this,
            def = new $ws.proto.Deferred();
         this._execute(data).addCallback(function (result) {
            var
               res,
               ds = new DataSet({
               });
            try {
               res = JSON.parse(result);
               ds.setRawData(res);
               ds.setAdapter(self._adapter);
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