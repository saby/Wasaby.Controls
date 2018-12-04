define('Controls/Controllers/SourceController',
   [
      'Core/core-simpleExtend',
      'Core/core-instance',
      'Core/IoC',
      'Controls/Controllers/QueryParamsController/Page',
      'Controls/Controllers/QueryParamsController/Offset',
      'Controls/Controllers/QueryParamsController/Position',
      'WS.Data/Query/Query',
      'Core/Deferred',
      'Core/core-clone',
      'require'
   ],
   function(cExtend, cInstance, IoC, Page, Offset, Position, Query, cDeferred, cClone) {
      var _private = {
         prepareSource: function(sourceOpt) {
            if (!cInstance.instanceOfMixin(sourceOpt, 'WS.Data/Source/ICrud')) {
               IoC.resolve('ILogger').error('SourceController', 'Source option has incorrect type');
            }
            return sourceOpt;
         },

         getQueryInstance: function(filter, sorting, offset, limit) {
            var query = new Query();
            query.where(filter)
               .offset(offset)
               .limit(limit)
               .orderBy(sorting);
            return query;
         },

         callQuery: function(dataSource, idProperty, filter, sorting, offset, limit) {
            var queryDef, queryIns;

            queryIns = _private.getQueryInstance(filter, sorting, offset, limit);

            queryDef = dataSource.query(queryIns).addCallback((function(dataSet) {
               if (idProperty && idProperty !== dataSet.idProperty) {
                  dataSet.setIdProperty(idProperty);
               }
               return dataSet.getAll ? dataSet.getAll() : dataSet;
            }));

            if (cInstance.instanceOfModule(dataSource, 'WS.Data/Source/Memory')) {

               /*Проблема в том что деферред с синхронным кодом статического источника выполняется сихронно.
                в итоге в коолбэк релоада мы приходим в тот момент, когда еще не отработал _beforeMount и заполнение опций, и не можем обратиться к this._options*/
               var queryDefAsync = cDeferred.fromTimer(0);
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
                  cntCtr = Page;
                  break;
               case 'offset':
                  cntCtr = Offset;
                  break;
               case 'position':
                  cntCtr = Position;
                  break;
               default:
                  IoC.resolve('ILogger').error('SourceController', 'Undefined navigation source type "' + type + '"');
            }
            if (cntCtr) {
               cntInstance = new cntCtr(cfg);
            }
            return cntInstance;
         },

         modifyQueryParamsWithNavigation: function(cleanParams, direction, paramsController) {
            var resultParams, navigParams, navFilter;

            resultParams = cleanParams;
            navigParams = paramsController.prepareQueryParams(direction);

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

            return resultParams;
         }
      };
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
               this._queryParamsController.prepareSource(this._source);
            }
         },

         load: function(filter, sorting, direction) {
            var def, queryParams, self, navFilter;

            queryParams = {
               filter: filter || {},
               sorting: sorting,
               limit: undefined,
               offset: undefined
            };
            this.cancelLoading();

            if (this._queryParamsController) {
               queryParams = _private.modifyQueryParamsWithNavigation(queryParams, direction, this._queryParamsController);
            }

            self = this;
            def = _private.callQuery(this._source, this._options.idProperty,
               queryParams.filter,
               queryParams.sorting,
               queryParams.offset,
               queryParams.limit)
               .addCallback(function(list) {
                  if (self._queryParamsController) {
                     self._queryParamsController.calculateState(list, direction);
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
               this._loader = null;
            }
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

         hasMoreData: function(direction) {
            if (this._queryParamsController) {
               return this._queryParamsController.hasMoreData(direction);
            }
         },

         calculateState: function(list) {
            if (this._queryParamsController) {
               this._queryParamsController.calculateState(list);
            }
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

      return SourceController;
   });
