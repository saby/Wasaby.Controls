define('Controls-demo/Container/Scroll',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'Controls/Container/Scroll/Context',
      'wml!Controls-demo/Container/Scroll'
   ],
   function(Control, MemorySource, ScrollData, template) {
      return Control.extend({
         _template: template,

         _pagingVisible: true,

         _scrollbarVisible: true,

         _shadowVisible: true,

         _numberOfRecords: 100,

         _innerScroll: false,

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