/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataAdapterKladr', ['js!SBIS3.CONTROLS.IDataAdapter'], function (IDataAdapter) {
   'use strict';
   return IDataAdapter.extend({
      $protected: {
      },
      $constructor: function () {
      },
      prepareData: function (raw) {
         var data = [];
         $ws.helpers.forEach(raw, function (value) {
            data.push(value);
         });
         return data;
      }
   });
});