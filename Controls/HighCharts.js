define('Controls/HighCharts', [
   'Core/Control',
   'wml!Controls/HighCharts/HighCharts',
   'Controls/HighCharts/resources/ParseDataUtil',
   'Core/core-merge'
], function(Control, template, ParseDataUtil, cMerge) {

   /**
    * Component HighCharts
    * @class Controls/HighCharts
    * @extends Core/Control
    * @mixes Controls/interface/IHighCharts
    * @control
    * @author Волоцкой В.Д.
    * @demo Controls-demo/HighCharts/HighCharts
    */

   /**
    * @typedef {Object} chartType
    * @variant line Line chart
    * @variant spline Polynomial line chart
    * @variant pie Pie chart
    * @variant column Column chart
    * @variant bar Column horizontal chart
    * @variant area Area chart
    * @variant areaspline Polynomial area chart
    * @variant scatter Dot chart
    * @variant arearange Interval chart
    * @variant areasplinerange Polynomial interval chart
    */

   /**
    * @typedef {Object} wsSeries
    * @property {chartType} [type=line] Type of chart
    * @property {string} name Chart name
    * @property {string} sourceFieldX Source field for X axis (For pie charts - for title of slice)
    * @property {string} sourceFieldY Source field for Y axis (For pie charts - for value of slice)
    * @property {string} sourceField_3 Source field for intervals (For pie charts - for color of slice)
    * @property {string} color Color of chart
    * @property {Number} xAxis Number of related X axis
    * @property {Number} yAxis Number of related Y axis
    */

   /**
    * @typedef {Object} typeAxis
    * @variant xAxis Horizontal axis
    * @variant yAxis Vertical axis
    */

   /**
    * @typedef {Object} wsAxis
    * @property {typeAxis} [type=xAxis] Type of axis
    * @property {String} sourceField Source data field
    * @property {String} title Title
    * @property {Number} [gridLineWidth=0] Line width of grid
    * @property {function} labelsFormatter Render function for labels
    * @property {Number} [staggerLines=0] Quantity of lines for label render
    * @property {Number} [step=0] Step for label sign
    * @property {Number} [lineWidth=1] LineWidth
    * @property {Boolean} [allowDecimals=true] Allow decimals value
    * @property {Number} min Minimal value
    * @property {Number} max Maximum value
    * @property {Boolean} opposite Place axis opposite standart position
    * @property {Number} linkedTo Number of related axis
    * @translatable title
    */

   /**
    * @name Controls/HighCharts#wsSeries
    * @cfg {wsSeries[]} Array of charts
    */

   /**
    * @name Controls/HighCharts#wsAxis
    * @cfg {wsAxis[]} Array of axis
    */


   var _private = {
         loadData: function(dataSource, filter) {
            return dataSource.query(filter).addCallback(function(dataSet) {
               return dataSet.getAll();
            });
         },
         drawChart: function(self, preparedData) {
            self._chartOptions = _private.mergeNewOptions(self._chartOptions, preparedData);
         },
         prepareData: function(wsSeries, wsAxis, recordSet) {
            var
               preparedSeries,
               tmpXAxis,
               tmpYAxis,
               tmpResult,
               parseRsResult;

            preparedSeries = ParseDataUtil.recordSetParse(wsSeries, recordSet);
            
            tmpResult = ParseDataUtil.parseAxisCommon(wsAxis);
            
            tmpXAxis = tmpResult.xAxis;
            tmpYAxis = tmpResult.yAxis;
            
            parseRsResult =  ParseDataUtil.recordSetParseAxis(tmpXAxis, tmpYAxis, recordSet);

            return {
               series: preparedSeries,
               xAxis: parseRsResult.xAxis,
               yAxis: parseRsResult.yAxis
            };
         },
         mergeNewOptions: function(chartOptions, newOptions) {
            return cMerge({}, cMerge(chartOptions, newOptions));
         }
      },
      HighCharts = Control.extend({
         _template: template,
         _chartOptions: {},
         _highChartsRecordSet: null,

         _beforeMount: function(opts, context, receivedState) {
            var self = this;
            this._chartOptions = opts.chartOptions;
            if (receivedState) {
               this._highChartsRecordSet = receivedState;
            } else if (opts.dataSource) {
               return _private.loadData(opts.dataSource, opts.filter).addCallback(function(recordSet) {
                  self._highChartsRecordSet = recordSet;
                  return self._highChartsRecordSet;
               });
            }
         },

         _afterMount: function(opts) {
            var preparedData;
            if (this._highChartsRecordSet) {
               preparedData = _private.prepareData(opts.wsSeries, opts.wsAxis, this._highChartsRecordSet);
               _private.drawChart(this, preparedData);

               //Have to call forceUpdate in afterMount, because afterMount can`t update children components
               this._forceUpdate();
            }
         },

         _beforeUpdate: function(opts) {
            var
               self = this,
               preparedData;
            if (opts.chartOptions !== self._chartOptions) {
               self._chartOptions = _private.mergeNewOptions(self._chartOptions, opts.chartOptions);
            }
            if (opts.dataSource && (opts.filter !== this._options.filter || opts.dataSource !== self._options.dataSource)) {
               _private.loadData(opts.dataSource, opts.filter).addCallback(function(recordSet) {
                  preparedData = _private.prepareData(opts.wsSeries, opts.wsAxis, recordSet);
                  _private.drawChart(self, preparedData);
               });
            }
         }
      });

   return HighCharts;
});
