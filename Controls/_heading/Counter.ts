import Control = require('Core/Control');
import template = require('wml!Controls/_heading/Counter/Counter');
import entity = require('Types/entity');
import 'css!theme?Controls/heading';


   /**
    * Counter with support different display styles and sizes. Used as part of complex headers(you can see it in Demo-example)
    * consisting of a <a href="/docs/js/Controls/_heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/_heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/_heading/Counter
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    *
    * @demo Controls-demo/Headers/Counter/counterDemo
    *
    * @mixes Controls/_heading/Counter/HeadingCounterStyles
    */

   /**
    * @name Controls/_heading/Counter#size
    * @cfg {String} Size of Counter.
    * @variant l Large counter size.
    * @variant m Medium counter size.
    * @variant s Small counter size.
    * @default m
    */

   /**
    * @name Controls/_heading/Counter#style
    * @cfg {String} Counter displaying style.
    * @variant primary
    * @variant secondary
    * @variant disabled
    * @default primary
    */

   var Counter = Control.extend({
      _template: template
   });

   Counter.getOptionTypes =  function getOptionTypes() {
      return {
         value: entity.descriptor(Number),
         style: entity.descriptor(String).oneOf([
            'primary',
            'secondary',
            'disabled'
         ]),
         size: entity.descriptor(String).oneOf([
            'm',
            's',
            'l'
         ])
      };
   };

   Counter.getDefaultOptions = function() {
      return {
         style: 'primary',
         size: 'm'
      };
   };

   export = Counter;

