
define('Controls/Search/Controller',
   [
      'Core/Control',
      'wml!Controls/Search/Controller',
      'Controls/Container/Data/ContextOptions',
      'Core/core-clone',
      'Controls/Controllers/_SearchController',
      'Core/helpers/Object/isEqual',
      'Controls/Search/Misspell/getSwitcherStrFromData'
   ],
   
   function(Control, template, DataOptions, clone, _SearchController, isEqual, getSwitcherStrFromData) {
      
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
                  abortCallback: _private.abortCallback.bind(self, self),
                  searchStartCallback: _private.searchStartCallback.bind(self, self)
               });
            }
   
            return self._searchController;
         },
         
         searchCallback: function(self, result, filter) {
            var switcherStr = getSwitcherStrFromData(result.data);
   
            self._loading = false;
            self._previousViewMode = self._viewMode;
            self._viewMode = 'search';
            self._forceUpdate();
            self._notify('filterChanged', [filter], {bubbling: true});
            self._notify('itemsChanged', [result.data], {bubbling: true});
            
            if (switcherStr) {
               self._misspellValue = switcherStr;
            }
         },
         
         abortCallback: function(self, filter) {
            self._loading = false;
            if (self._viewMode === 'search') {
               self._viewMode = self._previousViewMode;
               self._previousViewMode = null;
               self._searchValue = '';
               self._misspellValue = '';
               self._forceUpdate();
               self._notify('filterChanged', [filter], {bubbling: true});
            }
         },
   
         searchStartCallback: function(self) {
            self._loading = true;
         },
         
         needUpdateSearchController: function(options, newOptions) {
            return !isEqual(options.filter, newOptions.filter) ||
                   !isEqual(options.navigation, newOptions.navigation) ||
                   options.searchDelay !== newOptions.searchDelay ||
                   options.source !== newOptions.source ||
                   options.searchParam !== newOptions.searchParam ||
                   options.minSearchLength !== newOptions.minSearchLength;
         },
         itemOpenHandler: function() {
            _private.getSearchController(this).abort();
         }
      };
   
      /**
       * The search controller allows you to search data in a {@link Controls/List}
       * using any component with {@link Controls/Input/interface/IInputText} interface.
       * Search controller allows you:
       * 1) set delay before searching
       * 2) set number of characters
       * 3) set search parameter
       * 4) change the keyboard layout for an unsuccessful search
       * Note: Component with {@link Controls/Input/interface/IInputText} interface must be located in {@link Controls/Search/Input/Container}.
       *
       * More information you can read <a href='/doc/platform/developmentapl/interface-development/ws4/components/filter-search/'>here</a>.
       *
       * @class Controls/Search/Controller
       * @extends Core/Control
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IFilter
       * @mixes Controls/interface/INavigation
       * @author Герасимов А.М.
       * @control
       * @public
       */
      
      var Container = Control.extend(/** @lends Controls/Search/Container.prototype */{
         
         _template: template,
         _dataOptions: null,
         _itemOpenHandler: null,
         _previousViewMode: null,
         _viewMode: null,
         _searchValue: null,
         _misspellValue: null,

         constructor: function() {
            this._itemOpenHandler = _private.itemOpenHandler.bind(this);
            Container.superclass.constructor.apply(this, arguments);
         },

         _beforeMount: function(options, context) {
            this._dataOptions = context.dataOptions;
            this._previousViewMode = this._viewMode = options.viewMode;
            
            if (options.searchValue) {
               this._search(null, options.searchvalue);
            }
         },
   
         _beforeUpdate: function(newOptions, context) {
            var currentOptions = this._dataOptions;
            this._dataOptions = context.dataOptions;

            if (_private.needUpdateSearchController(currentOptions, this._dataOptions) || _private.needUpdateSearchController(this._options, newOptions)) {
               this._searchController = null;
            }
            
            if (this._options.searchValue !== newOptions.searchValue) {
               this._search(null, newOptions.searchValue);
            }
         },

         _search: function(event, value) {
            _private.getSearchController(this).search(value);
            this._searchValue = value;
         },
   
         _beforeUnmount: function() {
            if (this._searchController) {
               this._searchController.abort();
               this._searchController = null;
            }
            this._dataOptions = null;
         },
         
         _misspellCaptionClick: function() {
            this._search(null, this._misspellValue);
            this._misspellValue = '';
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
