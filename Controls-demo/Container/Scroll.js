define('Controls-demo/Container/Scroll',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'Controls/Container/Scroll/Context',
      'tmpl!Controls-demo/Container/Scroll'
   ],
   function(Control, MemorySource, ScrollData, template) {
      return Control.extend({
         _template: template,

         _pagingVisible: true,

         _beforeMount: function() {
            var srcData = [];

            for (var id = 1; id < 100; id++) {
               srcData.push({
                  id: id,
                  title: 'Record ' + id
               });
            }
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: srcData
            });

            this._items = srcData;
         },

         _getChildContext: function() {
            return {
               ScrollData: new ScrollData({
                  pagingVisible: this._pagingVisible
               })
            };
         }
      });
   }
);