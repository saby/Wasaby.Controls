define('Controls/Controllers/SourceController',
   [
      'Core/core-simpleExtend',
      'Core/core-instance',
      'Core/IoC',
      'Controls/Controllers/QueryParamsController',
      'WS.Data/Query/Query',
      'Core/Deferred',
      'Core/helpers/Function/forAliveOnly'
   ],
   function(cExtend, cInstance, IoC, QueryParamsController, Query, cDeferred, forAliveOnly) {
      var _private = {
         prepareSource: function(sourceOpt) {
            var result = sourceOpt;
            if (typeof result ==='object' && 'module' in sourceOpt) {
               var sourceConstructor = requirejs(sourceOpt.module);
               result = new sourceConstructor(sourceOpt.options || {});
            }
            if (!cInstance.instanceOfMixin(result, 'WS.Data/Source/ISource')) {
               IoC.resolve('ILogger').error('SourceController', 'Source option has incorrect type');
            }
            return result;

         },

         getQueryInstance: function (filter, sorting, offset, limit) {
            var query = new Query();
            query.where(filter)
               .offset(offset)
               .limit(limit)
               .orderBy(sorting);
            return query;
         },

         callQuery: function (dataSource, idProperty, filter, sorting, offset, limit) {
            var queryDef, queryIns;

            queryIns = _private.getQueryInstance(filter, sorting, offset, limit);

            queryDef = dataSource.query(queryIns).addCallback((function(dataSet) {
               if (idProperty && idProperty !== dataSet.getIdProperty()) {
                  dataSet.setIdProperty(idProperty);
               }
               return dataSet.getAll();
            }));

            if (cInstance.instanceOfModule(dataSource, 'WS.Data/Source/Memory')) {

               /*Проблема в том что деферред с синхронным кодом статического источника выполняется сихронно.
                в итоге в коолбэк релоада мы приходим в тот момент, когда еще не отработал _beforeMount и заполнение опций, и не можем обратиться к this._options*/
               var queryDefAsync = cDeferred.fromTimer(0);
               queryDefAsync.addCallback(function(){
                  return queryDef;
               });
               return queryDefAsync;
            }
            else {
               return queryDef;
            }
         }
      };
      var SourceController = cExtend.extend({
         _source: null,
         _queryParamsController: null,
         _loader: null,
         constructor: function (cfg) {
            this._options = cfg;
            SourceController.superclass.constructor.apply(this, arguments);
            this._source = _private.prepareSource(this._options.source);

            if (this._options.navigation && this._options.navigation.source) {
               this._queryParamsController = new QueryParamsController({
                  sourceType: this._options.navigation.source
               });
               this._queryParamsController.prepareSource(this._source);
            }
         },

         load: function(filter, sorting, direction) {
            var def, queryParams;

            queryParams = {
               filter: filter,
               sorting: sorting,
               limit: undefined,
               offset: undefined
            };
            //модифицируем параметры через навигацию
            if (this._queryParamsController) {
               queryParams = this._queryParamsController.paramsWithNavigation(queryParams, direction);
            }

            //позволяем модифицировать параметры юзеру
            /*TODO Событие решили пока убрать, сомнительна вообще его необходимость. Во всяком случае в beforeMount стрелять событием нельзя
            var userParams = self._notify('onBeforeDataLoad', queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit);
            if (userParams) {
               queryParams = _private.paramsWithUserEvent(queryParams, userParams);
            }
            */

            def = _private.callQuery(this._source, this._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
            this._loader = def;
            return def;
         },

         isLoading: function() {
            return this._loader && !this._loader.isReady();
         },

         destroy: function() {
            if (this._queryParamsController) {
               this._queryParamsController.destroy();
            }
         }
      });
      return SourceController;
   });
