define('Controls-demo/HighChartDS/HighChartDS', [
   'Core/Control',
   'tmpl!Controls-demo/HighChartDS/HighChartDS',
   'css!Controls-demo/HighChartDS/HighChartDS'
], function(Control, template) {

   return Control.extend({
      _template: template,
      _chartConfig: {
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
      },
      _filter: {
         hello: "World"
      },
      _updateState: function() {
         this._chartConfig = {
            chart: {
               type: 'bar'
            },
            title: {
               text: 'Fruit Consumption'
            },
            xAxis: {
               categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
               title: {
                  text: 'Fruit eaten'
               }
            },
            series: [{
               name: 'Jane',
               data: [1, 0, 4]
            }, {
               name: 'John',
               data: [5, 7, 3]
            }]
         };
         this._filter = {
            name: 'vadim'
         };
      }
   });
});