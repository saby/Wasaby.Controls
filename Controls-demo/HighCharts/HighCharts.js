define('Controls-demo/HighCharts/HighCharts', [
   'Core/Control',
   'tmpl!Controls-demo/HighCharts/HighCharts',
   'Controls-demo/HighCharts/DemoSource'
], function(Control, template, DemoSource) {

   return Control.extend({
      _template: template,

      _beforeMount: function() {
         this._filter = {
            'asd': 123
         };
         this._dataSource = new DemoSource();
      },
      _chartConfig: {
         credits: {
            enabled: false
         },
         chart: {
            type: 'line'
         }
      },
      _wsSeries: [{
         sourceFieldX: 'title',
         sourceFieldY: 'value',
         type: 'pie'
      }],
      _wsAxis: [{
         title: 'Прикол'
      }],
      _updateState: function() {
         this._filter = {
            'asd': 123
         };
      }
   });
});
