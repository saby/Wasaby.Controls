define('Controls-demo/HighCharts/HighCharts', [
   'Core/Control',
   'tmpl!Controls-demo/HighCharts/HighCharts',
   'Controls-demo/HighCharts/DemoSource'
], function(Control, template, DemoSource) {

   return Control.extend({
      _template: template,

      _beforeMount: function() {
         this._filter = '1';
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
         if (this._filter === '1') {
            this._filter = '2';
         } else {
            this._filter = '1';
         }
      }
   });
});
