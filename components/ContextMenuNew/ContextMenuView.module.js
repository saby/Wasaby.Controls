/* global define */
define('js!SBIS3.CONTROLS.ContextMenuView', [
   'js!SBIS3.CONTROLS.MenuNewView'
], function(MenuNewView) {
   'use strict';
   /**
    * Представление для контектсного меню
    * @class SBIS3.CONTROLS.ContextMenuView
    * @extends SBIS3.CONTROLS.MenuNewView
    * @author Ганшин Ярослав Олегович
    */
   var MenuView = MenuNewView.extend(/** @lends SBIS3.CONTROLS.ContextMenuView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ContextMenuView',
      $protected: {
      },

      _onMenuConfig: function(config) {
         return config;
      }

   });
   return MenuView;
});
