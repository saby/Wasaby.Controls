define('js!WSControls/Lists/Selector', [
   'js!WSControls/Lists/ItemsControl',
   'js!WSControls/Lists/resources/utils/ItemsUtil'
], function(ItemsControl, ItemsUtil) {
   var Selector;
   Selector = ItemsControl.extend({
      _controlName: 'WSControls/Lists/Selector',
      constructor: function (cfg) {
         Selector.superclass.constructor.apply(this, arguments);
         this._publish('onSelectedItemChange');
      },

      _applyAllowEmpty: function () {
         if (!this._allowEmptySelection && this._isEmptyIndex(this._selectedIndex)) {
            if (this._display.getCount()) {
               this.setSelectedIndex(0)
            }
         }
      },

      _getItemData: function() {
         var data = Selector.superclass._getItemData.apply(this, arguments);
         data.selectedKey = this.getSelectedKey();
         return data;
      },

      _prepareSelectedIndexByKey: function (key) {
         //Вычисляем индекс по известному ключу
         this._selectedIndex = this._getItemIndexByKey(key);
         this._applyAllowEmpty();
      },

      _prepareSelectedKeyByIndex: function (index) {
         //Вычисляем ключ по известному индексу
         this._selectedKey = this._getKeyByIndex(this._selectedIndex);
         this._applyAllowEmpty();
      },

      _getKeyByIndex: function (index) {
         if (this._hasItemByIndex(index) && !this._isEmptyIndex(index)) {
            var itemContents = this._display.at(index).getContents();
            return ItemsUtil.getPropertyValue(itemContents, this._options.idProperty);
         }
         else {
            return null
         }
      },

      _getItemIndexByKey: function (id) {
         if (id === undefined) {
            return -1;
         }
         var projItem = ItemsUtil.getItemById(this._display, id, this._options.idProperty);
         return this._display.getIndex(projItem);
      },

      _hasItemByIndex: function (index) {
         return (typeof index != 'undefined') && (index !== null) && (typeof this._display.at(index) != 'undefined');
      },

      setSelectedKey: function (id) {
         if (this._selectedKey != id) {
            this._selectedKey = id;
            this._prepareSelectedIndexByKey(id);
         }
      },

      getSelectedKey: function (id) {
         return this._selectedKey;
      },

      getSelectedIndex: function () {
         return this._selectedIndex;
      },

      setSelectedByHash: function (hash) {
         var elem = this._display.getByHash(hash);
         this.setSelectedIndex(this._display.getIndex(elem));
      },

      _isEmptyIndex: function (index) {
         return index === null || typeof index == 'undefined' || index == -1;
      },

      setSelectedIndex: function (index) {
         if (this._selectedIndex != index) {
            this._selectedIndex = index;
            this._prepareSelectedKeyByIndex(index);
         }
      },

      _notifySelectedItem: function (index, key) {
         this._notify('onSelectedItemChange', index, key);
      },

      _onSelectedItemChange: function() {
         this._updateTplData();
         this._setDirty();
      },

      _displayChangeCallback: function() {
         this._selectedIndex = (this._options.selectedIndex !== undefined && this._options.selectedIndex !== null) ? this._options.selectedIndex : -1;
         this._allowEmptySelection = this._options.allowEmptySelection !== false;
         this._selectedKey = this._options.selectedKey || null;

         if (this._isEmptyIndex(this._selectedIndex)) {
            //Если передали пустой индекс и ключ, определяем индекс по ключу
            this._prepareSelectedIndexByKey(this._selectedKey)
         }
         else {
            //если индекс передали - вычисляем ключ
            this._prepareSelectedKeyByIndex(this._selectedIndex)
         }

         this._applyAllowEmpty();
         Selector.superclass._displayChangeCallback.apply(this, arguments);
      }
   });

   return Selector;
});