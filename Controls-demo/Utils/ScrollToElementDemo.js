define('Controls-demo/Utils/ScrollToElementDemo', [
   'Core/Control',
   'Controls/Utils/scrollToElement',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/Utils/ScrollToElementDemo'
], function(
   Control,
   scrollToElement,
   Memory,
   template
) {
   'use strict';

   var ScrollToElementDemo = Control.extend({
      _template: template,

      _beforeMount: function() {
         var data = [];
         for (var i = 0; i < 20; i++) {
            data.push({
               id: i,
               title: i
            });
         }
         this._viewSource = new Memory({
            data: data,
            idProperty: 'id'
         });
      },

      _scrollTo: function(e, direction) {
         var listChildren = this._children.list._container.querySelectorAll('.controls-ListView__itemV');
         scrollToElement(direction === 'top' ? listChildren[0] : listChildren[listChildren.length - 1]);
      }
   });

   return ScrollToElementDemo;
});
