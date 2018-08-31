define('Controls/Selector/List/Container',
   [
      'Core/Control',
      'tmpl!Controls/Selector/List/Container'
   ],
   
   function(Control, template) {
      
      'use strict';
      
      var _private = {
         itemClick: function(self, item) {
            var added = [];
            var removed = [];
            var itemId = item.get(self._options.keyProperty);
            var itemIndex = self._selectedKeys.indexOf(itemId);
   
            self._selectedKeys = self._selectedKeys.slice();
            
            if (itemIndex === -1) {
               self._selectedKeys.push(itemId);
               added.push(itemId);
            } else {
               self._selectedKeys.splice(itemIndex, 1);
               removed.push(itemId);
            }
   
            self._notify('listSelectionChange', [self._selectedKeys, added, removed], {bubbling: true});
         },
         
         itemClickEmptySelection: function(self, item) {
            self._notify('selectionChange', [{
               selected: [item.get(self._options.keyProperty)],
               excluded: []
            }], {bubbling: true});
            self._notify('selectComplete', [], {bubbling: true});
         }
      };
      
      var Controller = Control.extend({
         
         _template: template,
         _ignoreItemClickEvent: false,
         _selectedKeys: null,
         
         _beforeMount: function(options) {
            this._selectedKeys = options.selectedKeys;
         },
         
         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys !== this._options.selectedKeys)  {
               this._selectedKeys = newOptions.selectedKeys;
            }
         },
         
         _itemClick: function(event, item) {
            if (!this._ignoreItemClickEvent) {
               if (this._options.multiSelect) {
                  if (this._selectedKeys.length) {
                     _private.itemClick(this, item);
                  } else {
                     _private.itemClickEmptySelection(this, item);
                  }
               } else {
                  _private.itemClickEmptySelection(this, item);
               }
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
