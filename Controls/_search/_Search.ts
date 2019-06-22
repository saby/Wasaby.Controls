import extend = require('Core/core-extend');
import Deferred = require('Core/Deferred');
import {Controller} from 'Controls/source';

'use strict';

var _private = {

   checkRequiredOptions: function(options) {
      if (!options.source) {
         throw new Error('source is required for search');
      }
   },

   initSourceController: function(self, options) {
      self._sourceController = new Controller({
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
   },

   clearSearchDelay: function(self) {
      if (self._searchDelayTimer) {
         clearTimeout(self._searchDelayTimer);
         self._searchDelayTimer = null;
      }
   },

   callAfterDelay: function(self, callback) {
      _private.clearSearchDelay(self);
      self._searchDelayTimer = setTimeout(function() {
         self._searchDelayTimer = null;
         callback();
      }, self._searchDelay);
   },

   resolveSearchCall: function (self, callback, force) {
      if (force) {
         callback();
      } else {
         _private.callAfterDelay(self, callback);
      }
   }

};

/**
 * @author Герасимов Александр
 * @class Controls/_search/_Search
 * @public
 */

/**
 * @name Controls/_search/_Search#searchDelay
 * @cfg {Number} The delay in milliseconds between when a keystroke occurs and when a search is performed.
 * A zero-delay makes sense for local data.
 */

/**
 * @name Controls/_search/_Search#source
 * @cfg {Types/source:ISource} source
 */

/**
 * @name Controls/_search/_Search#navigation
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
      this.abort(true);
      this._searchDeferred = new Deferred();

      _private.resolveSearchCall(this, load, force);
      return this._searchDeferred;
   },

   /**
    * Aborting search
    * @public
    */
   abort: function(force):Deferred {
      let self = this;
      let abortDef = new Deferred();

      let abort = function() {
         if (self._searchDeferred && !self._searchDeferred.isReady()) {
            self._searchDeferred.cancel();
         }
         self._sourceController.cancelLoading();
         abortDef.callback();
      };

      _private.clearSearchDelay(this);
      _private.resolveSearchCall(this, abort, force);

      return abortDef;
   },

   isLoading: function() {
      return this._searchDeferred && !this._searchDeferred.isReady();
   }

});

Search._private = _private;

export default Search;
