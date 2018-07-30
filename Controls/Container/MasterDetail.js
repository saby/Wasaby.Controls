define('Controls/Container/MasterDetail', [
   'Core/Control',
   'tmpl!Controls/Container/MasterDetail/MasterDetail',
   'css!Controls/Container/MasterDetail/MasterDetail'
], function(Control, template) {
   return Control.extend({
      _template: template,
      _selected: null
   });
});
