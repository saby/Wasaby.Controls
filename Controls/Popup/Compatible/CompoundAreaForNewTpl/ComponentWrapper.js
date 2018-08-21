define('Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper', [
   'Core/Control',
   'tmpl!Controls/Popup/Compatible/CompoundAreaForNewTpl/ComponentWrapper/ComponentWrapper'
], function(Control, template) {

   return Control.extend({
      _template: template
   });
});
