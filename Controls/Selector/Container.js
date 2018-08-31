define('Controls/Selector/Container',
   [
      'Core/Control',
      'tmpl!Controls/Selector/Container',
      'Controls/Selector/__Context',
      'Controls/Container/Data/ContextOptions',
      'WS.Data/Chain',
      'WS.Data/Utils',
      'Controls/Controllers/SourceController',
      'Controls/Container/MultiSelector/selectionToRecord'
   ],
   
   function(Control, template, SelectorContext, ContextOptions, Chain, Utils, SourceController, selectionToRecord) {
      
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
            var items = _private.getFilteredItems(context.controllerContext.selectedItems, _private.getFilterFunction(options.selectionFilter));
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
         
         _beforeMount: function(options, context) {
            this._selectedKeys = _private.getSelectedKeys(options, context);
            this._items = context.dataOptions.items;
         },
         
         _beforeUpdate: function(newOptions, context) {
            var currentSelectedItems =  context.controllerContext.selectedItems;
            
            if (currentSelectedItems !== this._options.selectedItems) {
               this._selectedKeys = _private.getSelectedKeys(newOptions, context);
            }
         },
   
         _selectionChange: function(event, selection) {
            this._selection = selection;
            this._notify('selectionChange', [selection], {bubbling: true});
         },
   
         _selectComplete: function() {
            if (this._selection) {
               var self = this;
               var dataOptions = this.context.get('dataOptions');
               var source = dataOptions.source;
               var sourceController = _private.getSourceController(source, dataOptions.navigation);
               var loadDef = sourceController.load(_private.prepareFilter(Utils.clone(dataOptions.filter), this._selection, source));
               
               loadDef.addCallback(function(result) {
                  return _private.prepareResult(result, self._selectedKeys, dataOptions.keyProperty);
               });
               this._notify('selectionLoad', [loadDef], {bubbling: true});
            }
         }
         
      });
      
      Container.contextTypes = function() {
         return {
            controllerContext: SelectorContext,
            dataOptions: ContextOptions
         };
      };
   
      Container._private = _private;
      
      return Container;
   });
