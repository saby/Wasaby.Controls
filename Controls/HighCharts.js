define('Controls/HighCharts',
   [
      'Core/Control',
      'tmpl!Controls/HighCharts/HighCharts',
      'Core/constants',
      'Core/Date',
      'css!Controls/HighCharts/HighCharts',
      'browser!/cdn/highcharts/4.2.7/highcharts-more.js'
   ],
   function(Control, template, constants) {
      'use strict';

      /**
       * Component HighCharts
       * @class Controls/HighCharts
       * @extends Core/Control
       * @mixes Controls/interface/IHighCharts
       * @control
       * @authors Volotskoy V.D., Sukhoruchkin A.S.
       */

      var HighChart = Control.extend({
         _template: template,
         _highChartInstance: null,

         _shouldUpdate: function() {
            return false;
         },

         _afterMount: function(config) {
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
            this._drawChart(config);
         },

         _beforeUpdate: function(config) {
            if (this._options.highChartOptions !== config.highChartOptions) {
               this._drawChart(config);
            }
         },

         _drawChart: function(config) {
            config.highChartOptions.chart.renderTo = this._container;

            //TODO Как добавят возможность использовать контейнер как _children поменять на config.highChartOptions.chart.renderTo = this._children.highChartContainer
            //Ссылка на задачу: https://online.sbis.ru/opendoc.html?guid=e6e4454f-0f12-45e7-a390-86adfd5582a1

            config.highChartOptions.credits = config.highChartOptions.credits || {};
            config.highChartOptions.credits.enabled = false;
            if (this._highChartInstance) {
               this._highChartInstance.destroy();
            }
            this._highChartInstance = new Highcharts.Chart(config.highChartOptions);
         },

         _beforeUnmount: function() {
            this._highChartInstance.destroy();
            this._highChartInstance = undefined;
         }
      });

      return HighChart;
   });
