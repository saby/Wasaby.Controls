define('Controls/Header/Counter', [
   'Core/Control',
   'tmpl!Controls/Header/Counter/Counter',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Counter/Counter'
], function(Control, template, types) {
   'use strict';

   /**
    * Counter with support three display styles and three size. Can be used to display complex headers
    * along with a header, a header-separator and a button-separator.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    *
    * @class Controls/Header/Counter
    * @extends Core/Control
    * @control
    * @public
    *
    * @demo Controls-demo/Headers/Counter/counterDemo
    *
    * @mixes Controls/Header/Counter/CounterStyles
    */

   /**
    * @name Controls/Header/Counter#value
    * @cfg {String} Current state.
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
    * @variant primary Primary counter style.
    * @variant default Default counter style. It is default value.
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
            'default',
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
         style: 'default',
         size: 'm'
      };
   };

   return Counter;
});
