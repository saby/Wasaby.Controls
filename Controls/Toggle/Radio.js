define('Controls/Toggle/Radio', [
   'Core/Control',
   'tmpl!Controls/Toggle/Radio/Radio',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Radio/Radio'
], function(Control, template, types) {

   var Radio = Control.extend({
      _template: template
   });

   return Radio;
});