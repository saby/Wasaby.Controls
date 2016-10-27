define('js!SBIS3.CONTROLS.CommandsButton', [
   'js!SBIS3.CONTROLS.MenuIcon',
   'js!SBIS3.CONTROLS.ContextMenu'
], function(MenuIcon){

   'use strict';

   var CommandsButton = MenuIcon.extend({
      _modifyOptions: function(opts) {
         opts.className += ' controls-Menu__hide-menu-header';
         opts.icon = 'sprite:icon-24 icon-ExpandDown icon-primary';
         opts.pickerClassName += ' controls-CommandsButton__picker controls-MenuIcon__Menu';
         return CommandsButton.superclass._modifyOptions.call(this, opts);
      },
      _modifyPickerOptions: function(opts) {
         opts.horizontalAlign.side = 'right';
         opts.closeButton = true;
         return opts;
      },
      _setPickerContent: function() {
         CommandsButton.superclass._setPickerContent.apply(this, arguments);
         $('.controls-PopupMixin__closeButton', this._picker.getContainer()).addClass('icon-24 icon-ExpandUp icon-primary');
      }
   });
   return CommandsButton;
});