define('Controls/Controllers/_Search',
   [
      'Core/core-extend',
      'Core/Deferred',
      'Controls/source'
   ],
   function(extend, Deferred, scroll) {
      
      'use strict';
   
      var _private = {

         checkRequiredOptions: function(options) {
            if (!options.source) {
               throw new Error('source is required for search');
            }
         },
   
         initSourceController: function(self, options) {
            self._sourceController = new scroll.Controller({
               source: options.source,
               navigation: options.navigation
            });
         },
         
         resolveOptions: function(self, options) {
            self._searchDelay = options.searchDelay;
            self._sorting = options.sorting;
            self._searchStartCallback = options.searchStartCallback;
         },
         
         searchCallback: function(self, result) {
            self._searchDeferred.callback({
               data: result,
               hasMore: self._sourceController.hasMoreData('down')
            });
         },
         
         searchErrback: function(self, error) {
            self._searchDeferred.errback(error);
         }
      };
   
      /**
       * @author Герасимов Александр
       * @class WSControls/Lists/Controllers/Search
       * @public
       */
   
      /**
       * @name Controls/Controllers/_Search#searchDelay
       * @cfg {Number} The delay in milliseconds between when a keystroke occurs and when a search is performed.
       * A zero-delay makes sense for local data.
       */
      
      /**
       * @name Controls/Controllers/_Search#source
       * @cfg {Types/source:ISource} source
       */
      
      /**
       * @name Controls/Controllers/_Search#navigation
       * @cfg 'Controls/interface/INavigation} source
       */
      
      var Search  = extend({
   
         _searchDeferred: null,
         _searchDelay: null,
         _searchStartCallback: null,
         
         constructor: function(options) {
            Search.superclass.constructor.apply(this, arguments);
            
            _private.resolveOptions(this, options);
            _private.checkRequiredOptions(options);
            _private.initSourceController(this, options);
         },
         
         /**
          * @cfg {Object} filter
          * @returns {Core/Deferred}
          */
         search: function(filter, force) {
            var self = this;
            var load = function() {
               if (self._searchStartCallback) {
                  self._searchStartCallback(filter);
               }
               self._sourceController.load(filter, self._sorting)
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
            };
            
            //aborting current query
            this.abort();
            this._searchDeferred = new Deferred();
   
            if (force) {
               load();
            } else {
               this._searchDelayTimer = setTimeout(load, this._searchDelay);
            }
      
            return this._searchDeferred;
         },
   
         /**
          * Aborting search
          * @public
          */
         abort: function() {
            if (this._searchDelayTimer) {
               clearTimeout(this._searchDelayTimer);
               this._searchDelayTimer = null;
            }
            if (this._searchDeferred && !this._searchDeferred.isReady()) {
               this._searchDeferred.cancel();
            }
            this._sourceController.cancelLoading();
         },
         
         isLoading: function() {
            return this._searchDeferred && !this._searchDeferred.isReady();
         }
         
      });
   
      Search._private = _private;
      return Search;
   });
