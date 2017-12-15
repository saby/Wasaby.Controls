define('SBIS3.CONTROLS/OperationsPanel/Print/PrintButton',
[
   'SBIS3.CONTROLS/Menu/MenuLink'
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