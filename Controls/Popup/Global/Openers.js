define('Controls/Popup/Global/Openers', ['Core/Control', 'wml!Controls/Popup/Global/Openers'],
   function(Control, template) {
      return Control.extend({
         _template: template,

         // todo: https://online.sbis.ru/opendoc.html?guid=ca9e3c9e-88e4-4a1c-8b6f-709ece491da7
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
