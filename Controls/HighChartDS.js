define('Controls/HighChartDS', [
   'Core/Control',
   'tmpl!Controls/HighChartDS/HighChartDS',
   'browser!/cdn/highcharts/4.2.7/highcharts-more.js'
], function(Control, template) {

   /**
    * Компонент диаграмм работающий с БЛ
    */
   var HighChartDS = Control.extend({
      _template: template
   });

   return HighChartDS;
});