/**
 * Created by Rodionov E.A. on 29.11.2018.
 */
define([
   'Controls/List/Controllers/VirtualScroll'
], function(VirtualScroll) {
   describe('Controls.Controllers.VirtualScroll', function() {

      function generateData(count) {
         var res = [];
         for (var i = 0; i < count; i++) {
            res[i] = {
               id: i,
               title: 'Какая то запись с id ' + i
            };
         }
         return res;
      }

      it('constructor', function() {
         var vsInstance = new VirtualScroll({
            virtualSegmentSize: 30,
            virtualPageSize: 80,
            itemsRenderMode: 'AllAtOnce'
         });
         assert.equal(0, vsInstance._startIndex, 'Wrong start index after ctor');
         assert.equal(80, vsInstance._stopIndex, 'Wrong stop index after ctor');
         assert.equal(80, vsInstance._virtualPageSize, 'Wrong virtualPageSize index after ctor');
         assert.equal(30, vsInstance._virtualSegmentSize, 'Wrong virtualPageSize index after ctor');
      });

      it('default options in constructor', function() {
         var vsInstance = new VirtualScroll({});
         assert.equal(0, vsInstance._startIndex, 'Wrong start index after default ctor');
         assert.equal(100, vsInstance._stopIndex, 'Wrong stop index after default ctor');
         assert.equal(100, vsInstance._virtualPageSize, 'Wrong virtualPageSize index after default ctor');
         assert.equal(20, vsInstance._virtualSegmentSize, 'Wrong virtualPageSize index after default ctor');
      });

      it('resetItemsIndexes', function() {
         var vsInstance = new VirtualScroll({
            virtualSegmentSize: 30,
            virtualPageSize: 80,
            itemsRenderMode: 'AllAtOnce'
         });

         vsInstance._startIndex = 20;
         vsInstance.resetItemsIndexes();

         assert.equal(0, vsInstance._startIndex, 'Wrong start index after reset');
         assert.equal(80, vsInstance._stopIndex, 'Wrong stop index after reset');
         assert.equal(80, vsInstance._virtualPageSize, 'Wrong virtualPageSize index after reset');
         assert.equal(30, vsInstance._virtualSegmentSize, 'Wrong virtualPageSize index after reset');
      });

      it('getter ItemsIndexes', function() {
         var
            vsInstance = new VirtualScroll({});

         vsInstance._startIndex = 23;
         vsInstance._stopIndex = 57;
         assert.deepEqual({start: 23, stop: 57}, vsInstance.ItemsIndexes);
      });

      it('insert heights', function() {
         var
            vsInstance = new VirtualScroll({});

         vsInstance._itemsHeights = [1, 1, 1, 1, 1, 1];
         assert.equal(6,vsInstance._itemsHeights.length);

         vsInstance.insertItemsHeights(2, 3);

         assert.equal(9,vsInstance._itemsHeights.length);
         assert.deepEqual([1, 1, 1, 0, 0, 0, 1, 1, 1], vsInstance._itemsHeights);
      });

      it('cut heights', function() {
         var
            vsInstance = new VirtualScroll({});

         vsInstance._itemsHeights = [1, 1, 1, 0, 0, 0, 1, 1, 1];
         assert.equal(9,vsInstance._itemsHeights.length);

         vsInstance.cutItemsHeights(2, 3);

         assert.equal(6,vsInstance._itemsHeights.length);
         assert.deepEqual([1, 1, 1, 1, 1, 1], vsInstance._itemsHeights);
      });

      it('setter ItemsContainer', function() {
         var
             vsInstance = new VirtualScroll({}),
             container = {
                children: [
                   { offsetHeight: 20 },
                   { offsetHeight: 45 },
                   { offsetHeight: 10 },
                   { offsetHeight: 44 },
                   { offsetHeight: 78 },
                   { offsetHeight: 45 },
                   { offsetHeight: 92 }
                ]
             };
         vsInstance.updateItemsSizes = function() {};
         vsInstance.ItemsContainer = container;
         assert.deepEqual(container, vsInstance._itemsContainer);
      });

      it('getter ItemsContainer', function() {
         var
             vsInstance = new VirtualScroll({}),
             container = {
                children: [
                   { offsetHeight: 20 },
                   { offsetHeight: 45 },
                   { offsetHeight: 10 },
                   { offsetHeight: 44 },
                   { offsetHeight: 78 },
                   { offsetHeight: 45 },
                   { offsetHeight: 92 }
                ]
             };
         vsInstance.updateItemsSizes = function() {};
         vsInstance.ItemsContainer = container;


         assert.deepEqual(container, vsInstance.ItemsContainer);
      });

      it('seter ItemsCount', function() {
         var
            vsInstance = new VirtualScroll({});

         vsInstance.ItemsCount = 4000;
         assert.equal(4000, vsInstance._itemsCount);
      });

      it('updateItemsSizes always', function() {
         var
            vsInstance = new VirtualScroll({
               updateItemsHeightsMode: 'always'
            }),
            _items = {
               children: [
                  { offsetHeight: 20 },
                  { offsetHeight: 45 },
                  { offsetHeight: 10 },
                  { offsetHeight: 44 },
                  { offsetHeight: 78 },
                  { offsetHeight: 45 },
                  { offsetHeight: 92 }
               ]
            },
            itemsHeights = [20, 45, 10, 44, 78, 45, 92];

         vsInstance.ItemsCount = 7;

         var isUpdated = false;
         vsInstance._updateItemsSizes = function() {
            isUpdated = true;
         };
         vsInstance.ItemsContainer = _items;

         assert.isTrue(isUpdated);
      });

      it('updateItemsSizes', function() {
         var
            vsInstance = new VirtualScroll({}),
            items = {
               children: [
                  { offsetHeight: 20 },
                  { offsetHeight: 45 },
                  { offsetHeight: 10 },
                  { offsetHeight: 44 },
                  { offsetHeight: 78 },
                  { offsetHeight: 45 },
                  { offsetHeight: 92 }
               ]
            },
            itemsHeights = [20, 45, 10, 44, 78, 45, 92];

         vsInstance._itemsContainer = items;
         vsInstance._updateItemsSizes(0, 7, true);

         assert.deepEqual(itemsHeights, vsInstance.ItemsHeights);
      });

      it('always itemsCount <= virtualPageSize (down scroll)', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 30,
         });

         vsInstance.ItemsCount = 1000;

         for (var i = 0; i < 10; i++) {
            vsInstance.updateItemsIndexes('down');
            assert.equal(30, vsInstance._stopIndex - vsInstance._startIndex);
         }
      });

      it('always itemsCount <= virtualPageSize (up scroll)', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 500,
            virtualPageSize: 50,
         });
         vsInstance.ItemsCount = 1000;

         for (var i = 0; i < 10; i++) {
            vsInstance.updateItemsIndexes('up');
            assert.equal(50, vsInstance._stopIndex - vsInstance._startIndex);
         }
      });

      it('updateItemsIndexes direction="down"', function() {
         var vsInstance = new VirtualScroll({
            virtualPageSize: 115,
            virtualSegmentSize: 35
         });

         vsInstance._startIndex = 120;
         vsInstance._stopIndex = 235;

         vsInstance.ItemsCount = 1000;

         vsInstance.updateItemsIndexes('down');
         assert.deepEqual({
            start: 155,
            stop: 270
         }, vsInstance.ItemsIndexes);
      });

      it('updateItemsIndexes direction="up"', function() {
         var vsInstance = new VirtualScroll({
            virtualPageSize: 115,
            virtualSegmentSize: 35
         });

         vsInstance._startIndex = 120;
         vsInstance._stopIndex = 235;

         vsInstance.ItemsCount = 1000;

         vsInstance.updateItemsIndexes('up');
         assert.deepEqual({
            start: 85,
            stop: 200
         }, vsInstance.ItemsIndexes);

      });

      it('updateItemsIndexes: start index not less then 0', function() {
         var vsInstance = new VirtualScroll({
            virtualPageSize: 115,
            virtualSegmentSize: 35
         });
         vsInstance.ItemsCount = 1000;
         vsInstance._startIndex = 0;

         vsInstance.updateItemsIndexes('up');
         assert.equal(0, vsInstance._startIndex);
         assert.equal(115, vsInstance._stopIndex);
         vsInstance.updateItemsIndexes('up');
         assert.equal(0, vsInstance._startIndex);
         assert.equal(115, vsInstance._stopIndex);
         vsInstance.updateItemsIndexes('up');
         assert.equal(0, vsInstance._startIndex);
         assert.equal(115, vsInstance._stopIndex);
      });

      it('updateItemsIndexes: stop index not bigger then itemsCount', function() {
         var vsInstance = new VirtualScroll({
            virtualPageSize: 100,
            virtualSegmentSize: 40
         });

         vsInstance._startIndex = 380;
         vsInstance.ItemsCount = 500;

         vsInstance.updateItemsIndexes('down');
         assert.equal(400, vsInstance._startIndex);
         assert.equal(500, vsInstance._stopIndex);
         vsInstance.updateItemsIndexes('down');
         assert.equal(400, vsInstance._startIndex);
         assert.equal(500, vsInstance._stopIndex);
         vsInstance.updateItemsIndexes('down');
         assert.equal(400, vsInstance._startIndex);
         assert.equal(500, vsInstance._stopIndex);
      });

      it('getter Placeholders', function() {
         var
            vsInstance = new VirtualScroll({});

         vsInstance._itemsHeights = [20, 45, 10, 44, 78, 45, 92];
         vsInstance._startItemIndex = 2;
         vsInstance._stopItemIndex = 5;

         assert.deepEqual({
            top: 0,
            bottom: 0
         }, vsInstance.PlaceholdersSizes);

         vsInstance._topPlaceholderSize = 123;
         vsInstance._bottomPlaceholderSize = 333;

         assert.deepEqual({
            top: 123,
            bottom: 333
         }, vsInstance.PlaceholdersSizes);

      });

      it('update Placeholders', function() {
         var
            vsInstance = new VirtualScroll({}),
            placeholders;

         vsInstance._itemsHeights = [20, 45, 10, 44, 78, 45, 92];
         vsInstance._startIndex = 2;
         vsInstance._stopIndex = 5;


         assert.deepEqual({
            top: 0,
            bottom: 0
         }, vsInstance.PlaceholdersSizes);

         vsInstance._updatePlaceholdersSizes();

         assert.deepEqual({
            top: 65,
            bottom: 137
         }, vsInstance.PlaceholdersSizes);

      });

      it('getter ItemsHeights', function() {
         var
            vsInstance = new VirtualScroll({}),
            itemsHeights = [20, 45, 10, 44, 78, 45, 92];
         vsInstance._itemsHeights = itemsHeights;
         assert.deepEqual(itemsHeights, vsInstance.ItemsHeights);
      });

      it('isScrollInPlaceholder', function() {
         var
            vsInstance = new VirtualScroll({
               virtualPageSize: 5,
               virtualSegmentSize: 3
            });
         vsInstance._startIndex = 30;
         vsInstance._topPlaceholderSize = 500;
         vsInstance._bottomPlaceholderSize = 340;

         vsInstance._itemsHeights[30] = 10;
         vsInstance._itemsHeights[31] = 20;
         vsInstance._itemsHeights[32] = 30;
         vsInstance._itemsHeights[33] = 20;
         vsInstance._itemsHeights[34] = 10;

         assert.isTrue(vsInstance._isScrollInPlaceholder(300));
         assert.isFalse(!vsInstance._isScrollInPlaceholder(550));
         assert.isTrue(vsInstance._isScrollInPlaceholder(700));
      });

      it('updateItemsIndexesOnScrolling', function() {
         var
            vsInstance = new VirtualScroll({
               virtualPageSize: 6,
               virtualSegmentSize: 3
            });
         vsInstance._topPlaceholderSize = 500;
         vsInstance._bottomPlaceholderSize = 340;

         for (var i = 0; i < 30; i++) {
            vsInstance._itemsHeights[i] = 10;
         }
         vsInstance._itemsHeights[30] = 10;
         vsInstance._itemsHeights[31] = 20;
         vsInstance._itemsHeights[32] = 30;
         vsInstance._itemsHeights[33] = 20;
         vsInstance._itemsHeights[34] = 10;
         vsInstance._itemsHeights[35] = 10;

         vsInstance._itemsHeights[36] = 20;
         vsInstance._itemsHeights[37] = 30;
         vsInstance._itemsHeights[38] = 20;
         vsInstance._itemsHeights[39] = 10;


         vsInstance.updateItemsIndexesOnScrolling(395);
         assert.deepEqual({
            start: 32,
            stop: 38
         }, vsInstance.ItemsIndexes);
      });

   });
});
