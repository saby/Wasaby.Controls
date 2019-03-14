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

      var CLICKABLE_CLASS = 'controls-SelectedCollection__item__caption-clickable';

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

         _itemClick: function(event, item, mouseEvent) {
            this._options.clickCallback('itemClick', item, mouseEvent);

            // If the items are clickable, close the pop-up when click on a collection item
            if ([].indexOf.call(mouseEvent.target.classList, CLICKABLE_CLASS) !== -1) {
               this._notify('close', [], {bubbling: true});
            }
         },

         _crossClick: function(event, item, mouseEvent) {
            this._items.remove(item);
            this._options.clickCallback('crossClick', item, mouseEvent);
         }
      });

      return itemHiddenTemplate;
   });
