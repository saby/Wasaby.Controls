define('Controls/Container/List',
   [
      'Core/Control',
      'tmpl!Controls/Container/List/List',
      'WS.Data/Source/Memory',
      'Controls/Controllers/_SearchController',
      'Core/core-merge',
      'Core/helpers/Object/isEqual',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField',
      'Core/Deferred'
   ],
   
   function(Control, template, Memory, SearchController, merge, isEqual, SearchContextField, FilterContextField, Deferred) {
      
      'use strict';
      
      
      var _private = {
         getSearchController: function(self) {
            var options = self._options;
            
            if (!self._searchController) {
               self._searchController = new SearchController({
                  filter: merge({}, options.filter),
                  searchParam: options.searchParam,
                  minSearchLength: options.minSearchLength,
                  source: options.source,
                  navigation: options.navigation,
                  searchDelay: options.searchDelay,
                  searchCallback: _private.searchCallback.bind(self, self),
                  abortCallback: _private.abortCallback.bind(self, self)
               });
            }
            
            return self._searchController;
         },
         
         resolveOptions: function(self, options) {
            self._options = options;
            self._source = options.source;
            self._filter = options.filter;
         },
         
         updateSource: function(self, data) {
            /* TODO will be a cached source */
            self._source = new Memory({
               data: data.getRawData()
            });
         },
         
         updateFilter: function(self, resultFilter) {
            /* Копируем объект, чтобы порвать ссылку и опция у списка изменилась*/
            var filterClone = merge({}, self._options.filter);
            self._filter = merge(filterClone, resultFilter);
         },
         
         abortCallback: function(self, filter) {
            if (self._options.searchEndCallback) {
               self._options.searchEndCallback(null, filter);
            }
   
            _private.updateFilter(self, filter);
            self._source = self._options.source;
            self._forceUpdate();
         },
         
         searchCallback: function(self, result, filter) {
            if (self._options.searchEndCallback) {
               self._options.searchEndCallback(result, filter);
            }
   
            _private.updateFilter(self, filter);
            _private.updateSource(self, result.data);
            self._searchDeferred.callback();
            self._forceUpdate();
         },
         
         searchValueChanged: function(self, value) {
            if (self._searchDeferred && self._searchDeferred.isReady()) {
               self._searchDeferred.cancel();
            }
            if (self._options.searchStartCallback) {
               self._options.searchStartCallback();
            }
            self._searchDeferred = new Deferred();
            _private.getSearchController(self).search(value);
         },
         
         filterChanged: function(self, filter) {
            _private.updateFilter(self, filter);
            self._forceUpdate();
         },
         
         checkFilterValue: function(self, newContext, oldContext) {
            var newFilter = newContext.filterLayoutField && newContext.filterLayoutField.filter,
               oldFilter = self._contextObj &&
                  self._contextObj.hasOwnProperty('filterLayoutField') &&
                  oldContext.get('filterLayoutField').filter;
            
            return newFilter && !isEqual(newFilter, oldFilter) ? _private.filterChanged(self, newFilter) : false;
         },
         
         checkSearchValue: function(self, newContext, oldContext) {
            var newValue = newContext.searchLayoutField && newContext.searchLayoutField.searchValue,
               oldValue = self._contextObj &&
                  self._contextObj.hasOwnProperty('searchLayoutField') &&
                  oldContext.get('searchLayoutField').searchValue;
            
            return !isEqual(newValue, oldValue) ? _private.searchValueChanged(self, newValue) : false;
         }
      };
      
      /**
       * Container for list components.
       * Passes props (like filter, source, navigation) to list inside.
       *
       * @author Герасимов Александр
       * @class Controls/Container/List
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/INavigation
       * @mixes Controls/interface/IFilter
       * @public
       */
      
      /**
       * @name Controls/Container/List#source
       * @cfg {WS.Data/Source/ISource} source
       */
      
      var List = Control.extend({
         
         _template: template,
         _searchDeferred: null,
         
         constructor: function(options) {
            List.superclass.constructor.call(this, options);
            _private.resolveOptions(this, options);
         },
         
         _beforeMount: function(options, context) {
            _private.checkFilterValue(this, context);
            _private.checkSearchValue(this, context);
            
            return this._searchDeferred;
         },
         
         _beforeUpdate: function(options, context) {
            _private.checkFilterValue(this, context, this.context);
            _private.checkSearchValue(this, context, this.context);
         },
         
         _beforeUnmount: function() {
            _private.getSearchController(this).abort();
         }
         
      });
      
      List.contextTypes = function() {
         return {
            searchLayoutField: SearchContextField,
            filterLayoutField: FilterContextField
         };
      };
      
      List.getDefaultOptions = function() {
         return {
            searchDelay: 500,
            minSearchLength: 3,
            filter: {}
         };
      };
      
      /* For tests */
      List._private = _private;
      return List;
      
   });
