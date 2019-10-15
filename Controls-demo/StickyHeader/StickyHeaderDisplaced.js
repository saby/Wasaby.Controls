define('Controls-demo/StickyHeader/StickyHeaderDisplaced',
   [
      'Core/Control',
      'wml!Controls-demo/StickyHeader/StickyHeaderDisplaced',

      'css!Controls-demo/StickyHeader/StickyHeader'
   ],
   function(Control, template) {

      'use strict';

      var StickyHeader = Control.extend({
         _template: template,
         _headerVisible: false,
         _addButtonClickHandler: function() {
            this._headerVisible = !this._headerVisible;
         }
      });

      return StickyHeader;
   }
);
