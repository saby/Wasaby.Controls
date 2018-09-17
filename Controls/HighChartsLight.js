define('Controls/HighChartsLight',
   [
      'Core/Control',
      'wml!Controls/HighChartsLight/HighChartsLight',
      'Core/constants',
      'Core/core-clone',
      'Core/Date',
      'css!?Controls/HighChartsLight/HighChartsLight',
      'browser!/cdn/highcharts/4.2.7/highcharts-more.js'
   ],
   function(Control, template, constants, cClone) {
      'use strict';

      /**
       * Component HighChartsLight
       * @class Controls/HighChartsLight
       * @extends Core/Control
       * @mixes Controls/interface/IHighCharts
       * @control
       * @authors Volotskoy V.D., Sukhoruchkin A.S.
       * @demo Controls-demo/HighChartsLight/HighChartsLight
       */

      var _private = {
            drawChart: function(self, config) {
               var tempConfig = cClone(config);
               tempConfig.chart.renderTo = self._children.chartContainer;
               tempConfig.credits = config.credits || {};
               tempConfig.credits.enabled = false;
               if (self._chartInstance) {
                  self._chartInstance.destroy();
               }
               self._chartInstance = new Highcharts.Chart(tempConfig);
            }
         },
         HighChart = Control.extend({
            _template: template,
            _chartInstance: null,

            _shouldUpdate: function() {
               return false;
            },

            _afterMount: function(config) {
               this._notify('register', ['controlResize', this, this._reflow], {bubbling: true});
               Highcharts.setOptions({
                  lang: {
                     numericSymbols: ['', '', '', '', '', ''],
                     months: constants.Date.longMonths,
                     shortMonths: constants.Date.months,
                     weekdays: constants.Date.longDays,
                     thousandsSep: ' '
                  },
                  plotOptions: {
                     series: {
                        animation: !constants.browser.isIE10
                     }
                  }
               });
               _private.drawChart(this, config.chartOptions);
            },

            _beforeUpdate: function(config) {
               if (this._options.chartOptions !== config.chartOptions) {
                  _private.drawChart(this, config.chartOptions);
               }
            },



            _beforeUnmount: function() {
               this._notify('unregister', ['controlResize', this], {bubbling: true});
               this._chartInstance.destroy();
               this._chartInstance = undefined;
            },

            _reflow: function() {
               this._chartInstance.reflow();
            }
         });

      return HighChart;
   });
