define('Controls/Header/Counter/Counter', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Counter/Counter',
   'css!Controls/Header/Counter/Counter'
], function(Control, IoC, template) {
   'use strict';

   var Counter = Control.extend({
      _template: template,
      
      clickHandler: function (e) {
         this._notify('countClick');
      }

   });

   return Counter;
});
