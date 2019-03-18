define('Controls/Selector/SelectedCollection/Popup',
   [
      'Core/Control',
      'wml!Controls/Selector/SelectedCollection/Popup',
      'Types/collection',
      'css!theme?Controls/Popup/Opener/InfoBox/InfoBox',
      'css!theme?Controls/Popup/Opener/Previewer/PreviewerController'
   ],

   function(Control, template, collection) {
      'use strict';

      var itemHiddenTemplate = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            // support type array for options.items
            if (options.items instanceof Array) {
               this._items = new collection.List({
                  items: options.items
               });
            } else {
               this._items = options.items.clone();
            }
         },

         _itemClick: function(event, item) {
            this._options.clickCallback('itemClick', item);
            this._notify('close', [], {bubbling: true});
         },

         _crossClick: function(event, item) {
            this._items.remove(item);
            this._options.clickCallback('crossClick', item);
         }
      });

      return itemHiddenTemplate;
   });
