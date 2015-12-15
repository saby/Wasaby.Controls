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
      /**
       * возвращает дополнительные css классы для пикера в зависимости от контейнера
       * */
      getAdditionalClasses: function(){
         var container = this._options.rootNode,
            pickerClass = '';
         if (container.hasClass('controls-Menu__hide-menu-header')){
            pickerClass += ' controls-Menu__hide-menu-header';
         }
         if (container.hasClass('controls-IconButton__round-border')){
            pickerClass += ' controls-IconButton__round-border';
         }
         if (container.hasClass('icon-24')){
            pickerClass += ' controls-Menu__big-header';
         }
      }


   });
   return MenuView;
});
