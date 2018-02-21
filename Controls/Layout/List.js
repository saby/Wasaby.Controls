/**
 * Created by am.gerasimov on 02.02.2018.
 */
define('Controls/Layout/List',
   [
      'Core/Control',
      'tmpl!Controls/Layout/List/List',
      'WS.Data/Source/Memory',
      'Controls/Controllers/SearchController',
      'Core/core-merge',
      'Controls/Event/Emitter',
      'Controls/List'
   ],
   
   function(Control, template, Memory, SearchController, merge) {
      
      'use strict';
   
   
      var _private = {
         initSearchController: function(self) {
            var options = self._options;
   
            if(!self._searchController) {
               self._searchController = new SearchController({
                  filter: options.filter,
                  searchParam: options.searchParam,
                  minSearchLength: options.minSearchLength,
                  source: options.source,
                  navigation: options.navigation,
                  searchCallback: _private.searchCallback.bind(self, self),
                  abortCallback: _private.abortCallback.bind(self, self)
               });
            }
         },
         
         resolveOptions: function(self, options) {
            self._options = options;
            self._source = options.source;
            self._filter = options.filter;
         },
      
         updateSource: function(self, data) {
            /* TODO will be a cached source */
            self._source = new Memory({
               data: data.result.getRawData()
            });
         },
         
         updateFilter: function(self, resultFilter) {
            var filterClone = merge({}, self._options.filter);
            self._filter = merge(filterClone, resultFilter);
         },
      
         abortCallback: function(self, filter) {
            _private.updateFilter(self, filter);
            self._source = self._options.source;
            self._forceUpdate();
         },
      
         searchCallback: function(self, result, filter) {
            _private.updateSource(self, result);
            _private.updateFilter(self, filter);
            self._forceUpdate();
         }
      };
   
      var List = Control.extend({
         
         _template: template,
         
         constructor: function(options) {
            List.superclass.constructor.call(this, options);
            _private.resolveOptions(this, options);
         },
   
         _searchValueChanged: function(event, value) {
            _private.initSearchController(this);
            this._searchController.search(value);
         },
         
         _filterChanged: function(event, resultFilter) {
            _private.updateFilter(this, resultFilter);
            this._forceUpdate();
         }
         
      });
   
      List.getDefaultOptions = function() {
         return {
            searchDelay: 500,
            minSearchLength: 3,
            filter: {}
         };
      };
      
      return List;
      
   });