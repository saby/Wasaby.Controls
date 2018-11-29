/**
 * Created by kraynovdo on 20.02.2018.
 */
/**
 * Created by kraynovdo on 07.02.2018.
 */
define([
   'Controls/List/Controllers/VirtualScroll',
   'WS.Data/Source/Memory',
   'Core/core-instance'
], function(VirtualScroll, MemorySource, cInstance) {
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

      // data = generateData(500),
      // source = new MemorySource({
      //    data: data,
      //    idProperty: 'id'
      // });

      it('constructor', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 13
         });
         assert.equal(0, vsInstance._options.startIndex, 'Wrong start index after ctor');
         assert.equal(13, vsInstance._options.stopIndex, 'Wrong stop index after ctor');
         assert.equal(13, vsInstance._options.virtualPageSize, 'Wrong virtualPageSize index after ctor');
         assert.equal(13, vsInstance._maxRenderedItemIndex, 'Wrong maxRenderedItemIndex index after ctor');
      });

      it('constructor with empty options', function() {
         var vsInstance = new VirtualScroll();
         assert.equal(0, vsInstance._options.startIndex, 'Wrong start index after ctor');
         assert.equal(50, vsInstance._options.stopIndex, 'Wrong stop index after ctor');
         assert.equal(50, vsInstance._options.virtualPageSize, 'Wrong virtualPageSize index after ctor');
         assert.equal(50, vsInstance._maxRenderedItemIndex, 'Wrong maxRenderedItemIndex index after ctor');
      });

      it('updateIndexes', function() {
         // нечётный размер страницы
         var vsInstance = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 13
         });
         vsInstance.updateIndexes(8);
         assert.equal(2, vsInstance._options.startIndex);
         assert.equal(15, vsInstance._options.stopIndex);

         // чётный размер страницы
         vsInstance = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 10
         });
         vsInstance.updateIndexes(7);
         assert.equal(2, vsInstance._options.startIndex);
         assert.equal(12, vsInstance._options.stopIndex);
      });

      it('itemsCount always equal virtualPageSize', function() {
         var vsInstance = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 13
         });

         // для 10ти рандомных положений проверим, что всего отобразится 13 записей
         for (var i = 0; i < 10; i++) {
            // Рандомное целое 0-200
            var center = Math.round(0 - 0.5 + Math.random() * (0 - 200 + 1));
            vsInstance.updateIndexes(center);
            assert.equal(13, vsInstance._options.stopIndex - vsInstance._options.startIndex);
         }
      });

      it('destroy', function() {
         var vs = new VirtualScroll({
            startIndex: 0,
            virtualPageSize: 9
         });

         vs.destroy();

         assert.deepEqual({}, vs._options, 'Not empty options after desrtoy');
      });
   });
});
