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
         highChartObj: null,

         _shouldUpdate: function() {
            return false;
         },

         _beforeMount: function() {
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
         },

         _afterMount: function(config) {
            this._drawChart(config);
         },

         _beforeUpdate: function(config) {
            if (this._options.highChartOptions !== config.highChartOptions) {
               this._drawChart(config);
            }
         },

         _drawChart: function(config) {
            config.highChartOptions.chart.renderTo = this._children[this._options.highChartContainer];
            this.highChartObj = new Highcharts.Chart(config.highChartOptions);
         },

         _beforeUnmount: function () {
            this.highChartObj.destroy();
            this.highChartObj = undefined;
         }
      });

      return HighChart;
   });
