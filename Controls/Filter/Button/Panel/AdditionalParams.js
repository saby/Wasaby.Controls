define('Controls/Filter/Button/Panel/AdditionalParams', [
   'Core/Control',
   'WS.Data/Utils',
   'Core/helpers/Object/isEqual',
   'Core/core-clone',
   'wml!Controls/Filter/Button/Panel/AdditionalParams/AdditionalParams',
   'WS.Data/Chain',
   'css!theme?Controls/Filter/Button/Panel/AdditionalParams/AdditionalParams'
], function(Control, Utils, isEqual, Clone, template, Chain) {
   /**
    * Control "Additional params". Used in the filter panel.
    * @class Controls/Filter/Button/Panel/AdditionalParams
    * @extends Core/Control
    * @control
    * @public
    * @author Герасимов А.М.
    *
    * @css @max-height_FilterPanel-items Maximum height of the folded block.
    * @css @font-size_FilterPanel-caption Font size of the header.
    * @css @color_FilterPanel-caption Color of the header.
    * @css @height_FilterPanel-caption Height of the header.
    * @css @margin_AdditionalParams-items Indent to the left of the edge for the elements.
    * @css @color_AdditionalParams-item Color of item in the block.
    * @css @height_AdditionalParams-item Height of item in the block.
    * @css @height_AdditionalParams-arrow Height of the arrow to unfold the block.
    */

   'use strict';

   var MAX_NUMBER_ITEMS = 10;

   var _private = {

      cloneItems: function(items) {
         if (items['[WS.Data/Entity/CloneableMixin]']) {
            return items.clone();
         }
         return Clone(items);
      },

      countItems: function(self, items) {
         var result = 0;
         Chain(items).each(function(elem) {
            if (!self._isItemVisible(elem)) {
               result++;
            }
         });
         return result;
      },

      onResize: function(self) {
         self._arrowVisible = _private.countItems(self, self._options.items) > MAX_NUMBER_ITEMS;

         if (!self._arrowVisible) {
            self._isMaxHeight = true;
         }
         self._forceUpdate();
      }
   };

   var AdditionalParams = Control.extend({
      _template: template,
      _isMaxHeight: true,
      _arrowVisible: false,

      _beforeMount: function(options) {
         this.items = _private.cloneItems(options.items);
      },

      _afterMount: function() {
         _private.onResize(this);
      },

      _afterUpdate: function() {
         if (!isEqual(this.items, this._options.items)) {
            this.items = _private.cloneItems(this._options.items);
            _private.onResize(this);
         }
      },

      _isItemVisible: function(item) {
         return Utils.getItemPropertyValue(item, 'visibility') === undefined ||
            Utils.getItemPropertyValue(item, 'visibility');
      },

      _textValueChangedHandler: function(event, index, textValue) {
         this._options.items[index].textValue = textValue;
         this._notify('itemsChanged', [this._options.items]);
      },

      _valueChangedHandler: function(event, index, value) {
         this._options.items[index].value = value;
         this._options.items[index].visibility = true;
         this._notify('itemsChanged', [this._options.items]);
      },

      _visibilityChangedHandler: function(event, index) {
         this._options.items[index].visibility = true;
         this._notify('itemsChanged', [this._options.items]);
      },

      _clickSeparatorHandler: function() {
         this._isMaxHeight = !this._isMaxHeight;
      }

   });

   AdditionalParams._private = _private;

   return AdditionalParams;
});
