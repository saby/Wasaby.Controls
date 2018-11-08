define('Controls/Button/SelectorButton/_SelectorButton', [
   'Core/Control',
   'wml!Controls/Button/SelectorButton/_SelectorButton/_SelectorButton',
   'Core/core-merge',
   'WS.Data/Chain',
   'css!Controls/Button/SelectorButton/_SelectorButton/_SelectorButton'
], function(Control, template, cMerge, Chain) {
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

      _beforeMount: function() {
         this._onResult = this._onResult.bind(this);
      },

      _getItemsInArray: function() {
         return Chain(this._options.items).value();
      },

      _open: function() {
         var tplOptions = {
            selectedItems: this._options.items,
            multiSelect: this._options.multiSelect
         };
         cMerge(tplOptions, this._options.templateOptions);
         this._children.selectorOpener.open({
            templateOptions: tplOptions,
            template: this._options.templateName,
            target: this._children.link
         });
      },

      _onResult: function(result) {
         this._notify('updateItems', [result]);
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
