define('js!WSControls/Controllers/ListSelector', [
   'Core/Abstract',
   'js!WSControls/Lists/resources/utils/ItemsUtil'
], function(Abstract, ItemsUtil) {
   var ListSelector;
   ListSelector = Abstract.extend({
      _useNativeAsMain: true,
      constructor: function (cfg) {
         ListSelector.superclass.constructor.apply(this, arguments);
         this._prepareData(cfg);
         this._applyAllowEmpty();
         this._publish('onSelectedItemChange');
      },

      _prepareData: function (cfg) {
         this._options = {
            selectedIndex: cfg.selectedIndex,
            allowEmptySelection: cfg.allowEmptySelection,
            selectedKey: cfg.selectedKey,
            projection: cfg.projection,
            idProperty: cfg.idProperty

         };
         this._selectedIndex = (this._options.selectedIndex !== undefined && this._options.selectedIndex !== null) ? this._options.selectedIndex : -1;
         this.allowEmptySelection = this._options.allowEmptySelection !== false;
         this._selectedKey = this._options.selectedKey || null;

         if (this._isEmptyIndex(this._selectedIndex)) {
            //Если передали пустой индекс и ключ, определяем индекс по ключу
            this._prepareSelectedIndexByKey(this._selectedKey)
         }
         else {
            //если индекс передали - вычисляем ключ
            this._prepareSelectedKeyByIndex(this._selectedIndex)
         }
      },

      _applyAllowEmpty: function () {
         if (!this.allowEmptySelection && this._isEmptyIndex(this._selectedIndex)) {
            if (this._options.projection.getCount()) {
               this.setSelectedIndex(0)
            }
         }
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
            var itemContents = this._options.projection.at(index).getContents();
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
         var projItem = ItemsUtil.getItemById(this._options.projection, id, this._options.idProperty);
         return this._options.projection.getIndex(projItem);
      },

      _hasItemByIndex: function (index) {
         return (typeof index != 'undefined') && (index !== null) && (typeof this._options.projection.at(index) != 'undefined');
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
         var elem = this._options.projection.getByHash(hash);
         this.setSelectedIndex(this._options.projection.getIndex(elem));
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
      }
   });
   return ListSelector;
});