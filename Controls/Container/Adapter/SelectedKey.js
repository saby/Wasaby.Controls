define('Controls/Container/Adapter/SelectedKey',
   [
      'Core/Control',
      'wml!Controls/Container/Adapter/SelectedKey/SelectedKey'
   ],

   /**
    * Container for controls that implement interface {@link Controls/interface/IMultiSelectable multiSelectable}.
    * Container receives selectedKey option and transfers selectedKeys option to children.
    * Listens for children "selectedKeysChanged" event and notify event "selectedKeyChanged".
    * @class Controls/Container/Adapter/SelectedKey
    * @extends Controls/Control
    * @control
    * @public
    * @author Золотова Э.Е.
    */

   function(Control, template) {

      'use strict';

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
            this._selectedKeys = keys;
            event.stopPropagation();
            var selectedKey = keys.length ? keys[0] : null;
            this._notify('selectedKeyChanged', [selectedKey]);
         }

      });

      Adapter._private = _private;

      return Adapter;
   });
