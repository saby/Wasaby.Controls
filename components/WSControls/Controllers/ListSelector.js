define('js!WSControls/Controllers/ListSelector', [
   'Core/Abstract',
   'js!WSControls/Lists/resources/utils/ItemsUtil'
], function(Abstract, ItemsUtil) {
   var ListSelector = Abstract.extend({
      _useNativeAsMain: true,
      constructor: function(cfg) {
         ListSelector.superclass.constructor.apply(this, arguments);
         this._prepareData(cfg);
         this._allowEmptyApply();
         this._publish('onSelectedItemChange');
      },

      _prepareData: function(cfg) {
         this._options = {
            selectedIndex : cfg.selectedIndex,
            allowEmptySelection : cfg.allowEmptySelection,
            selectedKey: cfg.selectedKey,
            projection: cfg.projection,
            idProperty: cfg.idProperty

         };
         this.selectedIndex = (this._options.selectedIndex !== undefined && this._options.selectedIndex !== null) ? this._options.selectedIndex : -1;
         this.allowEmptySelection = (this._options.allowEmptySelection !== undefined && this._options.allowEmptySelection !== null) ? this._options.allowEmptySelection: true;
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

      _allowEmptyApply: function() {
         if (!this.allowEmptySelection && this._isEmptyIndex(this.selectedIndex)) {
            if (this._options.projection.getCount()) {
               this.setSelectedIndex(0)
            }
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
            return ItemsUtil.getPropertyValue(itemContents, this._options.idProperty);
         }
      },

      _getItemIndexByKey: function(id) {
         var projItem = ItemsUtil.getItemById(this._options.projection, id, this._options.idProperty);
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

      getSelectedIndex : function() {
         return this.selectedIndex;
      },

      setSelectedByHash: function(hash) {
         var elem = this._options.projection.getByHash(hash);
         this.setSelectedIndex(this._options.projection.getIndex(elem));
      },

      _isEmptyIndex: function(index) {
         return index === null || typeof index == 'undefined' || index == -1;
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
   return ListSelector;
});