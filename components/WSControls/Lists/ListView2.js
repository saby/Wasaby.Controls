define('js!WSControls/Lists/ListView2', ['js!WSControls/Lists/ItemsControl', 'js!WSControls/Controllers/RecordsetListSelector'], function(ItemsControl, RecordsetListSelector) {
   var ListView = ItemsControl.extend({
      _needSelector: true,
      _createDefaultSelector : function() {
         this._selector = new RecordsetListSelector({
            selectedIndex : this._options.selectedIndex,
            selectedKey : this._options.selectedKey,
            allowEmptySelection: this._options.allowEmptySelection,
            projection: this._itemsProjection
         })
      }
   });

   return ListView;
});