/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
         _raw: undefined,
         _strategy: undefined
      },
      $constructor: function (strategy) {
         this._strategy = strategy;
      },
      setRaw: function (raw) {
         this._raw = raw;
      },
      get: function (field) {
         return this._strategy.value(this._raw, field);
      },
      set: function (field, value) {
         this._raw = this._strategy.setValue(this._raw, field, value);
      },
      getRaw: function () {
         return this._raw;
      }

   });
});