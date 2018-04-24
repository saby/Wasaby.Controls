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
         this._filter = {
            name: 'vadim'
         };
      }
   });
});