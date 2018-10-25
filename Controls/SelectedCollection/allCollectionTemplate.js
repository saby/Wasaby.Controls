define('Controls/SelectedCollection/allCollectionTemplate',
   [
      'Core/Control',
      'wml!Controls/SelectedCollection/allCollectionTemplate'
   ],

   function(Control, template) {
      'use strict';

      var itemHiddenTemplate = Control.extend({
         _template: template,

         _itemClick: function(event, item) {
            this._notify('sendResult', ['itemClick', item]);
         },

         _crossClick: function(event, item) {
            this._notify('sendResult', ['crossClick', item]);
         },

         _mouseOutHandler: function() {
            this._notify('close');
         }
      });

      return itemHiddenTemplate;
   });
