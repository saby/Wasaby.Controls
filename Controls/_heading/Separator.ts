import Control = require('Core/Control');
import template = require('wml!Controls/_heading/Separator/Separator');
import entity = require('Types/entity');
import 'css!theme?Controls/heading';


   /**
    * Разделитель заголовков с поддержкой некоторых стилей отображения. 
    * Используется в составе сложных заголовков, состоящих из <a href="/docs/js/Controls/_heading/?v=3.18.500">header</a>, <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a> и <a href="/docs/js/Controls/_heading/Counter/?v=3.18.500">counter</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    *
    * @class Controls/_heading/Separator
    * @extends Core/Control
    * @control
    * @public
    * @author Красильников А.С.
    *
    * @demo Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo
    *
    * @mixes Controls/_heading/Separator/SeparatorStyles
    */

   /*
    * Heading separator with support some display styles. Used as part of complex headings(you can see it in Demo-example)
    * consisting of a <a href="/docs/js/Controls/_heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a> and a <a href="/docs/js/Controls/_heading/Counter/?v=3.18.500">counter</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/_heading/Separator
    * @extends Core/Control
    * @control
    * @public
    * @author Красильников А.С.
    *
    * @demo Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo
    *
    * @mixes Controls/_heading/Separator/SeparatorStyles
    */

   /**
    * @name Controls/_heading/Separator#style
    * @cfg {String} Стиль отображения иконки. В теме онлайна есть только один стиль отображения.
    * @variant primary
    * @variant secondary
    * @default secondary
    */

   /*
    * @name Controls/_heading/Separator#style
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant primary
    * @variant secondary
    * @default secondary
    */

   var Separator = Control.extend({
      _template: template
   });

   Separator.getOptionTypes =  function getOptionTypes() {
      return {
         style: entity.descriptor(String).oneOf([
            'secondary',
            'primary'
         ])
      };
   };

   Separator.getDefaultOptions = function() {
      return {
         style: 'secondary'
      };
   };

   export = Separator;

