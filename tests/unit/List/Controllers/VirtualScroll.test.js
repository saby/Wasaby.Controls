define([
   'Controls/List/Controllers/VirtualScroll',
   'Controls/List/ListViewModel',
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
            keyProperty: 'id',
            rawData: srcData,
            adapter: 'adapter.json'
         });

         return new ListViewModel({
            items: items,
            keyProperty: 'id',
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
         assert.equal(pageInfo.page, 2);

         pageInfo = VirtualScroll._private.getPage(2000, 25);
         assert.equal(pageInfo.page, 16);
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
         virtualScroll.setScrollTop(0);
         var res = virtualScroll.getVirtualWindow();

         assert.equal(res.topPlaceholderHeight, 0);
         assert.equal(res.bottomPlaceholderHeight, 11250);
         assert.equal(res.indexStart, 0);
         assert.equal(res.indexStop, 50);
      });

      it('Scroll to middle List and check setScrollTop', function() {
         virtualScroll.setItemsCount(500);
         virtualScroll.setScrollTop(5286);

         if (virtualScroll.setScrollTop(5286)) {
            assert.fail(null, null, 'Change virtual window after set ident scrollTop');
         }

         var res = virtualScroll.getVirtualWindow();

         assert.equal(res.topPlaceholderHeight, 4650);
         assert.equal(res.bottomPlaceholderHeight, 5975);
         assert.equal(res.indexStart, 186);
         assert.equal(res.indexStop, 261);
      });

      it('Scroll to bottom List', function() {
         virtualScroll.setItemsCount(500);
         virtualScroll.setScrollTop(12325);
         var res = virtualScroll.getVirtualWindow();

         assert.equal(res.topPlaceholderHeight, 11700);
         assert.equal(res.bottomPlaceholderHeight, 0);
         assert.equal(res.indexStart, 468);
         assert.equal(res.indexStop, 500);

      });

      it('Check set average ItemHeight', function() {
         virtualScroll.setItemsCount(500);
         virtualScroll.setScrollTop(0);

         var res = virtualScroll.getVirtualWindow();

         assert.equal(res.topPlaceholderHeight, 0);
         assert.equal(res.bottomPlaceholderHeight, 11250);
         assert.equal(res.indexStart, 0);
         assert.equal(res.indexStop, 50);

         virtualScroll.setAverageItemHeight(20);
         var res = virtualScroll.getVirtualWindow();

         assert.equal(res.topPlaceholderHeight, 0);
         assert.equal(res.bottomPlaceholderHeight, 9000);

         //Вернем все как было
         virtualScroll.setAverageItemHeight(25);
      });

      it('Calc average item height', function() {
         virtualScroll.setItemsCount(500);
         virtualScroll.setScrollTop(0);


         var res = virtualScroll.calcAverageItemHeight({clientHeight: 1500});

         assert.equal(res.virtualWindow.topPlaceholderHeight, 0);
         assert.equal(res.virtualWindow.bottomPlaceholderHeight, 13500);
         assert.equal(virtualScroll._averageItemHeight, 30);

         //Вернем все как было
         virtualScroll.setAverageItemHeight(25);
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
                     virtualScroll.setScrollTop(tests[i].scrollTop);
                     virtualScroll.insertItems(tests[i].addIndexes[k], tests[i].countAddedItems);
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