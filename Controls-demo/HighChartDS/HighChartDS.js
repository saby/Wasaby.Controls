define('Controls-demo/HighChartDS/HighChartDS', [
   'Core/Control',
   'tmpl!Controls-demo/HighChartDS/HighChartDS',
   'Controls-demo/HighChartDS/HighChartDemoDS',
   'css!Controls-demo/HighChartDS/HighChartDS'
], function(Control, template, DemoDS) {

   return Control.extend({
      _template: template,

      _beforeMount: function() {
         this._filter = {
            'asd': 123
         };
         this._dataSource = new DemoDS();
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
         name: 'asd',
         type: 'line'
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
