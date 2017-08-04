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
               this._selectedIndex = 0;
               this._prepareSelectedKeyByIndex();
            }
         }
      },

      _isItemSelected: function(projItem) {
         return this._selectedKey == this._getPropertyValue(projItem.getContents(), this._options.idProperty);
      },

      _prepareSelectedIndexByKey: function (key) {
         //Вычисляем индекс по известному ключу
         this._selectedIndex = this._getItemIndexByKey(key);
         this._applyAllowEmpty();
      },

      _prepareSelectedKeyByIndex: function () {
         //Вычисляем ключ по известному индексу
         this._selectedKey = this._getKeyByIndex(this._selectedIndex);
         this._applyAllowEmpty();
      },

      _onItemClick: function(e, displayItem) {
         this._setSelectedByHash(displayItem.getHash());
         this._onSelectedItemChange();
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

      _setSelectedByHash: function (hash) {
         var elem = this._display.getByHash(hash);
         this._selectedIndex = this._display.getIndex(elem);
         this._prepareSelectedKeyByIndex()
      },

      _isEmptyIndex: function (index) {
         return index === null || typeof index == 'undefined' || index == -1;
      },

      _notifySelectedItem: function (index, key) {
         this._notify('onSelectedItemChange', index, key);
      },

      _onSelectedItemChange: function() {
         this._setDirty();
      },

      _displayChangeCallback: function(display, cfg) {
         //TODO жду жизненного цикла и понимания, как сказать родителю об изменении состояния пока тут г-код
         this._selectedIndex = this._isEmptyIndex(this._selectedIndex) ? (this._isEmptyIndex(cfg.selectedIndex) ? -1 : cfg.selectedIndex) : this._selectedIndex;
         this._allowEmptySelection = cfg.allowEmptySelection || cfg.allowEmptySelection !== false;
         this._selectedKey = this._selectedKey || cfg.selectedKey || null;

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