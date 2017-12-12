define('js!SBIS3.CONTROLS.PrintButton',
[
   'js!SBIS3.CONTROLS.MenuLink'
], function(MenuLink) {
   var PrintButton = MenuLink.extend({
      $protected: {
         _options: {
            icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
            command: 'printItems',
            caption: rk('Распечатать')
         }
      }
   });

   return PrintButton;
});