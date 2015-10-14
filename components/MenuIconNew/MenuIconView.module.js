/* global define */
define('js!SBIS3.CONTROLS.MenuIconView', [
   'js!SBIS3.CONTROLS.MenuLinkNewView'
], function(MenuLinkNewView) {
   'use strict';
   /**
    * Представление для MenuIcon
    * @class SBIS3.CONTROLS.MenuIconNew
    * @extends SBIS3.CONTROLS.MenuLinkNewView
    * @author Ганшин Ярослав Олегович
    */
   var MenuView = MenuLinkNewView.extend(/** @lends SBIS3.CONTROLS.MenuIconNew.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ContextMenuView',
      $protected: {
      },

      init: function(){
         this._options.rootNode.addClass('controls-MenuIcon');
      },
      getPickerClassName: function(){
         var container = this._options.rootNode;
         if (container.hasClass('controls-Menu__hide-menu-header')){
            this._options.pickerClassName += ' controls-Menu__hide-menu-header';
         }
         if (container.hasClass('controls-IconButton__round-border')){
            this._options.pickerClassName += ' controls-IconButton__round-border';
         }
         if (container.hasClass('icon-24')){
            this._options.pickerClassName += ' controls-Menu__big-header';
         }
      }


   });
   return MenuView;
});
