define('js!Controls/List/resources/utils/Search',
   [
      'Core/core-extend',
      'Core/Deferred',
      'WS.Data/Query/Query',
      'js!Controls/List/resources/utils/DataSourceUtil'
   ],
   function (extend, Deferred, Query, DataSourceUtil) {
      
      'use strict';
      
      /**
       * Checks required parameters
       */
      function checkRequiredParams(params) {
         if (!params.searchParam) {
            throw new Error('searchParam is required for search')
         }
   
         if (!params.dataSource) {
            throw new Error('dataSource is required for search')
         }
      }
   
      /**
       * Returns arguments for query
       */
      function getArgsForQuery(searchConfig) {
         return [
            this._dataSource,
            null, //idProperty, using default
            searchConfig.filter,
            searchConfig.sorting,
            searchConfig.offset,
            searchConfig.limit
         ];
      }
   
      function cancelErrorProcess(def) {
         this._searchDeferred.addErrback(function(error) {
            if (error.canceled) {
               def.cancel();
            }
            return error;
         });
      }
   
      function callSearchQuery(searchConfig) {
         var searchDef = DataSourceUtil.callQuery.apply(this, getArgsForQuery.call(this, searchConfig));
         cancelErrorProcess.call(this, searchDef);
         return searchDef;
      }
   
      /**
       * @author Герасимов Александр
       * @class WSControls/Lists/Controllers/Search
       * @extends Core/Abstract
       * @public
       */
   
      /**
       * @name WSControls/Lists/Controllers/Search#searchDelay
       * @cfg {Number} The delay in milliseconds between when a keystroke occurs and when a search is performed.
       * A zero-delay makes sense for local data.
       */
      
      /**
       * @name WSControls/Lists/Controllers/Search#dataSource
       * @cfg {WS.Data/Source/ISource} dataSource
       */
      var Search  = extend({
         constructor: function(cfg) {
            cfg = cfg || {};
            checkRequiredParams(cfg);
            this._searchDelay = cfg.hasOwnProperty('searchDelay') ? cfg.searchDelay : 500;
            this._dataSource = cfg.dataSource;
            Search.superclass.constructor.apply(this, arguments);
         },
   
         /**
          * @typedef {Object} searchConfig
          * @property {Object} filter Filter parameters.
          * @property {Number} offset
          * @property {Number} limit
          * @property {String|Array.<Object.<String,Boolean>>} sorting
          * @property {Number} pageSize
          */
         /**
          * @cfg {searchConfig} Search configuration
          * @returns {Core/Deferred}
          */
         search: function (searchConfig) {
            if (!searchConfig.filter) {
               throw new Error('filter is required for search ')
            }
            
            var self = this;
            
            //aborting current search
            this.abort();
            this._searchDeferred = new Deferred();
   
            this._searchDelayTimer = setTimeout(function() {
               callSearchQuery.call(self, searchConfig)
                  .addCallback(function(result) {
                     self._searchDeferred.callback(result);
                     return result;
                  })
                  .addErrback(function(err) {
                     self._searchDeferred.errback(err);
                     return err;
                  })
                  .addBoth(function() {
                     self._searchDeferred = null;
                  });
            }, this._searchDelay);
            
      
            return this._searchDeferred;
         },
   
         /**
          * Aborting search
          * @public
          */
         abort: function () {
            if (this._searchDelayTimer) {
               clearTimeout(this._searchDelayTimer);
               this._searchDelayTimer = null;
            }
            if (this._searchDeferred && !this._searchDeferred.isReady()) {
               this._searchDeferred.cancel();
               this._searchDeferred = null;
            }
         }
         
      });
   
      return Search;
   });
