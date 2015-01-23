/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataStrategyBL', ['js!SBIS3.CONTROLS.IDataStrategy'], function (IDataStrategy) {
   'use strict';
   return IDataStrategy.extend({
      $protected: {
      },
      $constructor: function () {
      },

      getKey: function (data) {
         var s = data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i]['t'] == 'Идентификатор') {
               index = i;
               break;
            }
         }
         return s[index]['n'];
      },

      each: function (data, iterateCallback, context) {
         var d = data.d,
            s = data.s,
            length = d.length;
         for (var i = 0; i < length; i++) {
            iterateCallback.call(context, {s: s, d: d[i]});
         }
      },

      getByKey: function (data, keyField, key) {
         var d = data.d,
            s = data.s,
            item,
            length = d.length;
         for (var i = 0; i < length; i++) {
            if (d[i][0][0] == parseInt(key, 10)) {
               item = d[i];
            }
         }
         return {d: item, s: s};
      },

      value: function (data, field) {
         var d = data.d,
            s = data.s,
            index;
         for (var i = 0, l = s.length; i < l; i++) {
            if (s[i]['n'] == field) {
               index = i;
               break;
            }
         }
         return d[index];
      }
   });
});