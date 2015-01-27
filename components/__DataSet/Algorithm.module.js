/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Algorithm', ['js!SBIS3.CONTROLS.Record'], function (Record) {
   'use strict';
   var _ = {

      /**
       * Хэлепр обхода (пока только по DataSource)
       * @param object
       * @param iterateCallback
       * @param context
       */
      each: function (object, iterateCallback, context) {
         var record = new Record(object.getStrategy());
         object.getStrategy().each(object.getRawData(), function (rawRow) {
            record.setRaw(rawRow);
            iterateCallback.call(context, record);
         });
      }

   };

   return _;
});