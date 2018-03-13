define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'css!Controls/Header/Header'
], function(Control, IoC, template) {
   'use strict';

   var Header = Control.extend({
      _template: template,

      _clickHandler: function (e) {
         if (!this._options.clickable){
            e.stopPropagation();
         }
      }

   });

   return Header;
});
