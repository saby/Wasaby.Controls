/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';
   return $ws.core.extend({}, {
      $protected: {
         _row: [],
         _colDef: [],
         _pkValue: undefined
      },
      $constructor: function (cfg) {
         if (cfg) {
            this._colDef = cfg.colDef;
            this._pkValue = cfg.pkValue;
            this._row = cfg.row;
         }
      }
   });
});