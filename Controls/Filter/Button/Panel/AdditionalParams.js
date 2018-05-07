define('Controls/Filter/Button/Panel/AdditionalParams', [
   'Core/Control',
   'WS.Data/Utils',
   'Core/helpers/Object/isEqual',
   'Core/core-clone',
   'tmpl!Controls/Filter/Button/Panel/AdditionalParams/AdditionalParams',
   'css!Controls/Filter/Button/Panel/AdditionalParams/AdditionalParams'
], function(Control, Utils, isEqual, clone, template) {

   'use strict';

   var MAX_NUMBER_ITEMS = 10;
   var getPropValue = Utils.getItemPropertyValue.bind(Utils);

   var _private = {

      countItems: function(items) {
         var result = 0;
         for (var i in items) {
            if (!getPropValue(items[i], 'visibility')) {
               result++;
            }
         }
         return result;
      },

      onResize: function(self) {
         if (_private.countItems(self._options.items) > MAX_NUMBER_ITEMS) {
            self._arrowVisible = true;
            self._children.items.classList.add('controls-AdditionalParams_maxHeight');
         } else if (_private.countItems(self._options.items) <= MAX_NUMBER_ITEMS) {
            self._arrowVisible = false;
            self._isMaxHeight = false;
            self._children.items.classList.remove('controls-AdditionalParams_maxHeight');
         }
         self._forceUpdate();
      }
   };

   var AdditionalParams = Control.extend({
      _template: template,
      _isMaxHeight: false,
      _arrowVisible: false,

      _beforeMount: function(options) {
         this.items = clone(options.items);
      },

      _afterMount: function() {
         _private.onResize(this);
      },

      _afterUpdate: function() {
         if (!isEqual(this.items, this._options.items)) {
            this.items = clone(this._options.items);
            _private.onResize(this);
         }
      },

      _clickItemHandler: function(event, index) {
         this._options.items[index].visibility = true;
         this._notify('valueChanged');
         _private.onResize(this);
      },

      _valueChangedHandler: function(event, index, value) {
         this._options.items[index].value = value;
         this._options.items[index].visibility = true;
         this._notify('valueChanged');
         _private.onResize(this);
      },

      _clickSeparatorHandler: function() {
         this._isMaxHeight = !this._isMaxHeight;
         this._children.items.classList.toggle('controls-AdditionalParams_maxHeight');
      }

   });

   return AdditionalParams;

});
