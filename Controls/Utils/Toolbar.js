/**
 * Утилита для Toolbar
 *  - содержит константы
 *  - фильтр для элементов меню
 */
define('Controls/Utils/Toolbar', ['WS.Data/Chain'], function(Chain) {

   'use strict';

   return {
      showType: {

         //show only in Menu
         MENU: 0,

         //show in Menu and Toolbar
         MENU_TOOLBAR: 1,

         //show only in Toolbar
         TOOLBAR: 2

      },

      getMenuItems: function(items) {
         var self = this;
         return Chain(items).filter(function(item) {
            return item.get('showType') !== self.showType.TOOLBAR;
         });
      }
   };
});
