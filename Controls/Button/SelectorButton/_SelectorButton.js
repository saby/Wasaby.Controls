define('Controls/Button/SelectorButton/_SelectorButton', [
   'Core/Control',
   'wml!Controls/Button/SelectorButton/_SelectorButton',
   'WS.Data/Chain',
   'css!Controls/Button/SelectorButton/SelectorButton'
], function(Control, template, Chain) {
   'use strict';

   /**
    * Button link with the specified text, on clicking on which a selection window opens.
    *
    * @class Controls/Button/SelectorButton/_SelectorButton
    * @extends Core/Control
    * @control
    * @public
    *
    * @css @spacing_SelectorButton-between-buttonMore-buttonReset Spacing between button more and button reset.
    */

   var SelectorButton = Control.extend({
      _template: template,

      _getItemsInArray: function() {
         return Chain(this._options.items).value();
      },

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
         if (!this._options.multiSelect) {
            this._open();
         } else {
            this._notify('itemClick', [item]);
         }
      }
   });

   SelectorButton.getDefaultOptions = function() {
      return {
         style: 'info',
         maxVisibleItems: 7
      };
   };

   return SelectorButton;
});
