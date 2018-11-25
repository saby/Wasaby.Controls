define('Controls/Selector/List/Container',
   [
      'Core/Control',
      'tmpl!Controls/Selector/List/Container',
      'Controls/Utils/Toolbar'
   ],
   
   function(Control, template, Toolbar) {
      
      'use strict';
   
      var ACTION_ID = 'selector.action';
      var ACTION_TITLE = rk('Выбрать');
      var ACTION = {
         id: ACTION_ID,
         title: ACTION_TITLE,
         showType: Toolbar.showType.TOOLBAR
      };
      
      var _private = {
         getItemClickResult: function(itemKey, selectedKeys, multiSelect) {
            var added = [];
            var removed = [];
            var itemIndex = selectedKeys.indexOf(itemKey);
            selectedKeys = selectedKeys.slice();
   
            if (itemIndex === -1) {
               if (!multiSelect && selectedKeys.length) {
                  removed.push(selectedKeys[0]);
                  selectedKeys.splice(0, 1);
               }
               
               selectedKeys.push(itemKey);
               added.push(itemKey);
            } else {
               selectedKeys.splice(itemIndex, 1);
               removed.push(itemKey);
            }
            
            return [selectedKeys, added, removed];
         },
   
         selectItem: function(self, itemClickResult) {
            self._notify('listSelectedKeysChanged', itemClickResult, {bubbling: true});
            self._notify('selectComplete', [true], {bubbling: true});
         },
   
         selectionChanged: function(self, itemClickResult) {
            self._notify('listSelectedKeysChanged', itemClickResult, {bubbling: true});
         },
   
         getItemActions: function(options) {
            var itemActions = options.itemActions || [];
            
            if (options.selectionType !== 'leaf') {
               itemActions = itemActions.concat(ACTION);
            }
            
            return itemActions;
         },
         
         getItemActionVisibilityCallback: function(options) {
            return function(action, item) {
               var showByOptions;
               var showByItemType;
               
               if (action.id === ACTION_ID) {
                  showByOptions = !options.multiSelect || !options.selectedKeys.length;
                  showByItemType = options.selectionType === 'node' ? true : item.get(options.nodeProperty);
                  return showByOptions && showByItemType;
               } else {
                  return options.itemActionVisibilityCallback ? options.itemActionVisibilityCallback(action, item) : true;
               }
            };
         },
   
         itemClick: function(self, itemKey, multiSelect, selectedKeys) {
            var itemClickResult = _private.getItemClickResult(itemKey, selectedKeys, multiSelect);
            
            if (!multiSelect || !selectedKeys.length) {
               _private.selectItem(self, itemClickResult);
            } else {
               _private.selectionChanged(self, itemClickResult);
            }
         }
      };
      
      var Container = Control.extend({
         
         _template: template,
         _ignoreItemClickEvent: false,
         _selectedKeys: null,
         _markedKey: null,
         _itemsActions: null,
         
         constructor: function(options) {
            this._itemActionsClick = this._itemActionsClick.bind(this);
            Container.superclass.constructor.call(this, options);
         },
         
         _beforeMount: function(options) {
            this._selectedKeys = options.selectedKeys;
   
            if (this._selectedKeys.length === 1) {
               this._markedKey = this._selectedKeys[0];
            }
            
            this._itemActions = _private.getItemActions(options);
            this._itemActionVisibilityCallback = _private.getItemActionVisibilityCallback(options);
         },
         
         _beforeUpdate: function(newOptions) {
            var selectionTypeChanged = newOptions.selectionType !== this._options.selectionType;
            var selectedKeysChanged = newOptions.selectedKeys !== this._options.selectedKeys;
            
            if (selectedKeysChanged) {
               this._selectedKeys = newOptions.selectedKeys;
            }
            
            if (selectedKeysChanged || selectionTypeChanged) {
               this._itemActionVisibilityCallback = _private.getItemActionVisibilityCallback(newOptions);
            }
            
            if (newOptions.itemActions !== this._options.itemActions || selectionTypeChanged) {
               this._itemActions = _private.getItemActions(newOptions);
            }
         },
         
         _beforeUnmount: function() {
            this._itemActions = null;
            this._visibilityCallback = null;
            this._itemActionsClick = null;
            this._selectedKeys = null;
         },
         
         _itemClick: function(event, item) {
            if (!this._ignoreItemClickEvent && !item.get(this._options.nodeProperty)) {
               _private.itemClick(this, item.get(this._options.keyProperty), this._options.multiSelect, this._options.selectedKeys);
            }
            this._ignoreItemClickEvent = false;
         },
         
         _checkboxClick: function() {
            this._ignoreItemClickEvent = true;
         },
   
         _itemActionsClick: function(event, action, item) {
            if (action.id === 'selector.action') {
               var itemClickResult = _private.getItemClickResult(item.get(this._options.keyProperty), this._options.selectedKeys, this._options.multiSelect);
               _private.selectItem(this, itemClickResult);
            }
         }
         
      });
   
      Container._private = _private;
   
      Container.getDefaultOptions = function getDefaultOptions() {
         return {
            selectionType: 'all'
         };
      };
      
      return Container;
      
   });
