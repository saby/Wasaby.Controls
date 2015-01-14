/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyArray', ['js!SBIS3.CONTROLS.IDataStrategy', 'js!SBIS3.CONTROLS.Record'], function (IDataStrategy, Record) {
   'use strict';
   return IDataStrategy.extend({
      $protected: {
      },
      $constructor: function () {
      },
      each: function (data, iterateCallback, context) {
         var
            length = data.length;
         for (var i = 0; i < length; i++) {
            iterateCallback.call(context, data[i]);
         }
      }

   });
});