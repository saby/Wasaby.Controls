define('Controls/Header/Counter/Counter', [
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
    * @name Controls/Header#separatorIconStyle
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant primary Counter will be accented.
    * @variant default Counter will be default.
    * @variant disabled Counter will be disabled.
    */

   var Counter = Control.extend({
      _template: template,

      countClickHandler: function (e) {
         if(this._options.countClickable && this._options.clickable){
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
         ])
      }
   };

   return Counter;
});
