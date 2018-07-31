define('Controls/Container/Master', [
   'Core/Control',
   'tmpl!Controls/Container/Master/Master',
   'css!Controls/Container/Master/Master'
], function(Control, template) {
   return Control.extend({
      _template: template,
      _itemClickHandler: function(event, item) {
         if (item) {
            this._notify('selectedMasterValueChanged', [item && item.get(this._options.selectedField)], {bubbling: true});
         }

      }
   });
});
