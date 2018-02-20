/**
 * Created by am.gerasimov on 02.02.2018.
 */
define('Controls/Layout/List',
   [
      'Core/Control',
      'tmpl!Controls/Layout/List/List',
      'WS.Data/Source/Memory',
      'Controls/Search/SearchController',
      'Core/core-merge',
      'Controls/Event/Emitter',
      'Controls/List'
   ],
   
   function(Control, template, Memory, SearchController, merge) {
      
      'use strict';
   
   
      var _private = {
         initSearchController: function(self, options) {
            self._searchController = new SearchController({
               filter: options.filter,
               searchParam: options.searchParam,
               minSearchLength: options.minSearchLength,
               dataSource: options.dataSource,
               navigation: options.navigation,
               searchCallback: _private.searchCallback.bind(self, self),
               abortCallback: _private.abortCallback.bind(self, self)
            });
         },
         
         resolveOptions: function(self, options) {
            self._dataSource = options.dataSource;
            self._filter = options.filter;
         },
      
         updateSource: function(self, data) {
            /* TODO will be a cached source */
            self._dataSource = new Memory({
               data: data.result.getRawData()
            });
         },
         
         updateFilter: function(self, resultFilter) {
            var filterClone = merge({}, self._options.filter);
            self._filter = merge(filterClone, resultFilter);
         },
      
         abortCallback: function(self, filter) {
            _private.updateFilter(self, filter);
            self._dataSource = self._options.dataSource;
            self._forceUpdate();
         },
      
         searchCallback: function(self, result, filter) {
            _private.updateSource(self, result);
            _private.updateFilter(self, filter);
            self._forceUpdate();
         }
      };
   
      var LayoutInner = Control.extend({
         
         _template: template,
         
         constructor: function(options) {
            LayoutInner.superclass.constructor.call(this, options);
            
            _private.resolveOptions(this, options);
            _private.initSearchController(this, options);
         },
   
         _searchValueChanged: function(event, value) {
            this._searchController.search(value);
         },
         
         _filterChanged: function(event, resultFilter) {
            _private.updateFilter(this, resultFilter);
            this._forceUpdate();
         }
         
      });
   
      LayoutInner.getDefaultOptions = function() {
         return {
            searchDelay: 500,
            minSearchLength: 3,
            filter: {}
         };
      };
      
      return LayoutInner;
      
   });