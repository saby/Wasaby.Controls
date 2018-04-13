define('Controls/HighCharts',
   [
      'Core/Control',
      'tmpl!Controls/HighCharts/HighCharts',
      'Core/constants',
      'Core/Date',
      'browser!/cdn/highcharts/4.2.7/highcharts-more.js'
   ],
   function(Control, template, constants) {
      'use strict';

      /**
       * Диаграмма HighCharts
       * @class Controls/HighCharts
       * @extends Core/Control
       * @control
       * @authors Волоцкой В.Д., Сухоручкин А.С.
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

            //Как добавят возможность использовать контейнер как _children поменять на
            //config.highChartOptions.chart.renderTo = this._children.highChartContainer

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
