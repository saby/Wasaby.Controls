define('Controls/HighCharts', [
   'Core/Control',
   'tmpl!Controls/HighCharts/HighCharts',
   'Controls/HighCharts/Utils/ParseDataUtil',
   'Core/ILogger',
   'Core/core-clone'
], function(Control, template, Utils, ILogger, cClone) {

   /**
    * Component HighChartsLight
    * @class Controls/HighCharts
    * @extends Core/Control
    * @mixes Controls/interface/IHighCharts
    * @control
    * @authors Volotskoy V.D., Sukhoruchkin A.S.
    */
   var _private = {
         drawChart: function(self, recordSet) {
            var preparedData;
            if (recordSet) {
               preparedData = _private.prepareData(self._options.wsSeries, self._options.wsAxis, recordSet);
               self._chartOptions = _private.mergePreparedData(self._chartOptions, preparedData);
               self._forceUpdate();
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

         _beforeMount: function(opts, recordSet) {
            var self = this;
            this._chartOptions = opts.chartOptions;
            if (recordSet.getCount() !== 0) {
               this._recordSet = recordSet;
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
                  self._recordSet = data;
                  _private.drawChart(self, self._recordSet);
               });
            }
         }
      });

   return HighChartsDS;
});
