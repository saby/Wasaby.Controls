define('Controls-demo/Utils/ScrollToElementDemo', [
   'Core/Control',
   'Controls/Utils/scrollToElement',
   'Types/source',
   'wml!Controls-demo/Utils/ScrollToElementDemo'
], function(
   Control,
   scrollToElement,
   source,
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
         this._viewSource = new source.Memory({
            data: data,
            idProperty: 'id'
         });
      },

      _scrollTo: function(e, direction, elementNumber) {
         var listChildren = this._children.list._container.querySelectorAll('.controls-ListView__itemV');
         scrollToElement(direction === 'top' ? listChildren[0 + elementNumber] : listChildren[listChildren.length - 1 - elementNumber], direction === 'bottom');
      }
   });

   return ScrollToElementDemo;
});
