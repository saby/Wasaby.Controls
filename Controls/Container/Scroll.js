define('js!Controls/Container/Scroll',
   [
      'Core/Control',
      'tmpl!Controls/Container/Scroll/Scroll',
      'css!Controls/Container/Scroll/Scroll'
   ],
   function(Control, template) {

      'use strict';

      var ScrollContainer = Control.extend({
         _template: template
      });

      return ScrollContainer;
   }
);
