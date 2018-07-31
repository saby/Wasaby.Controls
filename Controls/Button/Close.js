define('Controls/Button/Close', [
   'Core/Control',
   'tmpl!Controls/Button/Close',
   'css!Controls/Button/Close'
], function(Control, template) {

   var CloseButton = Control.extend({
      _template: template
   });

   CloseButton.getDefaultOptions = function() {
      return {
         style: 'default',
         backgroundStyle: 'default'
      };
   };

   return CloseButton;
});
