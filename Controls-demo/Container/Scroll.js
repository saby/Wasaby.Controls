define('Controls-demo/Container/Scroll',
   [
      'Core/Control',
      'Types/source',
      'Controls/Container/Scroll/Context',
      'wml!Controls-demo/Container/Scroll',
      'css!Controls-demo/Container/Scroll'
   ],
   function(Control, source, ScrollData, template) {
      return Control.extend({
         _template: template,
         _pagingVisible: true,
         _scrollbarVisible: true,
         _shadowVisible: true,
         _numberOfRecords: 50,
         _selectedStyle: 'normal',
         _scrollStyleSource: null,

         _beforeMount: function() {
            this._scrollStyleSource = new source.Memory({
               idProperty: 'title',
               data: [{
                  title: 'normal'
               }, {
                  title: 'inverted'
               }]
            });
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