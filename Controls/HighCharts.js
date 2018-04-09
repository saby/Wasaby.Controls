define('Controls/HighCharts',
   [
      'Core/Control',
      'tmpl!Controls/HighCharts/HighCharts',
      'css!Controls/HighCharts/HighCharts'
   ],
   function(Control, template) {
      return Control.extend({
         _template: template
      });
   });
