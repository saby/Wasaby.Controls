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
         if(!this._options.commonClick){
            e.stopPropagation();
            this._notify('countClick');
         }
      }
   });

   return Header;
});
