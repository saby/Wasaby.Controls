define('js!Controls/List/resources/utils/Search',
   [
      'Core/Abstract',
      'Core/Deferred',
      'WS.Data/Query/Query',
      'Core/core-clone',
      'Core/ParallelDeferred',
      'js!Controls/List/resources/utils/DataSourceUtil'
   ],
   function (Abstract, Deferred, Query, clone, ParallelDeferred, DataSourceUtil) {
   
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
   
      function getArgsForQueryWithTranslate(searchConfig) {
         var searchCfg = clone(searchConfig), //cloning, because will changing
             getQueryDeferred = new Deferred(),
             self = this;
      
         requirejs(['js!Controls/List/resources/utils/KbLayoutRevert'], function(kbLayout) {
            searchCfg.filter[self._searchParam] = kbLayout(searchCfg.filter[self._searchParam]);
            getQueryDeferred.callback(getArgsForQuery.call(self, searchCfg));
         });
      
         return getQueryDeferred;
      }
      
      function queryWithTranslate(params){
         var self = this,
             queryDeferred = new Deferred(),
             sourceQueryDef;
         
         if (this._kbLayoutRevert) {
            getArgsForQueryWithTranslate.call(self, params).addCallback(function (queryArgs) {
               sourceQueryDef = DataSourceUtil.callQuery.apply(self, queryArgs).addCallbacks(
                  function (res) {
                     queryDeferred.callback(res);
                     return res;
                  },
                  function (err) {
                     queryDeferred.errback(err);
                     return err
                  });
               return queryArgs;
            });
            queryDeferred.addErrback(function(error) {
               if (error.canceled && sourceQueryDef && !sourceQueryDef.isReady()) {
                  sourceQueryDef.cancel();
               }
            });
         } else {
            queryDeferred.errback(false);
         }
         
         return queryDeferred;
      }
      
      function analyzeTranslatedQueryAnswer(recordSet, searchConfig, resultRecordSet) {
         var hasItemsWithTranslatedQuery = false;
   
         if (recordSet.getCount()) {
            hasItemsWithTranslatedQuery = true;
      
            //kbLayout standart
            if (searchConfig.pageSize && resultRecordSet.getCount() < searchConfig.pageSize) {
               recordSet.each(function(rec, index) {
                  if (searchConfig.pageSize - resultRecordSet.getCount() > index) {
                     resultRecordSet.append([rec]);
                  }
               });
            }
         }
         
         return hasItemsWithTranslatedQuery;
      }
      
      function addCancelErrProcess(defs) {
         this._searchDeferred.addErrback(function(error) {
            if (error.canceled) {
               defs.forEach(function(def) {
                  if (!def.isReady()) {
                     def.cancel();
                  }
               })
            }
            return error;
         })
      }
      
      
      function startSearch(searchConfig) {
         var resultDeferred = new Deferred(),
             queryParallelDeferred = new ParallelDeferred(),
             hasItemsWithTranslatedQuery = false,
             queryDeferred, translateQueryDeferred, resultRecordSet;
   
         //query without translating
         queryParallelDeferred.push(
            queryDeferred = DataSourceUtil.callQuery.apply(this, getArgsForQuery.call(this, searchConfig)).addCallback(function(recordset) {
               resultRecordSet = recordset;
               return recordset;
            }));
   
         //query with translated searchParam
         queryParallelDeferred.push(
            translateQueryDeferred = queryWithTranslate.call(this, searchConfig).addCallback(function (dataSet) {
               //waiting for query without translating
               queryDeferred.addCallback(function(result) {
                  hasItemsWithTranslatedQuery =  analyzeTranslatedQueryAnswer(dataSet, searchConfig, resultRecordSet);
                  return result;
               });
         
               return dataSet;
            }));
   
         addCancelErrProcess.call(this, [queryDeferred, translateQueryDeferred]);
   
         queryParallelDeferred.done().getResult().addBoth(function(res) {
            resultDeferred.callback({
               translated: hasItemsWithTranslatedQuery,
               result: resultRecordSet
            });
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
      var Search  = Abstract.extend({
         
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
            
            var self = this;
            
            //aborting current search
            this.abort();
            this._searchDeferred = new Deferred();
            
            this._searchDelayTimer = setTimeout(function() {
               startSearch.call(self, searchConfig).addCallback(function(searchResult) {
                  self._searchDeferred.callback(searchResult);
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
         },
         
         destroy: function() {
            this.abort();
            Search.superclass.destroy.call(this);
         }
      });
   
      return Search;
   });
