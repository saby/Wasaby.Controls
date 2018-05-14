define('Controls/HighChartsDS', [
   'Core/Control',
   'tmpl!Controls/HighChartsDS/HighChartsDS',
   'WS.Data/Source/SbisService',
   'Controls/HighChartsDS/Utils/ParseDataUtil'
], function(Control, template, SbisService, Utils) {

   /**
    * Компонент диаграмм работающий с БЛ
    */
   var _private = {
         drawChart: function(self, data) {
            self._currentData.data = data.getAll();
            preparedData = _private.prepareData(self);
            _private.mergePreparedData(self._chartOptions, preparedData);
         },
         prepareData: function(self) {
            var
               data = self._currentData.data,
               preparedSeries,
               preparedXAxis,
               preparedYAxis;

            if (data) {
               preparedSeries = Utils.recordSetParse(self._wsSeries, data);

               var
                  parseResult = Utils.parseAxisCommon(self._wsAxis),
                  parseRsResult;

               preparedXAxis = parseResult.xAxis;
               preparedYAxis = parseResult.yAxis;

               parseRsResult =  Utils.recordSetParseAxis(preparedXAxis, preparedYAxis, data);

               preparedXAxis = parseRsResult.xAxis;
               preparedYAxis = parseRsResult.yAxis;

               return {
                  series: preparedSeries,
                  xAxis: preparedXAxis,
                  yAxis: preparedYAxis
               };
            }
            else {
               throw new Error (rk('Данные не загружены'));
            }
         },
         mergePreparedData: function(chartOptions, preparedData) {
            chartOptions.series = preparedData.series;
            chartOptions.xAxis = preparedData.xAxis;
            chartOptions.yAxis = preparedData.yAxis;
         }
      },
      HighChartsDS = Control.extend({
         _template: template,
         _chartOptions: {},
         _wsSeries: {},
         _wsAxis: {},

         _beforeMount: function(opts) {
            opts.wsSeries && (this._wsSeries = opts.wsSeries);
            opts.wsAxis && (this._wsAxis = opts.wsAxis);
            if (opts.dataSource) {
               this._currentData = opts.dataSource.query(opts.filter);
               return this._currentData;
            }
         },

         _afterMount: function() {
            var
               self = this,
               preparedData;
            if(this._currentData) {
               this._currentData.addCallback(function(data) {
                  _private.drawChart(self, data);
               });
            }
         },

         _beforeUpdate: function(opts) {
            var self = this;
            if (opts.filter !== this._options.filter) {
               this._currentData.query(opts.filter).addCallback(function(data) {
                  _private.drawChart(self, data);
               });
            }
         }
      });

   return HighChartsDS;
});
