define('Controls-demo/HighCharts/HighCharts',
   [
      'Core/Control',
      'tmpl!Controls-demo/HighCharts/HighCharts'
   ],
   function (Control, template) {
      return Control.extend({
         _template: template
      });
   });
