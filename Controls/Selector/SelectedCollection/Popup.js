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

         _itemClick: function(event, item) {
            this._options.clickCallback('itemClick', item);
         },

         _crossClick: function(event, item) {
            this._options.clickCallback('crossClick', item);
         }
      });

      return itemHiddenTemplate;
   });
