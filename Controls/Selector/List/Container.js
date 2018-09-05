define('Controls/Selector/List/Container',
   [
      'Core/Control',
      'tmpl!Controls/Selector/List/Container'
   ],
   
   function(Control, template) {
      
      'use strict';
      
      var _private = {
         getItemClickResult: function(itemKey, selectedKeys) {
            var added = [];
            var removed = [];
            var itemIndex = selectedKeys.indexOf(itemKey);
   
            if (itemIndex === -1) {
               selectedKeys.push(itemKey);
               added.push(itemKey);
            } else {
               selectedKeys.splice(itemIndex, 1);
               removed.push(itemKey);
            }
            
            return [selectedKeys, added, removed];
         },
         
         itemClickEmptySelection: function(self, itemKey) {
            self._notify('selectionChange', [{
               selected: [itemKey],
               excluded: []
            }], {bubbling: true});
            self._notify('selectComplete', [], {bubbling: true});
         },
         
         resolveOptions: function(self, options) {
            self._selectedKeys = options.selectedKeys;
   
            if (self._selectedKeys.length === 1) {
               self._markedKey = self._selectedKeys[0];
            }
         },
   
         itemClick: function(self, itemKey, multiSelect, selectedKeys) {
            if (multiSelect) {
               if (selectedKeys.length) {
                  self._notify('listSelectionChange', _private.getItemClickResult(itemKey, selectedKeys), {bubbling: true});
               } else {
                  _private.itemClickEmptySelection(self, itemKey);
               }
            } else {
               _private.itemClickEmptySelection(self, itemKey);
            }
         }
      };
      
      var Controller = Control.extend({
         
         _template: template,
         _ignoreItemClickEvent: false,
         _selectedKeys: null,
         _markedKey: null,
         
         _beforeMount: function(options) {
            _private.resolveOptions(this, options);
         },
         
         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys !== this._options.selectedKeys)  {
               this._selectedKeys = newOptions.selectedKeys;
            }
         },
         
         _itemClick: function(event, item) {
            var itemKey;
            
            if (!this._ignoreItemClickEvent) {
               itemKey = item.get(this._options.keyProperty);
               _private.itemClick(this, itemKey, this._options.multiSelect, this._selectedKeys);
            }
            this._ignoreItemClickEvent = false;
         },
         
         _checkboxClick: function() {
            this._ignoreItemClickEvent = true;
         }
         
      });
      
      Controller._private = _private;
      
      return Controller;
      
   });
