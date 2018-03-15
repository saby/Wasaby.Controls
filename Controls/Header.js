define('Controls/Header', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Header',
   'css!Controls/Header/Header'
], function(Control, IoC, template) {
   'use strict';

   var _private = {
      captionWithOutClick: function (self, options) {
         if (options.style === 'primary_big' || options.style === 'default_big'){
            self._options.clickable = false;
         }
      },

      selectClick: function (self, nameEvent) {
         if( self._options.commonClick ) {
            self._notify('headerClick');
         }else {
            self._notify(nameEvent);
         }
      }
   };

   var Header = Control.extend({
      _template: template,

      constructor: function (options) {
         Header.superclass.constructor.apply(this, arguments);
         _private.captionWithOutClick(this, options);
      },

      _beforeUpdate: function (newOptions) {
         _private.captionWithOutClick(this, newOptions);
      },

      clickHandler: function (e) {
         if(this._options.clickable) {
            _private.selectClick(this, 'tittleClick');
         }
      },

      countClickHandler: function (e) {
         _private.selectClick(this, 'countClick');
      }

   });

   Header._private = _private;

   return Header;
});
