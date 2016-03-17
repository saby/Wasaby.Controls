define('js!SBIS3.CONTROLS.CommandsButton', [
   'js!SBIS3.CONTROLS.MenuIcon',
   'js!SBIS3.CONTROLS.ContextMenu'
], function(MenuIcon){

   'use strict';

   var CommandsButton = MenuIcon.extend({
      $protected : {
         _options: {
            className : 'controls-Menu__hide-menu-header',
            pickerClassName : 'controls-CommandsButton__picker controls-MenuIcon__Menu',
            icon : 'sprite:icon-24 icon-MoreButton icon-primary'
         }
      },
      _modifyPickerOptions: function(opts) {
         opts.horizontalAlign.side = 'right';
         opts.closeButton = true;
         return opts;
      },
      _setPickerContent: function() {
         CommandsButton.superclass._setPickerContent.apply(this, arguments);
         $('.controls-PopupMixin__closeButton', this._picker.getContainer()).addClass('icon-24 icon-LessButton icon-primary action-hover');
      }
   });
   return CommandsButton;
});