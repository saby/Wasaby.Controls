define('js!WSControls/Controllers/RecordsetListSelector', [
   'js!WSControls/Controllers/BaseListSelector'
], function(BaseListSelector) {
   var RecordsetListSelector = BaseListSelector.extend({


      _prepareData: function(cfg) {
         RecordsetListSelector.superclass._prepareData.apply(this, arguments);
         this._options.selectedKey = cfg.selectedKey;
         this.selectedKey = this._options.selectedKey || null;

         if (this._isEmptyIndex(this.selectedIndex)) {
            //Если передали пустой индекс и ключ, определяем индекс по ключу
            this._prepareSelectedIndexByKey(this.selectedKey)
         }
         else {
            //если индекс передали - вычисляем ключ
            this._prepareSelectedKeyByIndex(this.selectedIndex)
         }
      },

      _prepareSelectedIndexByKey: function(key) {
         //Вычисляем индекс по известному ключу
         if (typeof key === 'undefined') {
            this.selectedIndex = -1;
         }
         else {
            this.selectedIndex = this._getItemIndexByKey(key);
         }
         this._allowEmptyApply();
      },

      _prepareSelectedKeyByIndex: function(index) {
         //Вычисляем ключ по известному индексу
         if (this._isEmptyIndex(index)) {
            this.selectedKey = null;
         }
         else {
            this.selectedKey = this._getKeyByIndex(this.selectedIndex);
         }
         this._allowEmptyApply();
      },

      _getKeyByIndex: function(index) {
         if(this._hasItemByIndex(index)) {
            var itemContents = this._options.projection.at(index).getContents();
            return itemContents.getId();
         }
      },

      _getItemIndexByKey: function(id) {
         var recordset = this._options.projection.getCollection();
         var projItem = this._options.projection.getItemBySourceItem(recordset.getRecordById(id));
         return this._options.projection.getIndex(projItem);
      },

      _hasItemByIndex: function(index) {
         return (typeof index != 'undefined') && (index !== null) && (typeof this._options.projection.at(index) != 'undefined');
      },

      setSelectedKey: function(id) {
         if (this.selectedKey != id) {
            this.selectedKey = id;
            this._prepareSelectedIndexByKey(id);
            this._notifySelectedItem(this.selectedIndex, this.selectedKey);
         }
      },

      getSelectedKey: function(id) {
         return this.selectedKey;
      },

      setSelectedIndex: function(index) {
         if (this.selectedIndex != index) {
            this.selectedIndex = index;
            this._prepareSelectedKeyByIndex(index);
            this._notifySelectedItem(this.selectedIndex, this.selectedKey);
         }
      },

      _notifySelectedItem : function(index, key) {
         this._notify('onSelectedItemChange', index, key);
      }
   });
   return RecordsetListSelector;
});