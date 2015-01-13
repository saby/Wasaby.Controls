/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyBL', ['js!SBIS3.CONTROLS.IDataStrategy', 'js!SBIS3.CONTROLS.Record'], function (IDataStrategy, Record) {
   'use strict';
   return IDataStrategy.extend({
      $protected: {
      },
      $constructor: function () {
      },
      each: function (data, iterateCallback, context) {
         var d = data.d,
            length = d.length;
         for (var i = 0; i < length; i++) {
            iterateCallback.call(context, d[i]);
         }
      }
   });
});