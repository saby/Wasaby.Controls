define('Controls/HighChartsDS', [
   'Core/Control',
   'tmpl!Controls/HighChartsDS/HighChartsDS',
   'WS.Data/Source/SbisService',
   'Controls/HighChartsDS/Utils/ParseDataUtil',
   'Core/ILogger',
   'Core/core-clone'
], function(Control, template, SbisService, Utils, ILogger, cClone) {

   /**
    * Компонент диаграмм работающий с БЛ
    */
   var _private = {
         drawChart: function(self, recordSet) {
            var preparedData;
            if (recordSet) {
               preparedData = _private.prepareData(self._options.wsSeries, self._options.wsAxis, recordSet);
               self._chartOptions = _private.mergePreparedData(self._chartOptions, preparedData);
            } else {
               ILogger.error('HighCharts', 'Data haven`t loaded');
            }
         },
         prepareData: function(wsSeries, wsAxis, recordSet) {
            var
               preparedSeries,
               tmpXAxis,
               tmpYAxis,
               tmpResult,
               parseRsResult;

            preparedSeries = Utils.recordSetParse(wsSeries, recordSet);
            
            tmpResult = Utils.parseAxisCommon(wsAxis);
            
            tmpXAxis = tmpResult.xAxis;
            tmpYAxis = tmpResult.yAxis;
            
            parseRsResult =  Utils.recordSetParseAxis(tmpXAxis, tmpYAxis, recordSet);

            return {
               series: preparedSeries,
               xAxis: parseRsResult.xAxis,
               yAxis: parseRsResult.yAxis
            };
         },
         mergePreparedData: function(chartOptions, preparedData) {
            var tmpOpts = cClone(chartOptions);
            tmpOpts.series = preparedData.series;
            tmpOpts.xAxis = preparedData.xAxis;
            tmpOpts.yAxis = preparedData.yAxis;
            return tmpOpts;
         }
      },
      HighChartsDS = Control.extend({
         _template: template,
         _chartOptions: {},

         _beforeMount: function(opts, rs) {
            var self = this;
            this._chartOptions = opts.chartOptions;
            if (Object.keys(rs).length !== 0) {
               this._recordSet = rs.getAll();
            } else if (opts.dataSource) {
               return opts.dataSource.query(opts.filter).addCallback(function(data) {
                  self._recordSet = data;
               });
            }
         },

         _afterMount: function() {
            if (this._recordSet) {
               _private.drawChart(this, this._recordSet);
            }
         },

         _beforeUpdate: function(opts) {
            var self = this;
            if (opts.filter !== this._options.filter) {
               opts.dataSource.query(opts.filter).addCallback(function(data) {
                  self._recordSet = data.getAll();
                  _private.drawChart(self, self._recordSet);
               });
            }
         }
      });

   return HighChartsDS;
});
