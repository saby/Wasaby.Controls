define('Controls/List/EditInPlace/EditingRow', [
   'Core/Control',
   'tmpl!Controls/List/EditInPlace/EditingRow'
], function(Control, template) {
   var EditingRow = Control.extend({
      _template: template,

      _afterMount: function() {
         this.activate();
      }
   });

   return EditingRow;
});
