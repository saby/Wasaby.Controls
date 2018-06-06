define('Controls/Button/Close', [
   'Core/Control',
   'tmpl!Controls/Button/Close',
   'css!Controls/Button/Close'
], function(Control, template) {
   
   return Control.extend({
      _template: template
   });
   
});
