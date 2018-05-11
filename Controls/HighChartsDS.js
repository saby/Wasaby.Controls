define('Controls/HighChartsDS', [
   'Core/Control',
   'tmpl!Controls/HighChartsDS/HighChartsDS',
   'WS.Data/Source/SbisService',
   'WS.Data/Query/Query',
   'css!Controls/HighChartsDS/HighChartsDS'
], function(Control, template, SbisService, Query) {

   /**
    * Компонент диаграмм работающий с БЛ
    */
   var _private = {
         dataSource: {},

         wsSeries: {},
         wsAxis: {},
         filter: {},
         initDataSource: function(endpoint) {
            _private.dataSource = new SbisService({
               endpoint: endpoint
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
            var tmpArr = opts.query.split('.');
            _private.initDataSource(tmpArr[0]);
            _private.query = tmpArr[1];
            this._chartOptions = opts.chartOptions;
         },

         _beforeUpdate: function(opts) {
            var self = this;
            if (opts.filter !== _private.getFilter()) {
               _private.callQuery(opts.filter).addErrback(function() {
                  self._chartOptions = {
                     credits: {
                        enabled: false
                     },
                     chart: {
                        type: 'line'
                     },
                     series: [{
                        name: 'USD to EUR',
                        data: [10, 20]
                     }]
                  };
               });
            }
         }
      });

   return HighChartsDS;
});
