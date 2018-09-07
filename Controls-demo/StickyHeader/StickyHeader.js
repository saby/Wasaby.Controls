define('Controls-demo/StickyHeader/StickyHeader',
   [
      'Core/Control',
      'wml!Controls-demo/StickyHeader/StickyHeader',

      'css!Controls-demo/StickyHeader/StickyHeader',
      'Controls/Container/Scroll'
   ],
   function(Control, template) {

      'use strict';

      var StickyHeader = Control.extend({
         _template: template
      });

      return StickyHeader;
   }
);
