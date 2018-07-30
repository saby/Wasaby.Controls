define('Controls/Search/Container',
   [
      'Core/Control',
      'tmpl!Controls/Search/Container',
      'Controls/Container/Data/ContextOptions',
      'Core/core-clone',
      'Controls/Controllers/_SearchController',
      'Core/helpers/Object/isEqual'
   ],
   
   function(Control, template, DataOptions, clone, _SearchController, isEqual) {
      
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
            self._notify('filterChanged', [filter], {bubbling: true});
            self._notify('itemsChanged', [result.data], {bubbling: true});
         },
         
         abortCallback: function(self, filter) {
            if (self._searchMode) {
               self._searchMode = false;
               self._notify('filterChanged', [filter], {bubbling: true});
            }
         },
         
         needUpdateSearchController: function(options, newOptions) {
            return !isEqual(options.filter, newOptions.filter) ||
                   !isEqual(options.navigation, newOptions.navigation) ||
                   options.searchDelay !== newOptions.searchDelay ||
                   options.source !== newOptions.source ||
                   options.searchParam !== newOptions.searchParam ||
                   options.minSearchLength !== newOptions.minSearchLength;
         }
      };
   
      /**
       * Container for content that can be filtered by Controls/Input/Search.
       * You can specify a delay before searching, number of characters to initiate search and search parameter.
       *
       * Here you can see a <a href="/materials/demo-ws4-filter-search-new">demo</a>.
       *
       * @class Controls/Search/Container
       * @extends Core/Control
       * @mixes Controls/Input/interface/ISearch
       * @author Герасимов Александр
       * @control
       * @public
       */
      
      var Container = Control.extend(/** @lends Controls/Search/Container.prototype */{
         
         _template: template,
         _dataOptions: null,
         _searchMode: false,
         
         _beforeMount: function(options, context) {
            this._dataOptions = context.dataOptions;
         },
   
         _beforeUpdate: function(newOptions, context) {
            var currentOptions = this._dataOptions;
            this._dataOptions = context.dataOptions;
            
            if (_private.needUpdateSearchController(currentOptions, this._dataOptions) || _private.needUpdateSearchController(this._options, newOptions)) {
               this._searchController = null;
            }
         },
         
         _search: function(event, value) {
            _private.getSearchController(this).search(value);
         },
   
         _beforeUnmount: function() {
            if (this._searchController) {
               this._searchController.abort();
               this._searchController = null;
            }
            this._dataOptions = null;
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
   
      Container._private = _private;
      
      return Container;
      
   });
