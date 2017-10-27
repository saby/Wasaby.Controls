define('js!Controls/List/resources/utils/Search',
   [
      'Core/core-extend',
      'Core/Deferred',
      'WS.Data/Query/Query',
      'Core/core-clone',
      'Core/ParallelDeferred',
      'Core/moduleStubs',
      'js!Controls/List/resources/utils/DataSourceUtil'
   ],
   function (extend, Deferred, Query, clone, ParallelDeferred, moduleStubs, DataSourceUtil) {
      
      var kbLayoutPath = 'js!Controls/List/resources/utils/KbLayoutRevert';
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
      
      function analyzeQueryAnswer(recordSet, recordSetTranslated, searchConfig) {
         var hasItemsWithTranslatedQuery = false;
         recordSet = recordSet.clone();
   
         if (recordSetTranslated && recordSetTranslated.getCount()) {
            hasItemsWithTranslatedQuery = true;
      
            //kbLayout standart
            if (searchConfig.pageSize && recordSet.getCount() < searchConfig.pageSize) {
               recordSetTranslated.each(function(rec, index) {
                  if (searchConfig.pageSize - recordSet.getCount() > index) {
                     recordSet.append([rec]);
                  }
               });
            }
         }
         
         return {
            translated: hasItemsWithTranslatedQuery,
            result: recordSet
         };
      }
      
      function addCancelErrProcess(def) {
         this._searchDeferred.addErrback(function(error) {
            if (error.canceled) {
               if (!def.isReady()) {
                  def.cancel();
               }
            }
            return error;
         })
      }
      
      function query(params) {
         var def = DataSourceUtil.callQuery.apply(this, getArgsForQuery.call(this, params));
         addCancelErrProcess.call(this, def);
         return def;
      }
      
      
      function startSearch(searchConfig) {
         var resultDeferred = new Deferred(),
             queryParallelDeferred = new ParallelDeferred(),
             searchCfg, queryResult, translateQueryResult;
   
         //query without translating
         queryParallelDeferred.push(
            query.call(this, searchConfig).addCallback(function(recordSet) {
               queryResult = recordSet;
               return recordSet;
            })
         );
   
         //query with translating
         if (this._kbLayoutRevert) {
            searchCfg = clone(searchConfig); //cloning, because will changing
            searchCfg.filter[this._searchParam] = requirejs(kbLayoutPath)(searchCfg.filter[this._searchParam]);
            queryParallelDeferred.push(
               query.call(this, searchCfg).addCallback(function (recordSet) {
                  translateQueryResult = recordSet;
                  return recordSet;
               })
            );
         }
   
         queryParallelDeferred.done().getResult().addBoth(function(res) {
            resultDeferred.callback(analyzeQueryAnswer(queryResult, translateQueryResult, searchConfig));
            return res;
         });
         
         return resultDeferred;
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
       * @name WSControls/Lists/Controllers/Search#searchParam
       * @cfg {String} Filter parameter name for search.
       */
      
      /**
       * @name WSControls/Lists/Controllers/Search#dataSource
       * @cfg {WS.Data/Source/ISource} dataSource
       */
      var Search  = extend({
         constructor: function(cfg) {
            cfg = cfg || {};
            checkRequiredParams(cfg);
            this._searchParam = cfg.searchParam;
            this._searchDelay = cfg.hasOwnProperty('searchDelay') ? cfg.searchDelay : 500;
            this._dataSource = cfg.dataSource;
            this._kbLayoutRevert = cfg.hasOwnProperty('kbLayoutRevert') ? cfg.kbLayoutRevert : true;
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
                kbLoad = new Deferred();
   
            //preload KbLayoutRevert
            if (this._kbLayoutRevert && !requirejs.defined(kbLayoutPath)) {
               requirejs([kbLayoutPath], function () {
                  kbLoad.callback();
               })
            } else {
               kbLoad.callback();
            }
            //aborting current search
            this.abort();
            this._searchDeferred = new Deferred();

            this._searchDelayTimer = setTimeout(function() {
               kbLoad.addCallback(function(res) {
                  startSearch.call(self, searchConfig).addCallback(function(searchResult) {
                     self._searchDeferred.callback(searchResult);
                     self._searchDeferred = null;
                     return searchResult;
                  });
                  return res;
               })
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
