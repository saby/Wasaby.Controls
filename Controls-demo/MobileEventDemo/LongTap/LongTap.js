define('Controls-demo/MobileEventDemo/LongTap/LongTap',
   [
      'Core/Control',
      'wml!Controls-demo/MobileEventDemo/LongTap/LongTap',
      'css!Controls-demo/MobileEventDemo/LongTap/LongTap'
   ],
   function(Control, template) {
      'use strict';

      var LongTapDemo = Control.extend({
         _template: template,
         longTapCount: null,
         swipeCount: null,
         tapCount: null,

         _beforeMount: function() {
            this.longTapCount = 0;
            this.swipeCount = 0;
            this.tapCount = 0;
         },

         longClick: function() {
            this.longTapCount += 1;
         },

         simpleClick: function() {
            this.tapCount += 1;
         },
         swipe: function() {
            this.swipeCount += 1;
         }
      });
      return LongTapDemo;
   }
);
