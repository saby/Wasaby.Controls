define('js!SBIS3.CONTROLS.UnloadButton',
[
   'js!SBIS3.CONTROLS.MenuLink'
], function(MenuLink) {
   var UnloadButton = MenuLink.extend({
      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Save icon-primary',
            caption: rk('Выгрузить'),
            items: [
               {
                  id : 'PDF',
                  title : rk('Список в PDF'),
                  command: 'unloadItems',
                  commandArgs: ['PDF']
               },
               {
                  id : 'Excel',
                  title : rk('Список в Excel'),
                  command: 'unloadItems',
                  commandArgs: ['Excel']
               }
            ]
         }
      }
   });

   return UnloadButton;
});