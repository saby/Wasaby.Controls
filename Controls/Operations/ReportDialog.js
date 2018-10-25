define('Controls/Operations/ReportDialog', [
   'Core/Control',
   'wml!Controls/Operations/ReportDialog/ReportDialog',
   'css!Controls/Operations/ReportDialog/ReportDialog'
], function(Control, template) {
   'use strict';

   /**
    * The template of the dialog with the results of mass operations.
    *
    * @class Controls/Operations/ReportDialog
    * @extends Core/Control
    * @control
    * @public
    *
    */

   /**
    * @name Controls/Operations/ReportDialog#title
    * @cfg {String} The title of the operation.
    */

   /**
    * @name Controls/Operations/ReportDialog#operationsCount
    * @cfg {Number} The number of elements on which the operation was performed.
    */

   /**
    * @name Controls/Operations/ReportDialog#operationsSuccess
    * @cfg {Number} Number of items for which the operation completed successfully.
    */

   /**
    * @name Controls/Operations/ReportDialog#errors
    * @cfg {Array.<String>} Error list.
    * @remark
    * If the error list is not passed, the default text will be shown.
    */


   return Control.extend({
      _template: template,
      _onCloseClick: function() {
         this._notify('close', [], {bubbling: true});
      }
   });
});
