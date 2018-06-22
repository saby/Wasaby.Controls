define('Controls/Button/Close', [
   'Core/Control',
   'tmpl!Controls/Button/Close',
   'css!Controls/Button/Close'
], function(Control, template) {

   var CloseButton = Control.extend({
      _template: template,

      clickHandler: function() {
         this._notify('close', [], {bubbling: true})
      }
   });

   CloseButton.getDefaultOptions = function() {
      return {
         style: 'standart'
      };
   };

   return CloseButton;
});
