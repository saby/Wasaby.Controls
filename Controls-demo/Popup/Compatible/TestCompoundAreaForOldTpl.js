define('Controls-demo/Popup/Compatible/TestCompoundAreaForOldTpl', [
   'Core/Control',
   'wml!Controls-demo/Popup/Compatible/TestCompoundAreaForOldTpl'
], function(Control, template) {
   var _private = {
      getExistingDialog: function() {
         var element = document.querySelector('.controls-CompoundArea.controls-Popup__template');
         if (element) {
            return element.controlNodes[0].control;
         }
         return null;
      }
   };

   return Control.extend({
      _template: template,

      openTestStack: function() {
         this._children.eventStackOpener.open();
      },
      openReviveStack: function() {
         this._children.reviveStackOpener.open();
      },
      openInputStack: function() {
         this._children.inputStackOpener.open();
      },
      openValidateStack: function() {
         this._children.validateStackOpener.open({
            catchFocus: false // Focus is put down independently on the template
         });
      },
      openDialog: function() {
         var dialog = _private.getExistingDialog();
         if (!dialog) {
            // dialog is not opened yet, open it
            this._children.dialogOpener.open({
               target: this._children.dialogButton._container,
               opener: this._children.dialogButton
            });
         } else {
            // dialog is already opened, assume it's hidden and show it
            dialog.show();
         }
      },
      openOpenerStack: function() {
         this._children.openerStackOpener.open();
      }
   });
});
