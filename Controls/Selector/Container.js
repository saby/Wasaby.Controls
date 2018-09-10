define('Controls/Selector/Container',
   [
      'Core/Control',
      'tmpl!Controls/Selector/Container',
      'Controls/Selector/__ControllerContext',
      'Controls/Container/Data/ContextOptions',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Controls/Controllers/SourceController',
      'Controls/Container/MultiSelector/selectionToRecord'
   ],
   
   function(Control, template, ControllerContext, ContextOptions, Chain, Utils, SourceController, selectionToRecord) {
      
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
            if (this._selectedKeys.length || this._excludedKeys.length) {
               var self = this;
               var dataOptions = this.context.get('dataOptions');
               var source = dataOptions.source;
               var sourceController = _private.getSourceController(source, dataOptions.navigation);
               var selection = {
                  selected: this._selectedKeys,
                  excluded: this._excludedKeys
               };
               var loadDef = sourceController.load(_private.prepareFilter(Utils.clone(dataOptions.filter), selection, source));
               
               loadDef.addCallback(function(result) {
                  return _private.prepareResult(result, self._initialSelectedKeys, dataOptions.keyProperty);
               });
               this._notify('selectionLoad', [loadDef], {bubbling: true});
            }
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
