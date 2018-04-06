define('Controls/List/resources/utils/Search',
   [
      'Core/core-extend',
      'Core/Deferred',
      'Controls/List/resources/utils/DataSourceUtil',
      'Controls/Controllers/QueryParamsController/Page'
   ],
   function (extend, Deferred, DataSourceUtil, PageNavigation) {
      
      'use strict';
   
      var _private = {
         /**
          * Checks required parameters
          */
         checkRequiredParams: function(params) {
            if (!params.source) {
               throw new Error('source is required for search');
            }
         },
      
         /**
          * Returns arguments for query
          */
         getArgsForQuery: function(self, searchConfig) {
            var queryParams = {
               filter: searchConfig.filter,
               sorting: searchConfig.sorting,
               limit: searchConfig.limit,
               offset: searchConfig.offset
            };
            
            if (self._navigation) {
               var navigParams = self._navigation.prepareQueryParams(null);
               queryParams.limit = navigParams.limit;
               queryParams.offset = navigParams.offset;
            }
            
            return [
               self._source,
               null, //idProperty, using default
               queryParams.filter,
               queryParams.sorting,
               queryParams.offset,
               queryParams.limit
            ];
         },
      
         cancelErrorProcess: function(self, def) {
            self._searchDeferred.addErrback(function(error) {
               if (error.canceled) {
                  def.cancel();
               }
               return error;
            });
         },
      
         callSearchQuery: function(self, searchConfig) {
            var searchDef = DataSourceUtil.callQuery.apply(self, _private.getArgsForQuery(self, searchConfig));
            _private.cancelErrorProcess(self, searchDef);
            return searchDef;
         }
      };
   
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
            _private.checkRequiredParams(cfg);
            this._searchDelay = cfg.hasOwnProperty('searchDelay') ? cfg.searchDelay : 500;
            this._source = DataSourceUtil.prepareSource(cfg.source);
            if (cfg.navigation && cfg.navigation.source === 'page') {
               //TODO переписать, как список переведут на актуальное апи навигации
               this._navigation = new PageNavigation(cfg.navigation.sourceConfig);
               this._navigation.prepareSource(this._source);
               
            }
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
            
            var self = this,
                hasMore;
            
            //aborting current search
            this.abort();
            this._searchDeferred = new Deferred();
   
            this._searchDelayTimer = setTimeout(function() {
               _private.callSearchQuery(self, searchConfig)
                  .addCallback(function(result) {
                     if (self._navigation) {
                        self._navigation.calculateState(result);
                        hasMore = self._navigation.hasMoreData('down');
                     }
                     self._searchDeferred.callback({
                        result: result,
                        hasMore: hasMore
                     });
                     return result;
                  })
                  .addErrback(function(err) {
                     self._searchDeferred.errback(err);
                     return err;
                  })
                  .addBoth(function(res) {
                     self._searchDeferred = null;
                     return res;
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
   
      Search._private = _private;
      return Search;
   });
