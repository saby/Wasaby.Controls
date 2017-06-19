define('js!WSControls/Controllers/RecordsetListSelector', [
   'js!WSControls/Controllers/BaseListSelector'
], function(BaseListSelector) {
   var RecordsetListSelector = BaseListSelector.extend({
      constructor: function(cfg) {
         RecordsetListSelector.superclass.constructor.apply(this, arguments);
         /*Распихивание данных*/
         this._options['selectedKey'] = cfg.selectedKey || null;
         this.selectedKey = this._options.selectedKey;
         this._prepareBothSelectedConfig(this.selectedIndex, this.selectedKey)
      },

      _prepareBothSelectedConfig: function(index, key) {
         if (this.projection) {
            //Вычисляем индекс или по ключ по известному другому параметру, в приоритете индекс
            if (this._isEmptyIndex(index)) {
               //Если передали пустой индекс и ключ, определяем индекс по ключу
               this._prepareSelectedIndexByKey(key)
            }
            else {
               //если индекс передали - вычисляем ключ
               this._prepareSelectedKeyByIndex(index)
            }
         }
      },

      _prepareSelectedIndexByKey: function(key) {
         //Вычисляем индекс по известному ключу
         if (this.projection) {
            if (typeof key === 'undefined') {
               this.selectedIndex = -1;
            }
            else {
               this.selectedIndex = this._getItemIndexByKey(key);
            }
            this._prepareOtherSelectedConfig();
         }
      },

      _prepareSelectedKeyByIndex: function(index) {
         //Вычисляем ключ по известному индексу
         if (this.projection) {
            if (this._isEmptyIndex(index)) {
               this.selectedKey = null;
            }
            else {
               this.selectedKey = this._getKeyByIndex(this.selectedIndex);
            }
            this._prepareOtherSelectedConfig();
         }
      },

      _getKeyByIndex: function(index) {
         if(this._hasItemByIndex(index)) {
            var itemContents = this.projection.at(index).getContents();
            return itemContents.getId();
         }
      },

      _getItemIndexByKey: function(id) {
         var recordset = this.projection.getCollection();
         var projItem = this.projection.getItemBySourceItem(recordset.getRecordById(id));
         return this.projection.getIndex(projItem);
      },

      _hasItemByIndex: function(index) {
         return (typeof index != 'undefined') && (index !== null) && (typeof this.projection.at(index) != 'undefined');
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