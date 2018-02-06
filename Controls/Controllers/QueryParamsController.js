define('Controls/Controllers/QueryParamsController',
   [
      'Core/core-simpleExtend',
      'WS.Data/Source/SbisService',
      'Controls/Controllers/PageNavigation'
   ],
   function(cExtend, SbisService, PageNavigation) {
      var _private = {

      };
      var QueryParamsController = cExtend.extend({
         _paramsInst: null,
         constructor: function (cfg) {
            this._options = cfg;
            QueryParamsController.superclass.constructor.apply(this, arguments);
            this._paramsInst = new PageNavigation(this._options.sourceConfig); //TODO разный тип
         },

         prepareSource: function(source) {
            this._paramsInst.prepareSource(source);
         },

         paramsWithNavigation: function(params, direction) {
            var navigParams = this._paramsInst.prepareQueryParams(direction);
            params.limit = navigParams.limit;
            params.offset = navigParams.offset;
            //TODO фильтр и сортировка не забыть приделать
            return params;
         },

         calculateState: function(list, direction) {
            this._paramsInst.calculateState(list, direction);
         },

         hasMoreData: function(direction) {
            return this._paramsInst.hasMoreData(direction);
         },

         setEdgeState: function(direction) {
            this._paramsInst.setEdgeState(direction);
         },

         destroy: function() {
            if (this._paramsInst) {
               this._paramsInst.destroy();
            }
         }
      });
      return QueryParamsController;
   });
