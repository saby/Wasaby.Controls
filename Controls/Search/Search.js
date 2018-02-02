define('Controls/Search/Search',
   [
      'Core/core-extend',
      'Core/Deferred',
      'Controls/List/resources/utils/DataSourceUtil',
      'Controls/List/Controllers/PageNavigation'
   ],
   function (extend, Deferred, DataSourceUtil, PageNavigation) {
      
      'use strict';
   
      var _private = {
         /**
          * Checks required parameters
          * @param {Object} params
          */
         checkRequiredParams: function(params) {
            if (!params.dataSource) {
               throw new Error('dataSource is required for search');
            }
         },
   
         /**
          * Defines base properties passed from constructor.
          * @param {Object} self
          * @param {Object} options
          */
         resolveOptions: function (self, options) {
            self._searchDelay = options.hasOwnProperty('searchDelay') ? options.searchDelay : 500;
            self._dataSource = DataSourceUtil.prepareSource(options.dataSource);
            
            if (options.navigation && options.navigation.source === 'page') {
               //TODO переписать, как список переведут на актуальное апи навигации
               self._navigation = new PageNavigation(options.navigation.sourceConfig);
               self._navigation.prepareSource(options._dataSource);
      
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
               self._dataSource,
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
         },
         
         searchCallback: function(self, result) {
            var hasMore;
            
            if (self._navigation) {
               self._navigation.calculateState(result);
               hasMore = self._navigation.hasMoreData('down');
            }
            
            self._searchDeferred.callback({
               result: result,
               hasMore: hasMore
            });
         },
         
         searchErrback: function(self) {
            self._searchDeferred.errback(err);
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
         constructor: function(options) {
            Search.superclass.constructor.apply(this, arguments);
            
            options = options || {};
            _private.checkRequiredParams(options);
            _private.resolveOptions(this, options);
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
               throw new Error('filter is required for search ');
            }
            
            var self = this;
            
            //aborting current query
            this.abort();
            this._searchDeferred = new Deferred();
   
            this._searchDelayTimer = setTimeout(function() {
               _private.callSearchQuery(self, searchConfig)
                  .addCallback(function(result) {
                     _private.searchCallback(self, result);
                     return result;
                  })
                  .addErrback(function(err) {
                     _private.searchErrback(self, err);
                     return err;
                  })
                  .addBoth(function(result) {
                     self._searchDeferred = null;
                     return result;
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
