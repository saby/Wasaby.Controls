define('Controls/Printer/Excel', [
   'Core/Control',
   'Controls/Printer/Utils'
], function(
   Control,
   PrinterUtils
) {
   'use strict';

   /**
    * Printer for printing to Excel.
    *
    * @class Controls/Printer/Excel
    * @extends Core/Control
    * @mixes Controls/interface/IPrinter
    * @control
    * @author Зайцев А.С.
    * @public
    */

   var Excel = Control.extend(/** @lends Controls/Printer/Excel */{
      print: function(query, params) {
         PrinterUtils.print(query, params, this._options.source, 'Excel', 'excel');
      }
   });

   return Excel;
});
