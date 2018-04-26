define('WSTest/VdomCompoundVdom/VdomCompoundVdom', [
   'tmpl!WSTest/VdomCompoundVdom/VdomCompoundVdom',
   'Core/Control',
], function(tmpl, Control) {

   var moduleClass = Control.extend({
      _template: tmpl,
      text: 'vdom text'
   });
   return moduleClass;
});