define('js!WSControls/Controllers/BaseListSelector', [
   'js!WS.Data/Utils',
   'js!WS.Data/Collection/IBind',
   'Core/core-instance',
   'Core/Abstract'
], function(Utils, IBindCollection, cInstance, Abstract) {
   var BaseListSelector = Abstract.extend({
      _useNativeAsMain: true,
      constructor: function(cfg) {
         BaseListSelector.superclass.constructor.apply(this, arguments);
         this._prepareData(cfg);
         this._allowEmptyApply();
         this._publish('onSelectedItemChange');
      },

      _prepareData: function(cfg) {
         this._options = {
            selectedIndex : cfg.selectedIndex,
            allowEmptySelection : cfg.allowEmptySelection,
            projection: cfg.projection
         };
         this.selectedIndex = (this._options.selectedIndex !== undefined && this._options.selectedIndex !== null) ? this._options.selectedIndex : -1;
         this.allowEmptySelection = (this._options.allowEmptySelection !== undefined && this._options.allowEmptySelection !== null) ? this._options.allowEmptySelection: true;
      },

      _allowEmptyApply: function() {
         if (!this.allowEmptySelection && this._isEmptyIndex(this.selectedIndex)) {
            if (this._options.projection.getCount()) {
               this.setSelectedIndex(0)
            }
         }
      },

      setSelectedIndex: function(index) {
         this.selectedIndex = index;
         this._notifySelectedItem(index);
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

      _notifySelectedItem : function(index) {
         this._notify('onSelectedItemChange', index);
      }
   });
   return BaseListSelector;
});