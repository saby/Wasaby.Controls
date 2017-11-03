/**
 * Created by kraynovdo on 02.11.2017.
 */
define([
   'js!Controls/List/Paging/DigitButtons'
], function(DigitButtons){
   describe('Controls.List.Paging.DigitButtons', function () {
      it('__initDrawedDigits 10 pages', function () {
         var db, digits;
         db = new DigitButtons({});
         digits = db.__getDrawnDigits (10, 1, true);
         assert.deepEqual([1, 2, 3, 4, '...', 10], digits, '__getDrawnDigits10 test case 1: WrongResult');

         digits = db.__getDrawnDigits (10, 2, true);
         assert.deepEqual([1, 2, 3, 4, 5, '...', 10], digits, '__getDrawnDigits10 test case 2: WrongResult');

         digits = db.__getDrawnDigits (10, 3, true);
         assert.deepEqual([1, 2, 3, 4, 5, 6, '...', 10], digits, '__getDrawnDigits10 test case 3: WrongResult');

         digits = db.__getDrawnDigits (10, 4, true);
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7, '...', 10], digits, '__getDrawnDigits10 test case 4: WrongResult');

         digits = db.__getDrawnDigits (10, 5, true);
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], digits, '__getDrawnDigits10 test case 5: WrongResult');

         digits = db.__getDrawnDigits (10, 6, true);
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], digits, '__getDrawnDigits10 test case 6: WrongResult');

         digits = db.__getDrawnDigits (10, 7, true);
         assert.deepEqual([1, '...', 4, 5, 6, 7, 8, 9, 10], digits, '__getDrawnDigits10 test case 7: WrongResult');

         digits = db.__getDrawnDigits (10, 8, true);
         assert.deepEqual([1, '...', 5, 6, 7, 8, 9, 10], digits, '__getDrawnDigits10 test case 8: WrongResult');

         digits = db.__getDrawnDigits (10, 9, true);
         assert.deepEqual([1, '...', 6, 7, 8, 9, 10], digits, '__getDrawnDigits10 test case 9: WrongResult');

         digits = db.__getDrawnDigits (10, 10, true);
         assert.deepEqual([1, '...', 7, 8, 9, 10], digits, '__getDrawnDigits10 test case 10: WrongResult');
      });

      it('__getDrawnDigits 15 pages', function () {
         var db, digits;
         db = new DigitButtons({});

         digits = db.__getDrawnDigits (15, 7, true);
         assert.deepEqual([1, '...', 4, 5, 6, 7, 8, 9, 10, '...', 15], digits, '__getDrawnDigits15 test case 7: WrongResult');
      });

      it('__getDrawnDigits 5 pages', function () {
         var db, digits;
         db = new DigitButtons({});

         digits = db.__getDrawnDigits (5, 1, true);
         assert.deepEqual([1, 2, 3, 4, 5], digits, '__getDrawnDigits5 test case 1: WrongResult');

         digits = db.__getDrawnDigits (5, 2, true);
         assert.deepEqual([1, 2, 3, 4, 5], digits, '__getDrawnDigits5 test case 2: WrongResult');

         digits = db.__getDrawnDigits (5, 3, true);
         assert.deepEqual([1, 2, 3, 4, 5], digits, '__getDrawnDigits5 test case 3: WrongResult');

         digits = db.__getDrawnDigits (5, 4, true);
         assert.deepEqual([1, 2, 3, 4, 5], digits, '__getDrawnDigits5 test case 4: WrongResult');

         digits = db.__getDrawnDigits (5, 5, true);
         assert.deepEqual([1, 2, 3, 4, 5], digits, '__getDrawnDigits5 test case 5: WrongResult');
      });
   })
});