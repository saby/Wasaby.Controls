define('Controls-demo/HighCharts/HighCharts', [
   'Core/Control',
   'wml!Controls-demo/HighCharts/HighCharts',
   'Controls-demo/HighCharts/DemoSource'
], function(Control, template, DemoSource) {

   var _chartConfig1 = {
         credits: {
            enabled: false
         },
         title: {
            text: 'Example1'
         },
         chart: {

         }
      },
      _chartConfig2 = {
         credits: {
            enabled: false
         },
         title: {
            text: 'Example2'
         },
         chart: {

         }
      };

   return Control.extend({
      _template: template,

      _beforeMount: function() {
         this._filter = '1';
         this._configState = '1';
         this._chartConfig = _chartConfig1;
         this._dataSource = new DemoSource();
      },

      _wsSeries: [{
         sourceFieldX: 'title',
         sourceFieldY: 'value',
         type: 'pie'
      }],
      _wsAxis: [{
         title: 'Title'
      }],
      _updateConfig: function() {
         if (this._configState === '1') {
            this._configState = '2';
            this._chartConfig = _chartConfig2;
         } else {
            this._configState = '1';
            this._chartConfig = _chartConfig1;
         }
      },

      _updateFilter: function() {
         if (this._filter === '1') {
            this._filter = '2';
         } else {
            this._filter = '1';
         }
      },

      _updateConfigNFilter: function() {
         this._updateConfig();
         this._updateFilter();
      }
   });
});
