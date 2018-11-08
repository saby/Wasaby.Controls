/**
 * Утилита для Toolbar
 *  - содержит константы
 *  - фильтр для элементов меню
 */
define('Controls/Utils/Toolbar', ['WS.Data/Chain'], function(Chain) {

   'use strict';

   return {
      showType: {

         //show icon and toolbar only in Menu
         MENU: 0,

         //show icon and toolbar in Menu and Toolbar
         MENU_TOOLBAR: 1,

         //show icon and toolbar only in Toolbar
         TOOLBAR: 2,

         //show icon in toolbar, in menu show icon and title
         TOOLBAR_ICON_TITLE: 3

      },

      getMenuItems: function(items) {
         var self = this;
         return Chain(items).filter(function(item) {
            return item.get('showType') !== self.showType.TOOLBAR;
         });
      }
   };
});
