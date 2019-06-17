import Control = require('Core/Control');
import template = require('wml!Controls/_source/Adapter/SelectedKey/SelectedKey');

/**
 * Container for controls that implement interface {@link Controls/_interface/IMultiSelectable multiSelectable}.
 * Container receives selectedKey option and transfers selectedKeys option to children.
 * Listens for children "selectedKeysChanged" event and notify event "selectedKeyChanged".
 * @class Controls/_source/Adapter/SelectedKey
 * @extends Controls/Control
 * @control
 * @public
 * @author Золотова Э.Е.
 */

var _private = {
   getSelectedKeys: function(selectedKey) {
      return selectedKey === null ? [] : [selectedKey];
   }
};

var Adapter = Control.extend({

   _template: template,
   _selectedKeys: null,

   _beforeMount: function(options) {
      this._selectedKeys = _private.getSelectedKeys(options.selectedKey);
   },

   _beforeUpdate: function(newOptions) {
      if (this._options.selectedKey !== newOptions.selectedKey) {
         this._selectedKeys = _private.getSelectedKeys(newOptions.selectedKey);
      }
   },

   _selectedKeysChanged: function(event, keys) {
      event.stopPropagation();
      var selectedKey = keys.length ? keys[0] : null;
      this._notify('selectedKeyChanged', [selectedKey]);
   }

});

Adapter._private = _private;

export default Adapter;
