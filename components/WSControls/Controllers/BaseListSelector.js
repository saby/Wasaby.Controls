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
            selectedIndex : cfg.selectedIndex || null,
            allowEmptySelection : cfg.allowEmptySelection || true,
            projection: cfg.projection || null
         };
         this.selectedIndex = this._options.selectedIndex;

         //TODO
         BaseListSelector.superclass.constructor.apply(this, arguments);
         this._publish('onSelectedItemChange');
      },

      setSelectedIndex: function(index) {
         this.selectedIndex = index;
         this._notifySelectedItem(index);

         this._prepareSelectedKeyByIndex(index);
         if (this._getItemsProjection()) {
            this._selectInProjection();
         }
      },

      getSelectedIndex : function() {
         return this._options.selectedIndex;
      },

      _isEmptyIndex: function(index) {
         return index === null || typeof index == 'undefined' || index == -1;
      },

      _notifySelectedItem : function(index) {
         this._notifyOnPropertyChanged('selectedIndex');
         this._notify('onSelectedItemChange', index);
      }
   });
   return BaseListSelector;
});