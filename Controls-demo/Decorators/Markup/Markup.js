define('Controls-demo/Decorators/Markup/Markup', [

   'Core/Control',
   'wml!Controls-demo/Decorators/Markup/Markup',

   'css!Controls-demo/Decorators/Markup/Markup',
   'Controls/Decorator/Markup'

], function(Control,
   template) {
   'use strict';

   return Control.extend({
      _template: template,
      json: [],
      strJson: '',
      _setJson: function(e, value) {
         this.strJson = value;
      },
      _applyJson: function(event) {
         if (event.type === 'click' || event.nativeEvent.code === 'Enter') {
            try {
               this.json = JSON.parse(this.strJson);
            } catch (e) {
               this.json = ['span', { 'class': 'ControlsDemo-Markup__error' }, e.message];
            }
         }
      }
   });
});
