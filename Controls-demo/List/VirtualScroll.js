define('Controls-demo/List/VirtualScroll', [
   'Core/Control',
   'wml!Controls-demo/List/VirtualScroll/VirtualScroll',
   'WS.Data/Source/Memory',
   'css!Controls-demo/List/VirtualScroll/VirtualScroll'
], function(BaseControl,
            template,
            MemorySource
) {
   'use strict';

   function getData(count) {
      var data = [];
      for (var i = 0; i < count; i++) {
         data[i] = {
            id: i + 1,
            title: 'Какая то запись с id=' + (i + 1) + ' и индексом ' + i,
         };
         for (var j = 0; j < Math.round(0 - 0.5 + Math.random() * (10 - 0 + 1)); j++) {
            data[i].title += ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere nulla ex, consectetur lacinia odio blandit sit amet. ';
         }
      }
      return data;
   }

   var srcData = getData(1000);

   var ModuleClass = BaseControl.extend(
      {
         _template: template,

         constructor: function() {
            ModuleClass.superclass.constructor.apply(this, arguments);
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: srcData
            });
         },
         _onMoreClick: function() {
            this._children.listVirt.__loadPage('down');
         },
      });
   return ModuleClass;
});
