define('Controls-demo/HighCharts/HighCharts', [
   'Core/Control',
   'wml!Controls-demo/HighCharts/HighCharts',
   'Controls-demo/HighCharts/DemoSource'
], function(Control, template, DemoSource) {
   return Control.extend({
      _template: template,
      _wsSeries: null,
      _wsAxis: null,

      _beforeMount: function() {
         this._filter = '1';
         this._configState = '1';
         this._chartConfig = {
            credits: {
               enabled: false
            },
            title: {
               text: 'Example1'
            },
            chart: {

            }
         };
         this._dataSource = new DemoSource();
         this._wsSeries = [{
            sourceFieldX: 'title',
            sourceFieldY: 'value',
            type: 'pie'
         }];
         this._wsAxis = [{
            title: 'Title'
         }];
      },
      _updateConfig: function() {
         if (this._configState === '1') {
            this._configState = '2';
            this._chartConfig = {
               credits: {
                  enabled: false
               },
               title: {
                  text: 'Example2'
               },
               chart: {

               }
            };
         } else {
            this._configState = '1';
            this._chartConfig = {
               credits: {
                  enabled: false
               },
               title: {
                  text: 'Example1'
               },
               chart: {

               }
            };
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
