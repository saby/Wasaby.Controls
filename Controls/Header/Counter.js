define('Controls/Header/Counter', [
   'Core/Control',
   'tmpl!Controls/Header/Counter/Counter',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Counter/Counter'
], function(Control, template, types) {
   'use strict';

   /**
    * Control showing the counter.
    * @class Controls/Header/Counter
    * @extends Core/Control
    * @control
    * @public
    *
    * @mixes Controls/Header/Counter/CounterStyles
    */

   /**
    * @name Controls/Header/Counter#value
    * @cfg {String} Value of Counter.
    */

   /**
    * @name Controls/Header/Counter#size
    * @cfg {String} Size of Counter.
    * @variant l Counter has large size.
    * @variant m Counter has middle size.
    * @variant s Counter has small size.
    */

   /**
    * @name Controls/Header/Counter#style
    * @cfg {String} Counter displaying style.
    * @variant primary Counter will be accented.
    * @variant default Counter will be default.
    * @variant disabled Counter will be disabled.
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
