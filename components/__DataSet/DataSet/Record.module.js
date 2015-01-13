/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
         _raw: undefined
      },
      $constructor: function () {

      },
      setRaw: function (raw) {
         this._raw = raw;
      },
      get: function (i) {
         return this._raw[i];
      },
      getKey: function () {
         var key = this._raw[0];
         return (typeof key === 'object') ? key[0] : key;
      }

   });
});