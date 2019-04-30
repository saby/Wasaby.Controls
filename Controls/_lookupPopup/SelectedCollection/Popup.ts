import Control = require('Core/Control');
import template = require('wml!Controls/_lookupPopup/SelectedCollection/Popup');
import 'css!theme?Controls/popup';

/**
 *
 * Control _lookupPopup/List/Container.ts
 *
 * @class Controls/_lookupPopup/SelectedCollection/Popup
 * @extends Core/Control
 * @control
 * @public
 * @author Kraynov D.
 */

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

      export = itemHiddenTemplate;

