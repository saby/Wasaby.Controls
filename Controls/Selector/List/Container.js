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
            selectedKeys = selectedKeys.slice();
   
            if (itemIndex === -1) {
               selectedKeys.push(itemKey);
               added.push(itemKey);
            } else {
               selectedKeys.splice(itemIndex, 1);
               removed.push(itemKey);
            }
            
            return [selectedKeys, added, removed];
         },
         
         itemClickEmptySelection: function(self, itemClickResult) {
            self._notify('listSelectionChange', itemClickResult, {bubbling: true});
            self._notify('selectComplete', [], {bubbling: true});
         },
         
         itemClickWithSelection: function(self, itemClickResult) {
            self._notify('listSelectionChange', itemClickResult, {bubbling: true});
         },
         
         resolveOptions: function(self, options) {
            self._selectedKeys = options.selectedKeys;
   
            if (self._selectedKeys.length === 1) {
               self._markedKey = self._selectedKeys[0];
            }
         },
   
         itemClick: function(self, itemKey, multiSelect, selectedKeys) {
            var itemClickResult = _private.getItemClickResult(itemKey, selectedKeys);
            
            if (!multiSelect || !selectedKeys.length) {
               _private.itemClickEmptySelection(self, itemClickResult);
            } else {
               _private.itemClickWithSelection(self, itemClickResult);
            }
         }
      };
      
      var Container = Control.extend({
         
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
   
      Container._private = _private;
      
      return Container;
      
   });
