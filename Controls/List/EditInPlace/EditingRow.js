define('Controls/List/EditInPlace/EditingRow', [
   'Core/Control',
   'tmpl!Controls/List/EditInPlace/EditingRow'
], function(Control, template) {
   var EditingRow = Control.extend({
      _template: template,

      _afterMount: function() {
         //TODO: надо подумать как ставить фокус в нужный редактор в гриде
         this.activate();
      }
   });

   return EditingRow;
});
