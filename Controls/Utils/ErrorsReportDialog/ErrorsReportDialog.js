define('Controls/Utils/ErrorsReportDialog/ErrorsReportDialog', [
   'Core/Control',
   'wml!Controls/Utils/ErrorsReportDialog/ErrorsReportDialog',
   'css!Controls/Utils/ErrorsReportDialog/ErrorsReportDialog'
], function(Control, template) {
   'use strict';

   return Control.extend({
      _template: template,
      _onCloseClick: function() {
         this._notify('close', [], {bubbling: true});
      }
   });
});
