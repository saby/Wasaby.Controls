import cExtend = require('Core/core-simpleExtend');
import cInstance = require('Core/core-instance');
import sourceLib = require('Types/source');
import cDeferred = require('Core/Deferred');
import cClone = require('Core/core-clone');
import PageQueryParamsController from 'Controls/_source/QueryParamsController/PageQueryParamsController';
import PositionQueryParamsController from 'Controls/_source/QueryParamsController/PositionQueryParamsController';
import QueryParamsController from 'Controls/_source/QueryParamsController';
import {Logger} from 'UI/Utils';

interface IModifyParamsWithNavigation {
   root?: string|number|null;
   config?: object;
   callback?: Function;
   cleanParams: object;
   direction?: 'up'|'down';
   paramsController: QueryParamsController;
}

var _private = {
   prepareSource: function(sourceOpt) {
      if (!cInstance.instanceOfMixin(sourceOpt, 'Types/_source/ICrud')) {
          Logger.error('SourceController: Source option has incorrect type');
      }
      return sourceOpt;
   },

   getQueryInstance: function(filter, sorting, offset, limit, meta) {
      var query = new sourceLib.Query();
      query.where(filter)
         .offset(offset)
         .limit(limit)
         .orderBy(sorting)
         .meta(meta);
      return query;
   },

   callQuery: function(dataSource, keyProperty, filter, sorting, offset, limit, meta) {
      var queryDef, queryIns;

      queryIns = _private.getQueryInstance(filter, sorting, offset, limit, meta);

      queryDef = dataSource.query(queryIns).addCallback((function(dataSet) {
         if (keyProperty && keyProperty !== dataSet.idProperty) {
            dataSet.setKeyProperty(keyProperty);
         }
         return dataSet.getAll ? dataSet.getAll() : dataSet;
      }));

      if (cInstance.instanceOfModule(dataSource, 'Types/source:Memory')) {

         /*Проблема в том что деферред с синхронным кодом статического источника выполняется сихронно.
          в итоге в коолбэк релоада мы приходим в тот момент, когда еще не отработал _beforeMount и заполнение опций, и не можем обратиться к this._options*/
         var queryDefAsync = new cDeferred();

         //deferred.fromTimer is not support canceling
         setTimeout(function() {
            if (!queryDefAsync.isReady()) {
               queryDefAsync.callback();
            }
         }, 0);

         queryDefAsync.addCallback(function() {
            return queryDef;
         });
         return queryDefAsync;
      } else {
         return queryDef;
      }
   },

   createQueryParamsController: function(type, cfg) {
      var cntCtr, cntInstance;

      switch (type) {
         case 'page':
            cntCtr = PageQueryParamsController;
            break;
         case 'offset':
            cntCtr = Offset;
            break;
         case 'position':
            cntCtr = PositionQueryParamsController;
            break;
         default:
             Logger.error('SourceController: Undefined navigation source type "' + type + '"');
      }
      if (cntCtr) {
         cntInstance = new QueryParamsController({
            controllerClass: cntCtr,
            controllerOptions: cfg
         });
      }
      return cntInstance;
   },

   modifyQueryParamsWithNavigation({
       cleanParams,
       direction,
       paramsController,
       callback,
       config,
       root
   }: IModifyParamsWithNavigation) {
      let resultParams, navigParams, navFilter;

      resultParams = cleanParams;
      navigParams = paramsController.prepareQueryParams(direction, callback, config, false, root);

      resultParams.limit = navigParams.limit;
      resultParams.offset = navigParams.offset;

      if (navigParams.filter) {
         //we can't modify original filter
         resultParams.filter = cClone(resultParams.filter);
         navFilter = navigParams.filter;
         for (var i in navFilter) {
            if (navFilter.hasOwnProperty(i)) {
               resultParams.filter[i] = navFilter[i];
            }
         }
      }

      if (navigParams.meta) {
         resultParams.meta = navigParams.meta;
      }

      return resultParams;
   }
};
/**
 * @Deprecated Please use Controls/source/NavigationController instead
 */
var SourceController = cExtend.extend({
   _source: null,
   _queryParamsController: null,
   _loader: null,
   constructor: function(cfg) {
      this._options = cfg;
      SourceController.superclass.constructor.apply(this, arguments);
      this._source = _private.prepareSource(this._options.source);

      if (this._options.navigation && this._options.navigation.source) {
         this._queryParamsController = _private.createQueryParamsController(this._options.navigation.source, this._options.navigation.sourceConfig);
      }
   },

   load: function(filter, sorting?, direction?, config?, root?) {
      var def, queryParams, self;

      queryParams = {
         filter: filter || {},
         sorting: sorting,
         limit: undefined,
         offset: undefined
      };
      this.cancelLoading();

      if (this._queryParamsController) {
         queryParams = _private.modifyQueryParamsWithNavigation({
             cleanParams: queryParams,
             direction,
             paramsController: this._queryParamsController,
             callback: this._options.queryParamsCallback,
             config,
             root
         });
      }

      self = this;
      def = _private.callQuery(this._source, this._options.keyProperty,
         queryParams.filter,
         queryParams.sorting,
         queryParams.offset,
         queryParams.limit,
         queryParams.meta)
         .addCallback(function(list) {
            if (self._queryParamsController) {
               self._queryParamsController.updateQueryProperties(list, direction, config, root);
            }
            return list;
         }).addErrback(function(error) {
            return error;
         });
      this._loader = def;
      return def;
   },

   cancelLoading: function() {
      if (this._loader && !this._loader.isReady()) {
         this._loader.cancel();
      }
      this._loader = null;
   },

   getLoadedDataCount: function() {
      if (this._queryParamsController) {
         return this._queryParamsController.getLoadedDataCount();
      }
   },

   getAllDataCount: function() {
      if (this._queryParamsController) {
         return this._queryParamsController.getAllDataCount();
      }
   },

   getNavigation: function() {
      return this._options.navigation;
   },

   hasMoreData: function(direction: 'up' | 'down', key?: string | number): boolean {
      if (this._queryParamsController) {
         return this._queryParamsController.hasMoreData(direction, key);
      }
   },

   calculateState: function(list, direction?: 'up' | 'down', root?: string|number) {
      if (this._queryParamsController) {
         this._queryParamsController.updateQueryProperties(
             list,
             direction,
             null,
             root
         );
      }
   },

   setState: function(state, root: string|number|null): boolean {
      let stateChanged = false;

      if (this._queryParamsController) {
         stateChanged = this._queryParamsController.setState(state, root);
      }

      return stateChanged;
   },

   isLoading: function() {
      return this._loader && !this._loader.isReady();
   },

   setEdgeState: function(direction) {
      if (this._queryParamsController) {
         this._queryParamsController.setEdgeState(direction);
      }
   },

   create: function(meta) {
      return this._source.create(meta);
   },

   update: function(item) {
      return this._source.update(item);
   },

   read: function(key, meta) {
      return this._source.read(key, meta);
   },

   destroy: function() {
      if (this._queryParamsController) {
         this._queryParamsController.destroy();
      }
      this.cancelLoading();
      this._options = null;
   }
});

//для тестов
SourceController._private = _private;

export = SourceController;
