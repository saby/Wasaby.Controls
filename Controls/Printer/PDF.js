define('Controls/Printer/PDF', [
   'Core/Control',
   'Controls/Printer/Utils'
], function(
   Control,
   PrinterUtils
) {
   'use strict';

   /**
    * Printer for printing to PDF.
    *
    * @class Controls/Printer/PDF
    * @extends Core/Control
    * @mixes Controls/interface/IPrinter
    * @control
    * @author Зайцев А.С.
    * @public
    */

   var PDF = Control.extend(/** @lends Controls/Printer/PDF */{
      print: function(query, params) {
         PrinterUtils.print(query, params, this._options.source, 'PDF', 'pdf_converter_storage');
      }
   });

   return PDF;
});
