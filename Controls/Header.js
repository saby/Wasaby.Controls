define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'css!Controls/Header/Header'
], function(Control, IoC, template) {
   'use strict';

   var Header = Control.extend({
      _template: template,

      countClickHandler: function (e) {
         if(!this._options.countClickable){
            e.stopPropagation();
            this._notify('countClick');
         }
      }
   });

   Header.getOptionTypes =  function getOptionTypes() {
      return {
         caption: types(String),
         style: types(String).oneOf([
            'default_big',
            'primary_big',
            'default',
            'primary'
         ]),
         clickable: types(Boolean),
         counterValue: types(Number),
         counterLocation: types(String).oneOf([
            'after',
            'before'
         ]),
         counterStyle: types(String).oneOf([
            'primary',
            'default',
            'disabled'
         ]),
         counterSize: types(String).oneOf([
            'h6',
            'h7'
         ]),
         countClickable: types(Boolean),
         size: types(String).oneOf([
            'l',
            'default',
            's'
         ])
      }
   };

   return Header;
});
