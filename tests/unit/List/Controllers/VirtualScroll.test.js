/**
 * Created by Rodionov E.A. on 20.02.2018.
 */
define([
   'Controls/List/Controllers/VirtualScroll',
   'WS.Data/Source/Memory',
   'Core/core-instance'
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
            startIndex: 10
         });
         assert.equal(10, vsInstance._startItemIndex, 'Wrong start index after ctor');
         assert.equal(90, vsInstance._stopItemIndex, 'Wrong stop index after ctor');
         assert.equal(80, vsInstance._virtualPageSize, 'Wrong virtualPageSize index after ctor');
         assert.equal(30, vsInstance._virtualSegmentSize, 'Wrong virtualPageSize index after ctor');
      });

      it('default options in constructor', function() {
         var vsInstance = new VirtualScroll({});
         assert.equal(0, vsInstance._startItemIndex, 'Wrong start index after ctor');
         assert.equal(100, vsInstance._stopItemIndex, 'Wrong stop index after ctor');
         assert.equal(100, vsInstance._virtualPageSize, 'Wrong virtualPageSize index after ctor');
         assert.equal(20, vsInstance._virtualSegmentSize, 'Wrong virtualPageSize index after ctor');
      });

      it('resetItemsIndexes', function() {
         var vsInstance = new VirtualScroll({
            virtualSegmentSize: 30,
            virtualPageSize: 80,
            startIndex: 10
         });

         vsInstance.resetItemsIndexes();

         assert.equal(0, vsInstance._startItemIndex, 'Wrong start index after ctor');
         assert.equal(80, vsInstance._stopItemIndex, 'Wrong stop index after ctor');
         assert.equal(80, vsInstance._virtualPageSize, 'Wrong virtualPageSize index after ctor');
         assert.equal(30, vsInstance._virtualSegmentSize, 'Wrong virtualPageSize index after ctor');
      });

      it('getItemsIndexes', function() {
         var
            vsInstance = new VirtualScroll({
               virtualSegmentSize: 40,
               virtualPageSize: 200,
               startIndex: 13
            }),
            indexes = vsInstance.getItemsIndexes();

         assert.equal(13, vsInstance._startItemIndex);
         assert.equal(213, vsInstance._stopItemIndex);

         vsInstance.updateItemsIndexes('down');
         indexes = vsInstance.getItemsIndexes();

         assert.equal(53, vsInstance._startItemIndex);
         assert.equal(253, vsInstance._stopItemIndex);

         vsInstance._startItemIndex = 12;
         vsInstance._stopItemIndex = 15;
         indexes = vsInstance.getItemsIndexes();
         assert.equal(12, vsInstance._startItemIndex);
         assert.equal(15, vsInstance._stopItemIndex);
      });

      it('setItemsContainer', function() {
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
         VirtualScroll._private.updateItemsSizes = function() {
         };
         vsInstance.setItemsContainer(items);
         assert.deepEqual(items, vsInstance._itemsContainer);
      });

      it('setItemsCount', function() {
         var
            vsInstance = new VirtualScroll({});

         vsInstance.setItemsCount(4000);
         assert.deepEqual(4000, vsInstance._itemsCount);
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

         VirtualScroll._private.updateItemsSizes = function(self) {
            var
               startIndex = self._startItemIndex,
               stopIndex = self._stopItemIndex,
               items = self._itemsContainer.children;

            if (!(self._itemsHeights[startIndex] && self._itemsHeights[stopIndex - 1])) {
               for (var i = 0; i < items.length; i++) {
                  self._itemsHeights[startIndex + i] = items[i].offsetHeight;
               }
            }
         };

         vsInstance.setItemsContainer(items);
         assert.deepEqual(itemsHeights, vsInstance._itemsHeights);
      });

      it('always itemsCount <= virtualPageSize (down scroll)', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 30,
         });

         for (var i = 0; i < 10; i++) {
            vsInstance.updateItemsIndexes('down');
            assert.equal(30, vsInstance._stopItemIndex - vsInstance._startItemIndex);
         }
      });

      it('always itemsCount <= virtualPageSize (up scroll)', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 500,
            virtualPageSize: 50,
         });

         for (var i = 0; i < 10; i++) {
            vsInstance.updateItemsIndexes('up');
            assert.equal(50, vsInstance._stopItemIndex - vsInstance._startItemIndex);
         }
      });

      it('updateItemsIndexes direction="down"', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 120,
            virtualPageSize: 115,
            virtualSegmentSize: 35
         });

         vsInstance.updateItemsIndexes('down');
         assert.equal(155, vsInstance._startItemIndex);
         assert.equal(270, vsInstance._stopItemIndex);

      });

      it('updateItemsIndexes direction="up"', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 120,
            virtualPageSize: 115,
            virtualSegmentSize: 35
         });

         vsInstance.updateItemsIndexes('up');
         assert.equal(85, vsInstance._startItemIndex);
         assert.equal(200, vsInstance._stopItemIndex);

      });

      it('updateItemsIndexes: start index not less then 0', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 115,
            virtualSegmentSize: 35
         });

         vsInstance.updateItemsIndexes('up');
         assert.equal(0, vsInstance._startItemIndex);
         assert.equal(115, vsInstance._stopItemIndex);
         vsInstance.updateItemsIndexes('up');
         assert.equal(0, vsInstance._startItemIndex);
         assert.equal(115, vsInstance._stopItemIndex);
         vsInstance.updateItemsIndexes('up');
         assert.equal(0, vsInstance._startItemIndex);
         assert.equal(115, vsInstance._stopItemIndex);
      });

      it('updateItemsIndexes: stop index not bigger then itemsCount', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 380,
            virtualPageSize: 100,
            virtualSegmentSize: 40
         });

         vsInstance.setItemsCount(500);
         vsInstance.updateItemsIndexes('down');
         assert.equal(400, vsInstance._startItemIndex);
         assert.equal(500, vsInstance._stopItemIndex);
         vsInstance.updateItemsIndexes('down');
         assert.equal(400, vsInstance._startItemIndex);
         assert.equal(500, vsInstance._stopItemIndex);
         vsInstance.updateItemsIndexes('down');
         assert.equal(400, vsInstance._startItemIndex);
         assert.equal(500, vsInstance._stopItemIndex);
      });

      it('getPlaceholders', function() {
         var
            vsInstance = new VirtualScroll({}),
            placeholders;

         vsInstance._bottomPlaceholderSize = 34;
         vsInstance._topPlaceholderSize = 5478;
         placeholders = vsInstance.getPlaceholdersSizes();
         assert.deepEqual({
            top: 5478,
            bottom: 34
         }, placeholders);
      });

      it('isScrollInPlaceholder', function() {
         var
            vsInstance = new VirtualScroll({
               startIndex: 30,
               virtualPageSize: 5,
               virtualSegmentSize: 3
            });

         vsInstance._topPlaceholderSize = 500;
         vsInstance._bottomPlaceholderSize = 340;

         vsInstance._itemsHeights[30] = 10;
         vsInstance._itemsHeights[31] = 20;
         vsInstance._itemsHeights[32] = 30;
         vsInstance._itemsHeights[33] = 20;
         vsInstance._itemsHeights[34] = 10;

         assert.isTrue(VirtualScroll._private.isScrollInPlaceholder(vsInstance, 300));
         assert.isTrue(!VirtualScroll._private.isScrollInPlaceholder(vsInstance, 550));
         assert.isTrue(VirtualScroll._private.isScrollInPlaceholder(vsInstance, 700));
      });

      it('counting placeholders', function() {
         var
            vsInstance = new VirtualScroll({
               startIndex: 0,
               virtualPageSize: 5,
               virtualSegmentSize: 3
            }),
            items = {
               children: [
                  { offsetHeight: 20 },
                  { offsetHeight: 45 },
                  { offsetHeight: 10 },
                  { offsetHeight: 44 },
                  { offsetHeight: 78 }
               ]
            },
            placeholders;

         vsInstance.setItemsContainer(items);

         vsInstance.updateItemsIndexes('down');
         placeholders = vsInstance.getPlaceholdersSizes();
         assert.equal(75, placeholders.top);
         assert.equal(0, placeholders.bottom);

         vsInstance.updateItemsIndexes('up');
         placeholders = vsInstance.getPlaceholdersSizes();
         assert.equal(0, placeholders.top);
         assert.equal(0, placeholders.bottom);
      });

      it('updateItemsIndexesOnScrolling', function() {
         var
            vsInstance = new VirtualScroll({
               startIndex: 0,
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
         }, vsInstance.getItemsIndexes());
      });

   });
});
