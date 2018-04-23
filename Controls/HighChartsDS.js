define('Controls/HighChartsDS', [
   'Core/Control',
   'tmpl!Controls/HighChartsDS/HighChartsDS',
   'WS.Data/Source/SbisService',
   'WS.Data/Query/Query',
   'css!Controls/HighChartsDS/HighChartsDS'
], function (Control, template, SbisService, Query) {

   /**
    * Компонент диаграмм работающий с БЛ
    */
   var _private = {
         dataSource: {},

         wsSeries: {},
         wsAxis: {},
         filter: {},
         initDataSource: function() {
            _private.dataSource = new SbisService({
               endpoint: _private.endpoint
            });
         },
         getFilter: function() {
            return _private.filter;
         },
         callQuery: function(filter) {
            _private.filter = filter || _private.getFilter() || {};
            return _private.dataSource.call(_private.query, _private.getFilter());
         }
      },
      HighChartsDS = Control.extend({
         _template: template,
         _chartOptions: {},

         _beforeMount: function(opts) {
            this._chartOptions = opts.chartOptions;
         },

         _beforeUpdate: function(opts) {
            var self = this;
            if (opts.filter !== _private.getFilter()) {
               _private.callQuery(opts.filter).addCallback(function () {
                  debugger;
               });
            }
         }
      });

   return HighChartsDS;
});