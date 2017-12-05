define([
   'js!Controls/List/Controllers/VirtualScroll',
   'js!Controls/List/ListControl/ListViewModel',
   'WS.Data/Collection/RecordSet'
], function(VirtualScroll, ListViewModel, RecordSet) {

   describe('Controls/List/Controllers/VirtualScroll', function() {
      var displayCount = 500;

      function prepareListViewModel() {
         var srcData = [];
         for(var i = 0; i < displayCount; i++) {
            srcData.push({
               id: i,
               title: 'Item ' + i
            });
         }

         var items = new RecordSet({
            idProperty: 'id',
            rawData: srcData,
            adapter: 'adapter.json'
         });

         return new ListViewModel({
            items: items,
            idProperty: 'id',
            displayProperty: 'title'
         });
      }

      var virtualScroll = new VirtualScroll({
         maxRows: 75,
         rowHeight: 25,
         listModel: prepareListViewModel(),
         displayCount: 500
      });

      beforeEach(function() {

      });

      //Корректность метода вычисления текущей страницы
      it('Calc current page', function() {
         virtualScroll.calcVirtualWindow(0, virtualScroll._listModel);
         assert.equal(virtualScroll._currentPage, 0);

         virtualScroll.calcVirtualWindow(200, virtualScroll._listModel);
         assert.equal(virtualScroll._currentPage, 1);

         virtualScroll.calcVirtualWindow(2000, virtualScroll._listModel);
         assert.equal(virtualScroll._currentPage, 6);
      });

      it('Scroll to top List', function() {
         var res = virtualScroll.calcVirtualWindow(0, virtualScroll._listModel);

         assert.equal(res.topPlaceholderHeight, 0);
         assert.equal(res.bottomPlaceholderHeight, 11250);
         assert.equal(res.indexStart, 0);
         assert.equal(res.indexStop, 50);
      });

      it('Scroll to middle List', function() {
         var res = virtualScroll.calcVirtualWindow(5286, virtualScroll._listModel);

         assert.equal(res.topPlaceholderHeight, 4650);
         assert.equal(res.bottomPlaceholderHeight, 5975);
         assert.equal(res.indexStart, 186);
         assert.equal(res.indexStop, 261);
      });

      it('Scroll to bottom List', function() {
         var res = virtualScroll.calcVirtualWindow(12325, virtualScroll._listModel);

         assert.equal(res.topPlaceholderHeight, 11700);
         assert.equal(res.bottomPlaceholderHeight, 0);
         assert.equal(res.indexStart, 468);
         assert.equal(res.indexStop, 500);

      });

      afterEach(function() {

      });

   })
});