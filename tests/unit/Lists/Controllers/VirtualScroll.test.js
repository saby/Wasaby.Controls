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
         maxVisibleRows: 75,
         rowHeight: 25,
         listModel: prepareListViewModel(),
         itemsCount: 500
      });

      beforeEach(function() {

      });

      //Корректность метода вычисления текущей страницы
      it('Calc current page', function() {
         var pageInfo = VirtualScroll._private.getPage(0, 25);
         assert.equal(pageInfo.page, 0);

         pageInfo = VirtualScroll._private.getPage(200, 25);
         assert.equal(pageInfo.page, 1);

         pageInfo = VirtualScroll._private.getPage(2000, 25);
         assert.equal(pageInfo.page, 6);
      });

      //Корректность метода вычисления видимого диапазона
      it('Calc range to show', function() {
         var res = VirtualScroll._private.getRangeToShowByIndex(0, 75, 500);
         assert.equal(res.start, 0);
         assert.equal(res.stop, 50);

         res = VirtualScroll._private.getRangeToShowByIndex(25, 75, 500);
         assert.equal(res.start, 0);
         assert.equal(res.stop, 75);

         res = VirtualScroll._private.getRangeToShowByIndex(500, 75, 500);
         assert.equal(res.start, 475);
         assert.equal(res.stop, 500);

      });

      //Проверка рассчета индексов/распорок после изменяения общего числа записей проекции
      it('Add items', function() {
         virtualScroll.setRowCount(25);
         virtualScroll.calcVirtualWindow(0);
         virtualScroll.updateOnAddingItems(0, 100);
         var res = virtualScroll.getVirtualWindow();

         assert.equal(res.topPlaceholderHeight, 0);
         assert.equal(res.bottomPlaceholderHeight, 1875);
         assert.equal(res.indexStart, 0);
         assert.equal(res.indexStop, 50);
         assert.equal(virtualScroll._rowCount, 125);

         //Сбросим текущую страницу, чтобы не влияала на следующие тесты
         virtualScroll._currentPage = -1;
      });

      it('Scroll to top List', function() {
         virtualScroll.setRowCount(500);
         var res = virtualScroll.calcVirtualWindow(0);

         assert.equal(res.virtualWindow.topPlaceholderHeight, 0);
         assert.equal(res.virtualWindow.bottomPlaceholderHeight, 11250);
         assert.equal(res.virtualWindow.indexStart, 0);
         assert.equal(res.virtualWindow.indexStop, 50);
      });

      it('Scroll to middle List', function() {
         virtualScroll.setRowCount(500);
         var res = virtualScroll.calcVirtualWindow(5286);

         assert.equal(res.virtualWindow.topPlaceholderHeight, 4650);
         assert.equal(res.virtualWindow.bottomPlaceholderHeight, 5975);
         assert.equal(res.virtualWindow.indexStart, 186);
         assert.equal(res.virtualWindow.indexStop, 261);
      });

      it('Scroll to bottom List', function() {
         virtualScroll.setRowCount(500);
         var res = virtualScroll.calcVirtualWindow(12325);

         assert.equal(res.virtualWindow.topPlaceholderHeight, 11700);
         assert.equal(res.virtualWindow.bottomPlaceholderHeight, 0);
         assert.equal(res.virtualWindow.indexStart, 468);
         assert.equal(res.virtualWindow.indexStop, 500);

      });

      afterEach(function() {

      });

   })
});