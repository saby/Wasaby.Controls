/**
 * Created by am.gerasimov on 01.02.2018.
 */
define('Controls/Controllers/_SearchController',
   [
      'Core/core-extend',
      'Core/moduleStubs'
   ],
   
   function(extend, moduleStubs) {
      
      'use strict';
      
      var _private = {
         getSearch: function(self) {
            return moduleStubs.require('Controls/Controllers/_Search').addCallback(function(requireRes) {
               if (!self._search) {
                  self._search = new requireRes[0]({
                     source: self._options.source,
                     filter: self._options.filter,
                     navigation: self._options.navigation,
                     searchDelay: self._options.searchDelay
                  });
               }
               return self._search;
            });
         },
         
         search: function(self, value) {
            _private.getSearch(self).addCallback(function(search) {
               var filter = self._options.filter;
               
               filter[self._options.searchParam] = value;
               search.search(filter).addCallback(function(result) {
                  self._options.searchCallback(result, filter);
                  return result;
               });
               
               return search;
            });
         },
         
         abort: function(self) {
            _private.getSearch(self).addCallback(function(search) {
               if (search.isLoading()) {
                  search.abort();
               }
      
               var filter = self._options.filter;
               delete filter[self._options.searchParam];
               self._options.abortCallback(filter);
               return search;
            });
         }
      };
   
      /**
       * Отслеживает изменение value.
       * При необходимости загружает Controls/Controllers/_Search и делает запрос за данными.
       * @author Герасимов Александр
       * @class Controls/Controllers/_SearchController
       * @mixes Controls/Input/interface/ISearch
       * @mixes Controls/interface/ISource
       */
      /**
       * @name searchCallback
       * @cfg {Function} callback, который будет вызван при положительном результате поиска
       */
      /**
       * @name abortCallback
       * @cfg {Function} callback, который будет вызван при сбросе поиска, ошибке запроса
       */
      var SearchController = extend({
   
         constructor: function(options) {
            SearchController.superclass.constructor.call(this, options);
            this._options = options;
         },
         
         search: function(value) {
            if (value.length >= this._options.minSearchLength) {
               _private.search(this, value);
            } else {
               _private.abort(this);
            }
         },
         
         setFilter: function(filter) {
            this._options.filter = filter;
         },
         
         getFilter: function() {
            return this._options.filter;
         },
         
         abort: function() {
            _private.abort(this);
         }
         
      });
      
      return SearchController;
   });
