define('Controls/Selector/Container',
   [
      'Core/Control',
      'tmpl!Controls/Selector/Container',
      'Controls/Selector/__ControllerContext',
      'Controls/Container/Data/ContextOptions',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Controls/Controllers/SourceController',
      'Controls/Container/MultiSelector/selectionToRecord',
      'Core/Deferred'
   ],
   
   function(Control, template, ControllerContext, ContextOptions, Chain, Utils, SourceController, selectionToRecord, Deferred) {
      
      'use strict';
      
      var _private = {
         getFilteredItems: function(items, filterFunc) {
            return Chain(items).filter(filterFunc).value();
         },
   
         getKeysByItems: function(items, keyProperty) {
            return Chain(items).reduce(function(result, item) {
               result.push(item.get(keyProperty));
               return result;
            }, []);
         },
   
         getFilterFunction: function(func) {
            return func ? func : function() {
               return true;
            };
         },
         
         getSelectedKeys: function(options, context) {
            var items = _private.getFilteredItems(context.selectorControllerContext.selectedItems, _private.getFilterFunction(options.selectionFilter));
            return _private.getKeysByItems(items, context.dataOptions.keyProperty);
         },
         
         getSourceController: function(source, navigation) {
            return new SourceController({
               source: source,
               navigation: navigation
            });
         },
         
         getEmptyItems: function(currentItems) {
            /* make clone and clear to save items format */
            var emptyItems = currentItems.clone();
            emptyItems.clear();
            return emptyItems;
         },
         
         prepareFilter: function(filter, selection, source) {
            var adapter = source.getAdapter();
            filter.selection = selectionToRecord(selection, adapter);
            return filter;
         },
         
         prepareResult: function(result, selectedKeys, keyProperty) {
            return {
               resultSelection: result,
               initialSelection: selectedKeys,
               keyProperty: keyProperty
            };
         }
         
      };
      
      var Container = Control.extend({
         
         _template: template,
         _selectedKeys: null,
         _selection: null,
         _excludedKeys: null,
         
         _beforeMount: function(options, context) {
            this._selectedKeys = _private.getSelectedKeys(options, context);
            this._excludedKeys = [];
            this._items = context.dataOptions.items;
   
            this._initialSelectedKeys = this._selectedKeys.slice();
         },
         
         _beforeUpdate: function(newOptions, context) {
            var currentSelectedItems = this.context.get('selectorControllerContext').selectedItems;
            var newSelectedItems = context.selectorControllerContext.selectedItems;
            
            if (currentSelectedItems !== newSelectedItems) {
               this._selectedKeys = _private.getSelectedKeys(newOptions, context);
            }
         },
   
         _selectComplete: function() {
            var self = this;
            var loadDef;
            var dataOptions = this.context.get('dataOptions');
            var keyProperty = dataOptions.keyProperty;
            
            function prepareResult(result) {
               return _private.prepareResult(result, self._initialSelectedKeys, keyProperty);
            }
            
            if (this._selectedKeys.length || this._excludedKeys.length) {
               var source = dataOptions.source;
               var sourceController = _private.getSourceController(source, dataOptions.navigation);
               var selection = {
                  selected: this._selectedKeys,
                  excluded: this._excludedKeys
               };
               loadDef = sourceController.load(_private.prepareFilter(Utils.clone(dataOptions.filter), selection, source));
               
               loadDef.addCallback(function(result) {
                  return prepareResult(result);
               });
            } else {
               loadDef = Deferred.success(prepareResult(_private.getEmptyItems(self._items)));
            }
   
            this._notify('selectionLoad', [loadDef], {bubbling: true});
         },
   
         _selectedKeysChanged: function(event, selectedKeys, added, removed) {
            this._notify('selectedKeysChanged', [selectedKeys, added, removed], {bubbling: true});
         }
         
      });
      
      Container.contextTypes = function() {
         return {
            selectorControllerContext: ControllerContext,
            dataOptions: ContextOptions
         };
      };
   
      Container._private = _private;
      
      return Container;
   });
