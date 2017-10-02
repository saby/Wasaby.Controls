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

      _beforeUpdate: function(newOptions) {
         this._calcSelection(newOptions);
         Selector.superclass._beforeUpdate.apply(this, arguments);
      },

      _displayChangeCallback: function(display, cfg) {
         this._calcSelection(cfg);
         Selector.superclass._displayChangeCallback.apply(this, arguments);
      },

      _calcSelection: function(cfg) {
         if ((cfg.selectedIndex !== this._options.selectedIndex) && !this._isEmptyIndex(cfg.selectedIndex)) { //Новые опции пришли из родителя
            this._selectedIndex = cfg.selectedIndex;
            this._selectedKey = this._getKeyByIndex(this._selectedIndex, cfg);
            this._notify('onChangeSelectedKey', this._selectedKey);
            this._applyAllowEmpty(cfg);
         }
         else {
            if ((cfg.selectedKey !== this._options.selectedKey) && (cfg.selectedKey !== undefined)) { //Новые опции пришли из родителя
               this._selectedKey = cfg.selectedKey;
               this._selectedIndex = this._getItemIndexByKey(this._selectedKey, cfg);
               this._notify('onChangeSelectedIndex', this._selectedIndex);
               this._applyAllowEmpty(cfg);
            }
         }

         if (this._isEmptyIndex(this._selectedIndex)) {
            this._selectedIndex = -1;
            this._selectedKey = undefined;
            this._applyAllowEmpty(cfg);
         }
         else {
            if (this._selectedKey !== undefined) {
               var newIndex = this._getItemIndexByKey(this._selectedKey, cfg);
               if (this._selectedIndex != newIndex) {
                  if (!this._isEmptyIndex(newIndex)) {
                     this._selectedIndex = newIndex;
                     this._notify('onChangeSelectedIndex', this._selectedIndex);
                  }
                  else {
                     this._selectedIndex = this._selectedIndex + 1;
                     this._notify('onChangeSelectedIndex', this._selectedIndex);
                     this._selectedKey = this._getKeyByIndex(this._selectedIndex, cfg);
                     this._notify('onChangeSelectedKey', this._selectedKey);
                  }
               }
            }
            else {
               var newKey = this._getKeyByIndex(this._selectedIndex, cfg);
               if (newKey != this._selectedKey) {
                  this._selectedKey = newKey;
                  this._notify('onChangeSelectedKey', this._selectedKey);
               }
            }
         }
      },

      _applyAllowEmpty: function (cfg) {
         if ((cfg.allowEmptySelection === false) && this._isEmptyIndex(this._selectedIndex)) {
            if (this._display.getCount()) {
               this._selectedIndex = 0;
               this._selectedKey = this._getKeyByIndex(0, cfg);
            }
         }
      },

      _isItemSelected: function(projItem) {
         return this._selectedKey == this._getPropertyValue(projItem.getContents(), this._options.idProperty);
      },

      _getKeyByIndex: function (index, cfg) {
         if (this._hasItemByIndex(index)) {
            var itemContents = this._display.at(index).getContents();
            return ItemsUtil.getPropertyValue(itemContents, cfg.idProperty);
         }
         else {
            return null
         }
      },

      _getItemIndexByKey: function (id, cfg) {
         var projItem = ItemsUtil.getItemById(this._display, id, cfg.idProperty);
         return this._display.getIndex(projItem);
      },

      _hasItemByIndex: function (index) {
         return (typeof index != 'undefined') && (index !== null) && (typeof this._display.at(index) != 'undefined');
      },

      _setSelectedByHash: function (hash) {
         var elem = this._display.getByHash(hash);
         this._selectedIndex = this._display.getIndex(elem);
         this._selectedKey = this._getKeyByIndex(this._selectedIndex, this._options);
         this._notify('onChangeSelectedIndex', this._selectedIndex);
         //TODO: иначе никак не получить содержимое элемента
         this._notify('onChangeSelectedKey', this._selectedKey, elem);
      },

      _isEmptyIndex: function (index) {
         return index === null || typeof index == 'undefined' || index == -1;
      },

      _notifySelectedItem: function (index, key) {
         this._notify('onSelectedItemChange', index, key);
      },

      _onSelectedItemChange: function() {
         this._forceUpdate();
      }
   });

   return Selector;
});