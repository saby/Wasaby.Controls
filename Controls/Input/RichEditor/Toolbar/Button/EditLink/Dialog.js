define('Controls/Input/RichEditor/Toolbar/Button/EditLink/Dialog', [
   'Core/Control',
   'wml!Controls/Input/RichEditor/Toolbar/Button/EditLink/Dialog/Dialog',
   'css!theme?Controls/Input/RichEditor/Toolbar/Button/EditLink/Dialog/Dialog'
], function(Control, template) {
   /**
    * Component Toolbar/Button/EditLink/Dialog
    * Dialog for editing links
    * @class Controls/Input/RichEditor/Toolbar/Button/EditLink
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var InsertLinkDialog = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         this._link = options.link || '';
         this._caption = options.caption || '';
      },

      _clickHandler: function() {
         this._notify('sendResult', [this._link, this._caption]);
         this._notify('close');
      }
   });

   return InsertLinkDialog;
});
