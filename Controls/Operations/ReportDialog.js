define('Controls/Operations/ReportDialog', [
   'Core/Control',
   'Core/helpers/String/format',
   'wml!Controls/Operations/ReportDialog/ReportDialog',
   'css!Controls/Operations/ReportDialog/ReportDialog'
], function(Control, format, template) {
   'use strict';

   /**
    * The template of the dialog with the results of mass operations.
    *
    * @class Controls/Operations/ReportDialog
    * @extends Core/Control
    * @control
    * @author Сухоручкин А.С.
    * @public
    *
    * @css @font-size_ReportDialog-title Title font-size.
    * @css @color_ReportDialog-title Title text color.
    * @css @color_ReportDialog-message Message text color.
    * @css @color_ReportDialog-error Errors text color.
    * @css @spacing_ReportDialog-between-title-message Spacing between title and message.
    * @css @spacing_ReportDialog-between-message-errors Spacing between message and errors.
    * @css @spacing_ReportDialog-between-errors Spacing between errors.
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
      _message: null,
      _beforeMount: function(cfg) {
         if (cfg.operationsCount === cfg.operationsSuccess) {
            this._message = rk('Выполнение операции завершилось успешно');
         } else if (!cfg.errors || !cfg.errors.length) {
            this._message = rk('Выполнение операции завершилось ошибкой');
         } else {
            this._message = format({
               count: cfg.operationsCount,
               errors: cfg.operationsCount - cfg.operationsSuccess
            }, rk('$errors$s$ из $count$s$ операций были обработаны с ошибкой'));
         }
      },
      _onCloseClick: function() {
         this._notify('close', [], {bubbling: true});
      }
   });
});
