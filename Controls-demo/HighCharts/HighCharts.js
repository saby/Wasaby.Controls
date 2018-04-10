define('Controls-demo/HighCharts/HighCharts',
   [
      'Core/Control',
      'tmpl!Controls-demo/HighCharts/HighCharts'
   ],
   function(Control, template) {
      return Control.extend({
         _template: template,
         highChartOptions1: {
            chart: {
               type: 'line'
            },
            series: [{
               name: 'USD to EUR',
               data: [10, 20]
            }]
         },
         highChartOptions2: {
            chart: {
               type: 'pie'
            },
            series: [{
               name: 'USD to EUR',
               data: [10, 20]
            }]
         },
         highChartOptions3: {
            chart: {
               type: 'line'
            },
            series: [{
               name: 'USD to EUR',
               data: [10, 20]
            }]
         },
         changeHighChartOptions: function () {
            this.highChartOptions1 = this.highChartOptions3;
         }
      });
   });
