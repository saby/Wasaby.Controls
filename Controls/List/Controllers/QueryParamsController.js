define('Controls/List/Controllers/QueryParamsController',
   [
      'Core/core-simpleExtend',
      'WS.Data/Source/SbisService',
      'Controls/List/Controllers/PageNavigation'
   ],
   function(cExtend, SbisService, PageNavigation) {
      var _private = {

      };
      var QueryParamsController = cExtend.extend({
         _paramsInst: null,
         constructor: function (cfg) {
            this._options = cfg;
            QueryParamsController.superclass.constructor.apply(this, arguments);
            this._paramsInst = new PageNavigation(navOption.sourceConfig); //TODO разный тип
         },

         prepareSource: function(source) {
            var options = source.getOptions();
            options.navigationType = SbisService.prototype.NAVIGATION_TYPE.PAGE; //TODO разный тип
            source.setOptions(options);
         },

         paramsWithNavigation: function(params, direction) {
            var navigParams = this._paramsInst.prepareQueryParams(direction);
            params.limit = navigParams.limit;
            params.offset = navigParams.offset;
            //TODO фильтр и сортировка не забыть приделать
            return params;
         }
      });
      return QueryParamsController;
   });
