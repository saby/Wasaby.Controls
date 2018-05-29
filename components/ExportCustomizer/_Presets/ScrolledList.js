/**
 * @protected
 * @class SBIS3.CONTROLS/ExportCustomizer/_Presets/ScrolledList
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Presets/ScrolledList',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/ScrolledList'
   ],

   function (CompoundControl, dotTplFn) {
      'use strict';

      return CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_Presets/ScrolledList.prototype*/ {
         _dotTplFn: dotTplFn
      });
   }
);
