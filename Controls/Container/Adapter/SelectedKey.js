define('Controls/Container/Adapter/SelectedKey',
   [
      'Core/Control',
      'wml!Controls/Container/Adapter/SelectedKey/SelectedKey'
   ],

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
