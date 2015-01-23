/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyArray', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
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
      },

      getByKey: function (data, keyField, key) {
         var item,
            length = data.length;
         for (var i = 0; i < length; i++) {
            if (data[i][keyField] == parseInt(key, 10)) {
               item = data[i];
            }
         }
         return item;
      },

      setValue: function (data, field, value) {
         data[field] = value;
         return data;
      },

      value: function (data, field) {
         return data[field];
      }

   });
});