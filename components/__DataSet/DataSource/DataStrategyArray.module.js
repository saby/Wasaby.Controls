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

      prepareData: function (data, columns) {
         var result = [];
         for (var i = 0, length = data.length; i < length; i++) {
            result.push(
               new Record({
                  columns: columns,
                  row: data[i]
               })
            );
         }
         return result;
      }

   });
});