define('Controls/Popup/Global/Openers', ['Core/Control', 'wml!Controls/Popup/Global/Openers'],
   function(Control, template) {
      return Control.extend({
         _template: template,
         getPreviewer: function() {
            return this._children.previewerOpener;
         },
         getInfoBox: function() {
            return this._children.infoBoxOpener;
         },
         getDialog: function() {
            return this._children.dialogOpener;
         }
      });
   });
