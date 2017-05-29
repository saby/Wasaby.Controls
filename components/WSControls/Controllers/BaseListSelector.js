define('js!WSControls/Controllers/BaseListSelector', [
   'js!WS.Data/Utils',
   'js!WS.Data/Collection/IBind',
   'Core/core-instance',
   'Core/Abstract'
], function(Utils, IBindCollection, cInstance, Abstract) {
   var BaseListSelector = Abstract.extend({
      _useNativeAsMain: true,
      constructor: function(cfg) {

         /*Распихивание данных*/
         this._options = {
            selectedIndex : (cfg.selectedIndex !== undefined && cfg.selectedIndex !== null) ? cfg.selectedIndex : -1,
            allowEmptySelection : (cfg.allowEmptySelection !== undefined && cfg.allowEmptySelection !== null) ? cfg.allowEmptySelection : true,
            projection: cfg.projection || null
         };
         this.selectedIndex = this._options.selectedIndex;
         this.projection = this._options.projection;
         this.allowEmptySelection = this._options.allowEmptySelection;

         this._prepareOtherSelectedConfig();

         //TODO
         BaseListSelector.superclass.constructor.apply(this, arguments);
         this._publish('onSelectedItemChange');
      },

      setSelectedIndex: function(index) {
         this.selectedIndex = index;
         this._notifySelectedItem(index);
      },

      getSelectedIndex : function() {
         return this.selectedIndex;
      },

      setSelectedByHash: function(hash) {
         if (this.projection) {
            var elem = this.projection.getByHash(hash);
            this.setSelectedIndex(this.projection.getIndex(elem));
         }
      },

      _isEmptyIndex: function(index) {
         return index === null || typeof index == 'undefined' || index == -1;
      },

      _notifySelectedItem : function(index) {
         this._notify('onSelectedItemChange', index);
      },

      _prepareOtherSelectedConfig: function() {
         if (this.projection) {
            //если после всех манипуляций выше индекс пустой, но задана опция, что пустое нельзя - выбираем первое
            if (!this.allowEmptySelection && this._isEmptyIndex(this.selectedIndex)) {
               if (this.projection.getCount()) {
                  this.selectedIndex = 0;
               }
            }
         }
      }
   });
   return BaseListSelector;
});