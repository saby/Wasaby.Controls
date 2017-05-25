define('js!WSControls/Lists/ListView2', ['js!WSControls/Lists/ItemsControl',
   'js!WSControls/Controllers/RecordsetListSelector',
   'tmpl!SBIS3.CONTROLS.ListView/resources/ItemTemplate'], function(ItemsControl, RecordsetListSelector, ItemTemplate) {
   var ListView = ItemsControl.extend({
      _needSelector: true,
      _defaultItemTemplate: ItemTemplate,
      _createDefaultSelector : function() {
         return new RecordsetListSelector({
            selectedIndex : this._options.selectedIndex,
            selectedKey : this._options.selectedKey,
            allowEmptySelection: this._options.allowEmptySelection,
            projection: this._itemsProjection
         })
      },
      _prepareItemDataInner: function() {
         var data = ListView.superclass._prepareItemDataInner.apply(this, arguments);
         data.selectedKey = this.getSelectedKey();
         return data;
      }
   });

   return ListView;
});