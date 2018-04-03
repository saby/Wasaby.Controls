define('Controls/Header/Counter', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Counter/Counter',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Counter/Counter'
], function(Control, IoC, template, types) {
   'use strict';

   /**
    * Control showing the counter.
    * @class Controls/Header
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Header#value
    * @cfg {String} Value of Counter.
    */

   /**
    * @name Controls/Header#size
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant l Counter has large size.
    * @variant m Counter has middle size.
    * @variant s Counter has small size.
    */

   /**
    * @name Controls/Header#style
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant primary Counter will be accented.
    * @variant default Counter will be default.
    * @variant disabled Counter will be disabled.
    */

   /**
    * @name Controls/Header#singleClick
    * @cfg {Boolean} The ability to send a single event when icon was clicked. Event name is countClick.
    */

   var Counter = Control.extend({
      _template: template,

      countClickHandler: function (e) {
         if(this._options.singleClick){
            e.stopPropagation();
            this._notify('countClick');
         }
      }
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
         ]),
         singleClick: types(Boolean)
      }
   };

   Counter.getDefaultOptions = function() {
      return {
         style: 'default',
         size: 'm',
         singleClick: false
      };
   };

   return Counter;
});
