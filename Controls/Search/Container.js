define('Controls/Search/Container',
   [
      'Core/Control',
      'tmpl!Controls/Search/Container',
      'Controls/Container/Data/ContextOptions',
      'Core/core-clone',
      'Controls/Controllers/_SearchController'
   ],
   
   function(Control, template, DataOptions, clone, _SearchController) {
      
      'use strict';
   
      var _private = {
         getSearchController: function(self) {
            var options = self._dataOptions;
   
            if (!self._searchController) {
               self._searchController = new _SearchController({
                  searchParam: self._options.searchParam,
                  minSearchLength: self._options.minSearchLength,
                  searchDelay: self._options.searchDelay,
                  filter: clone(options.filter),
                  source: options.source,
                  navigation: options.navigation,
                  searchCallback: _private.searchCallback.bind(self, self),
                  abortCallback: _private.abortCallback.bind(self, self)
               });
            }
   
            return self._searchController;
         },
         
         searchCallback: function(self, result, filter) {
            self._searchMode = true;
            self._notify('itemsChanged', [result.data], {bubbling: true});
            self._notify('filterChanged', [filter], {bubbling: true});
         },
         
         abortCallback: function(self, filter) {
            if (self._searchMode) {
               self._searchMode = false;
               self._notify('filterChanged', [filter], {bubbling: true});
            }
         }
      };
      
      var Container = Control.extend({
         
         _template: template,
         
         _beforeMount: function(options, context) {
            this._dataOptions = context.dataOptions;
         },
   
         _beforeUpdate: function(options, context) {
            this._dataOptions = context.dataOptions;
         },
         
         _search: function(event, value) {
            _private.getSearchController(this).search(value);
         }
         
      });
   
      Container.contextTypes = function() {
         return {
            dataOptions: DataOptions
         };
      };
      
      Container.getDefaultOptions = function() {
         return {
            minSearchLength: 3,
            searchDelay: 500
         };
      };
      
      return Container;
      
   });
