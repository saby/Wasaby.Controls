define('Controls/Printer/Printer', [
   'Core/Control',
   'tmpl!Controls/Printer/Printer'
], function(
   Control,
   template
) {
   'use strict';

   var _private = {
      getData: function(source, query) {
         return source.query(query).addCallback(function(data) {
            return data.getAll();
         });
      }
   };

   /**
    * Printer for printing using default browser interface.
    *
    * @class Controls/Printer/Printer
    * @extends Core/Control
    * @mixes Controls/interface/IPrinter
    * @control
    * @author Зайцев А.С.
    * @public
    */

   /**
    * @cfg {String}
    * @name Controls/Printer/Printer#printTemplate Name of the template that will be used for printing.
    */
   '';
   var Printer = Control.extend(/** @lends Controls/Printer/Printer */ {
      _template: template,

      print: function(query) {
         var self = this;
         this._children.loadingIndicator.toggleIndicator(true);

         _private.getData(this._options.source, query).addCallback(function(data) {
            require([self._options.printTemplate], function(printTemplate) {
               self._children.loadingIndicator.toggleIndicator(false);
               self._children.dialog.open({
                  opener: self,
                  templateOptions: {
                     printTemplate: printTemplate,
                     data: data
                  }
               });
            });
         });
      }
   });

   return Printer;
});
