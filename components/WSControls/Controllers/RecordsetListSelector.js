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
               this._options.selectedIndex = -1;
            }
            else {
               this._options.selectedIndex = this._getItemIndexByKey(key);
            }
            this._prepareOtherSelectedConfig();
         }
      },

      _prepareSelectedKeyByIndex: function(index) {
         //Вычисляем ключ по известному индексу
         if (this.projection) {
            if (this._isEmptyIndex(index)) {
               this._options.selectedKey = null;
            }
            else {
               this._options.selectedKey = this._getKeyByIndex(this._options.selectedIndex);
            }
            this._prepareOtherSelectedConfig();
         }
      },

      _prepareOtherSelectedConfig: function() {
         if (this.projection) {
            //если после всех манипуляций выше индекс пустой, но задана опция, что пустое нельзя - выбираем первое
            if (!this.allowEmptySelection && this._isEmptyIndex(this.selectedIndex)) {
               if (this.projection.getCount()) {
                  this.selectedIndex = 0;
                  this.selectedKey = this._getKeyByIndex(this._options.selectedIndex);
               }
            }
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
      }
   });
   return RecordsetListSelector;
});