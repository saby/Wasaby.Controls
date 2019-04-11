define('Controls/Selector/Button/_SelectorButton', [
   'Core/Control',
   'wml!Controls/Selector/Button/_SelectorButton',
   'wml!Controls/Selector/Button/itemTemplate',
   'css!theme?Controls/Selector/Button/SelectorButton'
], function(Control, template, itemTemplate) {
   'use strict';

   var SelectorButton = Control.extend({
      _template: template,

      _open: function() {
         this._notify('showSelector');
      },

      _reset: function() {
         this._notify('updateItems', [[]]);
      },

      _crossClick: function(event, item) {
         this._notify('removeItem', [item]);
      },

      _itemClickHandler: function(item) {
         if (this._options.multiSelect) {
            this._notify('itemClick', [item]);
         } else if (!this._options.readOnly) {
            this._open();
         }
      },

      _openInfoBox: function(event, config) {
         config.maxWidth = this._container.offsetWidth;
      },
   });

   SelectorButton.getDefaultOptions = function() {
      return {
         style: 'secondary',
         maxVisibleItems: 7,
         itemTemplate: itemTemplate
      };
   };

   return SelectorButton;
});
