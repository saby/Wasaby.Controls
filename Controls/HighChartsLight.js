define('Controls/HighChartsLight',
   [
      'Core/Control',
      'wml!Controls/HighChartsLight/HighChartsLight',
      'Core/constants',
      'Core/detection',
      'Core/core-clone',
      'Core/Date',
      'css!theme?Controls/HighChartsLight/HighChartsLight',
      'i18n!Controls/HighChartsLight',
      'browser!/cdn/highcharts/4.2.7/highcharts-more.js'
   ],
   function(Control, template, constants, detection, cClone) {
      'use strict';

      /**
       * Component HighChartsLight
       * @class Controls/HighChartsLight
       * @extends Core/Control
       * @mixes Controls/interface/IHighCharts
       * @control
       * @author Волоцкой В.Д.
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
            },
            patchHighchartsJs: function() {
               if (window.Highcharts && !window.Highcharts._isPatched) {
                  var originalIsObject = window.Highcharts.isObject;

                  window.Highcharts._isPatched = true;

                  /*
                     Highcharts in IE 10 fails because it exceeds stack size
                     limit while cloning the config that contains WS Data
                     objects: Models, Maps, ...

                     Highcharts uses its own `isObject` function to see if it
                     should deep clone an object or copy the reference.
                     We replace this isObject function in IE 10 so it would not
                     deep clone WS Data objects.
                  */
                  window.Highcharts.isObject = function(obj, strict) {
                     var isWSObject = obj && obj._moduleName;
                     return !isWSObject && originalIsObject(obj, strict);
                  };
               }
            }
         },
         HighChart = Control.extend({
            _template: template,
            _chartInstance: null,

            _beforeMount: function() {
               if (typeof window !== 'undefined' && detection.isIE10) {
                  _private.patchHighchartsJs();
               }
            },

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
                     thousandsSep: ' ',
                     resetZoom: rk('Сбросить масштабирование'),
                     resetZoomTitle: rk('Сбросить масштабирование')
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
