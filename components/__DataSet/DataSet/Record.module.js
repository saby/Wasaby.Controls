/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
         _row: []
      },
      $constructor: function (cfg) {
         if (cfg) {
            this._row = cfg.row;
         }
      },
      set: function (value) {
         this._row = value;
      }
   });
});