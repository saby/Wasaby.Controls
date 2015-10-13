/* global define, console, doT, $ws, $, require */
define('js!SBIS3.CONTROLS.ContextMenuView', [
   'js!SBIS3.CONTROLS.MenuNewView',
   'js!SBIS3.CONTROLS.FloatArea',
   'js!SBIS3.CONTROLS.Data.Utils'
], function(TreeView, FloatArea, DataUtils) {
   'use strict';
   /**
    * Представление для меню
    * @class SBIS3.CONTROLS.MenuView
    * @extends SBIS3.CONTROLS.TreeControl.TreeView
    * @author Крайнов Дмитрий Олегович
    */
   var MenuView = TreeView.extend(/** @lends SBIS3.CONTROLS.MenuView.prototype */{
      _moduleName: 'SBIS3.CONTROLS.ContextMenuView',
      $protected: {
      },

      _onMenuConfig: function(config) {
         return config;
      }

   });
   return MenuView;
});
