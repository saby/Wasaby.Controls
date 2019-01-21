/**
 * Утилита для Toolbar
 *  - содержит константы
 *  - фильтр для элементов меню
 */
define('Controls/Utils/Toolbar', ['Types/chain'], function(chain) {

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
         return chain.factory(items).filter(function(item) {
            return item.get('showType') !== self.showType.TOOLBAR;
         });
      }
   };
});
