define('Controls/Button/SelectorButton/itemHiddenTemplate',
   [
      'Core/Control',
      'wml!Controls/Button/SelectorButton/itemHiddenTemplate'
   ],

   function(Control, template) {
      'use strict';

      var itemHiddenTemplate = Control.extend({
         _template: template,

         _itemClick: function(event, item) {
            this._notify('sendResult', [item, 'itemClick']);
         },

         _crossClick: function(event, item) {
            this._notify('sendResult', [item, 'crossClick']);
         },

         _mouseOutHandler: function() {
            this._notify('close');
         }
      });

      return itemHiddenTemplate;
   });
