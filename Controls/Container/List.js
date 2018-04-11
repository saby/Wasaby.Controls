define('Controls/Container/List',
   [
      'Core/Control',
      'tmpl!Controls/Container/List/List',
      'WS.Data/Source/Memory',
      'Controls/Controllers/_SearchController',
      'Core/core-merge',
      'Core/helpers/Object/isEqual',
      'Controls/Container/Search/SearchContextField',
      'Controls/Container/Filter/FilterContextField'
   ],
   
   function(Control, template, Memory, SearchController, merge, isEqual, SearchContextField, FilterContextField) {
      
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
            _private.updateFilter(self, filter);
            self._source = self._options.source;
            self._forceUpdate();
         },
      
         searchCallback: function(self, result, filter) {
            _private.updateFilter(self, filter);
            _private.updateSource(self, result.data);
            self._forceUpdate();
         },
   
         searchValueChanged: function(self, value) {
            _private.getSearchController(self).search(value);
         },
   
         filterChanged: function(self, filter) {
            _private.updateFilter(self, filter);
            self._forceUpdate();
         }
      };
   
      /**
       * Container for lists components.
       * Pass props (like filter, source, navigation) to list inside.
       * @author Герасимов Александр
       * @class Controls/Container/List
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/INavigation
       * @mixes Controls/interface/IFilter
       */
      
      /**
       * @name Controls/Container/List#source
       * @cfg {WS.Data/Source/ISource} source
       */
      
      var List = Control.extend({
         
         _template: template,
         
         constructor: function(options) {
            List.superclass.constructor.call(this, options);
            _private.resolveOptions(this, options);
         },
         
         _beforeMount: function(options, context) {
            if (context.filterLayoutField.filter) {
               _private.filterChanged(this, context.filterLayoutField.filter);
            }
         },
         
         _beforeUpdate: function(options, context) {
            var searchContextValue = context.searchLayoutField.searchValue;
            var filterContextValue = context.filterLayoutField.filter;
            
            if (!isEqual(this.context.get('searchLayoutField').searchValue, searchContextValue)) {
               _private.searchValueChanged(this, searchContextValue);
            }
            
            if (!isEqual(this.context.get('filterLayoutField').filter, filterContextValue)) {
               _private.filterChanged(this, filterContextValue);
            }
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
