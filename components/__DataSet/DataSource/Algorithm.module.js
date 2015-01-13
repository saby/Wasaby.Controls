/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Algorithm', ['js!SBIS3.CONTROLS.Record'], function (Record) {
   'use strict';
   var _ = {

      each: function (object, iterateCallback, context) {
         // object - пока только DataSource
         var record = new Record();
         object.strategy.each(object._rawData, function (rawRow) {
            record.setRaw(rawRow);
            iterateCallback.call(context, record);
         });
      }

   };

   return _;
});