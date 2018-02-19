/**
 * Created by am.gerasimov on 01.02.2018.
 */
define('Controls/Search/SearchController',
   [
      'Core/core-extend',
      'Controls/Search/SearchUtil'
   ],
   
   function(extend, SearchUtil) {
      
      'use strict';
      
      var _private = {
         resolveOptions: function(self, options) {
            self._searchCallback  = options.searchCallback;
            self._abortCallback   = options.abortCallback;
            self._minSearchLength = options.minSearchLength;
            self._filter          = options.filter;
            self._searchParam     = options.searchParam;
            self._dataSource      = options.dataSource;
            self._navigation      = options.navigation;
         },
         
         getSearch: function(self) {
            return SearchUtil.getSearch(self, {
               dataSource: self._dataSource,
               filter: self._filter,
               navigation: self._navigation
            });
         },
         
         search: function(self, value) {
            _private.getSearch(self).addCallback(function(search) {
               self._filter[self._searchParam] = value;
               
               search.search(self._filter).addCallback(function(result) {
                  self._searchCallback(result, self._filter);
                  return result;
               });
               
               return search;
            });
         },
         
         abort: function (self) {
            _private.getSearch(self).addCallback(function(search) {
               search.abort();
               delete self._filter[self._searchParam];
               self._abortCallback(self._filter);
               return search;
            });
         }
      };
      
      
      var SearchController = extend({
   
         constructor: function(options) {
            SearchController.superclass.constructor.call(this, options);
            _private.resolveOptions(this, options);
         },
         
         search: function(value) {
            if (value.length >= this._minSearchLength) {
               _private.search(this, value);
            } else {
               _private.abort(this);
            }
         }
         
      });
      
      return SearchController;
   });