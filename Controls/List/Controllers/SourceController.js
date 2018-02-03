define('Controls/List/Controllers/SourceController',
   [
      'Core/core-simpleExtend',
      'Core/core-instance',
      'Core/IoC',
      'Controls/List/Controllers/QueryParamsController'],
   function(cExtend, cInstance, IoC, QueryParamsController) {
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
         initNavigation: function(navOption, dataSource) {
            var navController;
            if (navOption && navOption.source === 'page') {
               navController = new PageNavigation(navOption.sourceConfig);
               navController.prepareSource(dataSource);
            }
            return navController;
         }
      };
      var SourceController = cExtend.extend({
         _source: null,
         _queryParamsController: null,
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

            def = DataSourceUtil.callQuery(self._dataSource, self._options.idProperty, queryParams.filter, queryParams.sorting, queryParams.offset, queryParams.limit)
               .addCallback(fHelpers.forAliveOnly(function (list) {
                  self._notify('onDataLoad', list);

                  //TODO это кривой способ заставить пэйджинг пересчитаться. Передалть, когда будут готовы команды от Зуева
                  //убираю, когда будет готов реквест от Зуева
                  setTimeout(function(){
                     if (self._scrollPagingCtr) {
                        self._scrollPagingCtr.resetHeights();
                     }
                  }, 100);

                  _private.hideIndicator(self);

                  return list;
               }, self))
               .addErrback(fHelpers.forAliveOnly(function(err){
                  _private.processLoadError(self, err);
               }, self));
            self._loader = def;
            return def;
         }
      });
      return SourceController;
   });
