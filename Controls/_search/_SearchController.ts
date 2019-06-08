/**
 * Created by am.gerasimov on 01.02.2018.
 */

import extend = require('Core/core-extend');
import clone = require('Core/core-clone');
import moduleStubs = require('Core/moduleStubs');

var _private = {
   getSearch: function(self) {
      return moduleStubs.require('Controls/search').addCallback(function(requireRes) {
         if (!self._search) {
            self._search = new requireRes[0]._Search({
               source: self._options.source,
               filter: self._options.filter,
               sorting: self._options.sorting,
               navigation: self._options.navigation,
               searchDelay: self._options.searchDelay,
               searchStartCallback: self._options.searchStartCallback
            });
         }
         return self._search;
      });
   },

   search: function(self, value, force) {
      _private.getSearch(self).addCallback(function(search) {
         var filter = self._options.filter;

         filter = clone(filter);
         filter[self._options.searchParam] = value;

         search.search(filter, force)
            .addCallback(function(result) {
               if (self._options.searchCallback) {
                  self._options.searchCallback(result, filter);
               }
               return result;
            })
            .addErrback(function(result) {
               if (self._options.searchErrback) {
                  self._options.searchErrback(result, filter);
               }
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
         filter = clone(filter);
         if (self._options.abortCallback) {
            self._options.abortCallback(filter);
         }
         return search;
      });
   }
};

/**
 * Отслеживает изменение value.
 * При необходимости загружает Controls/search:_Search и делает запрос за данными.
 * @author Герасимов Александр
 * @class Controls/_search/_SearchController
 * @mixes Controls/interface/ISearch
 * @mixes Controls/_interface/ISource
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

   search: function(value, force) {
      if ((this._options.minSearchLength !== null && value.length >= this._options.minSearchLength) || (force && value.length)) {
         _private.search(this, value, force);
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

SearchController._private = _private;

export default SearchController;
