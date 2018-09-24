define('Controls/Header/Counter', [
   'Core/Control',
   'wml!Controls/Header/Counter/Counter',
   'WS.Data/Type/descriptor',
   'css!theme?Controls/Header/Counter/Counter'
], function(Control, template, types) {
   'use strict';

   /**
    * Counter with support different display styles and sizes. Used as part of complex headers(you can see it in Demo-example)
    * consisting of a <a href="/docs/js/Controls/Header/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/Header/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/Header/Counter
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    *
    * @demo Controls-demo/Headers/Counter/counterDemo
    *
    * @mixes Controls/Header/Counter/CounterStyles
    */

   /**
    * @name Controls/Header/Counter#size
    * @cfg {String} Size of Counter.
    * @variant l Large counter size.
    * @variant m Medium counter size. It is default value.
    * @variant s Small counter size.
    */

   /**
    * @name Controls/Header/Counter#style
    * @cfg {String} Counter displaying style.
    * @variant primary Primary counter style. It is default value.
    * @variant secondary Secondary counter style.
    * @variant disabled Disabled counter style.
    */

   var Counter = Control.extend({
      _template: template
   });

   Counter.getOptionTypes =  function getOptionTypes() {
      return {
         value: types(Number),
         style: types(String).oneOf([
            'primary',
            'secondary',
            'disabled'
         ]),
         size: types(String).oneOf([
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

   return Counter;
});
