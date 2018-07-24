define('Controls/Container/MasterList', [
   'Core/Control',
   'tmpl!Controls/Container/MasterList/MasterList',
   'css!Controls/Container/MasterList/MasterList'
], function(Control, template) {
   return Control.extend({
      _template: template,
      _itemClickHandler: function(event, item) {
         this._notify('selectedMasterFieldChanged', [item], {bubbling: true});
      }
   });
});
