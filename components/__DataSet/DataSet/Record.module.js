/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
         _columns: [],
         _row: []
      },
      $constructor: function (cfg) {
         if (cfg) {
            this._columns = cfg.columns;
            this._row = cfg.row;
         }
      },
      set: function (name, value) {
         this._row = value;
      },

      get: function (key) {
         return this._row[key];
      },

      getKey: function () {
         var key = this._row[0];
         return (typeof key === 'object') ? key[0] : key;
      }
   });
});