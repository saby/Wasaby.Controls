define('Controls/Selector/SelectedCollection/Popup',
   [
      'Core/Control',
      'wml!Controls/Selector/SelectedCollection/Popup',
      'css!theme?Controls/Popup/Opener/InfoBox/InfoBox',
      'css!theme?Controls/Popup/Opener/Previewer/PreviewerController'
   ],

   function(Control, template) {
      'use strict';

      var itemHiddenTemplate = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            // Clone in order to delete items from the list when clicking on the cross.
            this._items = options.items.clone();
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
