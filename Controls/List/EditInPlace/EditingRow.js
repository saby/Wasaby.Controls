define('Controls/List/EditInPlace/EditingRow', [
   'Core/Control',
   'tmpl!Controls/List/EditInPlace/EditingRow'
], function (Control, template) {
   var EditingRow = Control.extend({
      _template: template,

      _afterMount: function() {
         //TODO: надо подумать как ставить фокус в нужный редактор в гриде
         this.activate();
      },

      _onDeactivated: function(e, isTabPressed) {
         //TODO: шифт-таб
         this._notify('rowDeactivated', [isTabPressed], { bubbling: true });
      }
   });

   return EditingRow;
});