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
         maxVisibleItems: 75,
         itemHeight: 25,
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
         var res = VirtualScroll._private.calcVirtualWindowIndexes(0, 75, 500);
         assert.equal(res.start, 0);
         assert.equal(res.stop, 50);

         res = VirtualScroll._private.calcVirtualWindowIndexes(25, 75, 500);
         assert.equal(res.start, 0);
         assert.equal(res.stop, 75);

         res = VirtualScroll._private.calcVirtualWindowIndexes(500, 75, 500);
         assert.equal(res.start, 475);
         assert.equal(res.stop, 500);

      });

      it('Scroll to top List', function() {
         virtualScroll.setItemsCount(500);
         var res = virtualScroll.calcVirtualWindow(0);

         assert.equal(res.virtualWindow.topPlaceholderHeight, 0);
         assert.equal(res.virtualWindow.bottomPlaceholderHeight, 11250);
         assert.equal(res.virtualWindow.indexStart, 0);
         assert.equal(res.virtualWindow.indexStop, 50);
      });

      it('Scroll to middle List', function() {
         virtualScroll.setItemsCount(500);
         var res = virtualScroll.calcVirtualWindow(5286);

         assert.equal(res.virtualWindow.topPlaceholderHeight, 4650);
         assert.equal(res.virtualWindow.bottomPlaceholderHeight, 5975);
         assert.equal(res.virtualWindow.indexStart, 186);
         assert.equal(res.virtualWindow.indexStop, 261);
      });

      it('Scroll to bottom List', function() {
         virtualScroll.setItemsCount(500);
         var res = virtualScroll.calcVirtualWindow(12325);

         assert.equal(res.virtualWindow.topPlaceholderHeight, 11700);
         assert.equal(res.virtualWindow.bottomPlaceholderHeight, 0);
         assert.equal(res.virtualWindow.indexStart, 468);
         assert.equal(res.virtualWindow.indexStop, 500);

      });

      //Проверка рассчета индексов/распорок после изменяения общего числа записей проекции
      describe('Add items', function() {
         var tests = [
            {
               name: 'Add to first page',
               initialRowCount: 25,
               scrollTop: 0,
               addIndexes: [0, 5, 14],
               countAddedItems: 100,
               result: {
                  indexStart: 0,
                  indexStop: 50,
                  topPlaceholderHeight: 0,
                  bottomPlaceholderHeight: 1875,
                  rowCount: 125
               }
            },
            {
               name: 'Add to current page',
               initialRowCount: 100,
               scrollTop: 650,
               addIndexes: [20, 35],
               countAddedItems: 5,
               result: {
                  indexStart: 1,
                  indexStop: 76,
                  topPlaceholderHeight: 25,
                  bottomPlaceholderHeight: 725,
                  rowCount: 105
               }
            },
            {
               name: 'Add before current page',
               initialRowCount: 100,
               scrollTop: 650,
               addIndexes: [0],
               countAddedItems: 5,
               result: {
                  indexStart: 6,
                  indexStop: 76,
                  topPlaceholderHeight: 150,
                  bottomPlaceholderHeight: 725,
                  rowCount: 105
               }
            },
            {
               name: 'Add after current page',
               initialRowCount: 100,
               scrollTop: 650,
               addIndexes: [80],
               countAddedItems: 5,
               result: {
                  indexStart: 1,
                  indexStop: 76,
                  topPlaceholderHeight: 25,
                  bottomPlaceholderHeight: 725,
                  rowCount: 105
               }
            }
         ];

         beforeEach(function() {
         });

         for (var i = 0; i < tests.length; i++) {
            (function(i) {
               it(tests[i].name, function() {
                  for (var k = 0; k < tests[i].addIndexes.length; k++) {
                     virtualScroll._currentPage = -1;

                     virtualScroll.setItemsCount(tests[i].initialRowCount);
                     virtualScroll.calcVirtualWindow(tests[i].scrollTop);
                     virtualScroll.updateOnAddingItems(tests[i].addIndexes[k], tests[i].countAddedItems);
                     var res = virtualScroll.getVirtualWindow();

                     assert.equal(res.indexStart, tests[i].result.indexStart);
                     assert.equal(res.indexStop, tests[i].result.indexStop);
                     assert.equal(res.topPlaceholderHeight, tests[i].result.topPlaceholderHeight);
                     assert.equal(res.bottomPlaceholderHeight, tests[i].result.bottomPlaceholderHeight);
                     assert.equal(virtualScroll._itemsCount, tests[i].result.rowCount);
                  }
               });
            })(i);
         }
      });

      afterEach(function() {

      });

   })
});