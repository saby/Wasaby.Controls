define('Controls-demo/HighChartsLight/HighChartsLight',
   [
      'Core/Control',
      'tmpl!Controls-demo/HighChartsLight/HighChartsLight',
      'css!Controls-demo/HighChartsLight/HighChartsLight'
   ],
   function(Control, template) {
      return Control.extend({
         _template: template,
         need: true,
         toggleCaption: 'Убрать диаграмму',
         highChartOptions1: null,
         highChartOptions2: null,
         _beforeMount: function() {
            this.highChartOptions1 = {
               credits: {
                  enabled: false
               },
               chart: {
                  type: 'line'
               },
               series: [{
                  name: 'USD to EUR',
                  data: [10, 20]
               }]
            };
            this.highChartOptions2 = {
               chart: {
                  type: 'pie'
               },
               series: [{
                  name: 'USD to EUR',
                  data: [10, 20]
               }]
            };
         },
         changeHighChartOptions: function () {
            this.highChartOptions1 = {
               chart: {
                  type: 'line'
               },
               series: [{
                  name: 'USD to EUR',
                  data: [10, 20]
               }]
            };
         },
         toggleChart: function () {
            if (this.need) {
               this.toggleCaption = 'Показать диаграмму';
               this.need = false;
            } else {
               this.toggleCaption = 'Убрать диаграмму';
               this.need = true;
            }
         }
      });
   });
