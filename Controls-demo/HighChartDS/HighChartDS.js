define('Controls-demo/HighChartDS/HighChartDS', [
   'Core/Control',
   'tmpl!Controls-demo/HighChartDS/HighChartDS',
   'css!Controls-demo/HighChartDS/HighChartDS'
], function(Control, template) {

   return Control.extend({
      _template: template
   });
});