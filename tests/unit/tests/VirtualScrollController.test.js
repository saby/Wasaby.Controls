/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.VirtualScrollController'], function(VirtualScrollController) {

   'use strict';
   var newState = null,
      pages = [{
         "offset": 0,
         "dettached": true
      }, {
         "offset": 1000,
         "dettached": true
      }, {
         "offset": 2000,
         "dettached": true
      }, {
         "offset": 3000,
         "dettached": true
      }, {
         "offset": 4000,
         "dettached": true
      }, {
         "offset": 5000,
         "dettached": true
      }, {
         "offset": 6000,
         "dettached": true
      }, {
         "offset": 7000,
         "dettached": true
      }, {
         "offset": 8000,
         "dettached": true
      }, {
         "offset": 9000,
         "dettached": true
      }, {
         "offset": 10000,
         "dettached": true
      }, {
         "offset": 11000,
         "dettached": true
      }, {
         "offset": 12000,
         "dettached": true
      }, {
         "offset": 13000,
         "dettached": true
      }, {
         "offset": 14000,
         "dettached": true
      }];
   describe('SBIS3.CONTROLS.VirtualScrollController', function() {
      var controller = new VirtualScrollController();
      describe('._getShownPages', function() {
         it('First page [5]', function() {
            newState = controller._getShownPages(0, 5);
            assert.deepEqual(newState, [0, 5]);
         });
         it('First page [1]', function() {
            newState = controller._getShownPages(0, 1);
            assert.deepEqual(newState, [0, 1]);
         });
         it('Second page [5]', function() {
            newState = controller._getShownPages(1, 5);
            assert.deepEqual(newState, [0, 5]);
         });
         it('Second page [1]', function() {
            newState = controller._getShownPages(1, 1);
            assert.deepEqual(newState, [0, 2]);
         });
         it('Fourth page [5]', function() {
            newState = controller._getShownPages(3, 5); 
            assert.deepEqual(newState, [0, 6]);
         });
         it('Fourth page [1]', function() {
            newState = controller._getShownPages(3, 1); 
            assert.deepEqual(newState, [2, 4]);
         });
         it('Fifth page [5]', function() {
            newState = controller._getShownPages(4, 5);
            assert.deepEqual(newState, [1, 7]);
         });
         it('Fifth page [1]', function() {
            newState = controller._getShownPages(4, 1);
            assert.deepEqual(newState, [3, 5]);
         });
         it('Large page [5]', function() {
            newState = controller._getShownPages(7890, 5);
            assert.deepEqual(newState, [7887, 7893]);
         });
         it('Large page [1]', function() {
            newState = controller._getShownPages(7890, 1);
            assert.deepEqual(newState, [7889, 7891]);
         });
      });

      describe('._calculateWrappersHeight', function() {
         it('From start', function() {
            pages[0].dettached = false;
            newState = controller._calculateWrappersHeight(pages, [0, 2]);
            assert.deepEqual(newState, [0, 12000]);
         });
         it('All pages', function() {
            pages[0].dettached = false;
            newState = controller._calculateWrappersHeight(pages, [0, 15]);
            assert.deepEqual(newState, [0, 0]);
         });
         it('From second page', function() {
            pages[0].dettached = false;
            newState = controller._calculateWrappersHeight(pages, [1, 3]);
            assert.deepEqual(newState, [2000, 11000]);
         });
         it('To last page', function() {
            pages[0].dettached = false;
            newState = controller._calculateWrappersHeight(pages, [10, 15]);
            assert.deepEqual(newState, [11000, 0]);
         });
      });

      describe('._getPagesByRange', function() {
         it('Page size 1', function() {
            newState = controller._getPagesByRange([0, 5], 1);
            assert.deepEqual(newState, [0, 1, 2, 3, 4]);
         });
         it('Equals page size', function() {
            newState = controller._getPagesByRange([0, 5], 5);
            assert.deepEqual(newState, [0]);
         });
         it('Biigger page size', function() {
            newState = controller._getPagesByRange([0, 5], 10);
            assert.deepEqual(newState, [0]);
         });
         it('Page size 5', function() {
            newState = controller._getPagesByRange([0, 20], 5);
            assert.deepEqual(newState, [0, 1, 2, 3]);
         });
         it('Fractional pages count', function() {
            newState = controller._getPagesByRange([0, 21], 5);
            assert.deepEqual(newState, [0, 1, 2, 3, 4]);
         });
         it('Page size 10', function() {
            newState = controller._getPagesByRange([0, 101], 10);
            assert.deepEqual(newState, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
         });
      });

      describe('._calculateRangeToShow', function() {
         //pageNumber, pageSize, pagesCount
         it('Simple [page size 1]', function() {
            newState = controller._calculateRangeToShow(0, 1, 1);
            assert.deepEqual(newState, [0, 0]);
         });
         it('Simple [page size 10]', function() {
            newState = controller._calculateRangeToShow(0, 10, 1);
            assert.deepEqual(newState, [0, 9]);
         });
         it('Two pages [page size 1]', function() {
            newState = controller._calculateRangeToShow(0, 1, 2);
            assert.deepEqual(newState, [0, 1]);
         });
         it('Two pages [page size 10]', function() {
            newState = controller._calculateRangeToShow(0, 10, 2);
            assert.deepEqual(newState, [0, 19]);
         });
         it('Not from start [page size 1]', function() {
            newState = controller._calculateRangeToShow(10, 1, 2);
            assert.deepEqual(newState, [9, 11]);
         });
         it('Not from start [page size 10]', function() {
            newState = controller._calculateRangeToShow(10, 10, 2);
            assert.deepEqual(newState, [90, 119]);
         });
      });

      describe('._getDiff', function() {
         //currentRange, newRange
         it('Equals', function() {
            newState = controller._getDiff([0, 1], [0, 1]);
            assert.equal(newState, false);
         });
         it('No intersection to top', function() {
            newState = controller._getDiff([0, 10], [20, 30]);
            assert.deepEqual(newState, {top: [20, 30], bottom: [0, 10]});
         });
         it('No intersection to bottom', function() {
            newState = controller._getDiff([20, 30], [0, 10]);
            assert.deepEqual(newState, {top: [20, 30], bottom: [0, 10]});
         });
         it('Intersection 1 element', function() {
            newState = controller._getDiff([0, 10], [10, 20]);
            assert.deepEqual(newState, { top: [ 0, 9 ], bottom: [ 11, 20 ] });
         });
         it('Intersection 10 elements', function() {
            newState = controller._getDiff([0, 20], [10, 30]);
            assert.deepEqual(newState, { top: [ 0, 9 ], bottom: [ 21, 30 ] });
         });
      });

      describe('._getPage', function() {
         //scrollTop, viewportHeight, additionalHeight, pages
         it('1st page', function() {
            newState = controller._getPage(0, 500, 0, pages);
            assert.equal(newState, 0);
         });
         it('2nd page', function() {
            newState = controller._getPage(500, 500, 0, pages);
            assert.equal(newState, 1);
         });
         it('End of 2nd page', function() {
            newState = controller._getPage(999, 500, 0, pages);
            assert.equal(newState, 1);
         });
         it('Last page', function() {
            newState = controller._getPage(99999999, 500, 0, pages);
            assert.equal(newState, 14);
         });
         it('Additional height', function() {
            newState = controller._getPage(4000, 500, 1001, pages);
            assert.equal(newState, 3);
         });
      });

      describe('._getItemsToRemove', function() {
         //range, offset, projCount
         it('1 element', function() {
            newState = controller._getItemsToRemove([0, 0], 0, 100);
            assert.deepEqual(newState, [0]);
         });
         it('5 elements', function() {
            newState = controller._getItemsToRemove([0, 5], 0, 100);
            assert.deepEqual(newState, [0, 1, 2, 3, 4, 5]);
         });
         it('Range bigger than count', function() {
            newState = controller._getItemsToRemove([0, 5], 0, 1);
            assert.deepEqual(newState, [0, 1]);
         });
      });

      describe('._getItemsToAdd', function() {
         //range, offset, projCount
         it('1 element', function() {
            newState = controller._getItemsToAdd([0, 0], 0, 100);
            assert.deepEqual(newState, [0]);
         });
         it('5 elements', function() {
            newState = controller._getItemsToAdd([0, 5], 0, 1);
            assert.deepEqual(newState, [0, 1]);
         });
         it('Range bigger than count', function() {
            newState = controller._getItemsToAdd([0, 5], 0, 1);
            assert.deepEqual(newState, [0, 1]);
         });
      });
   });
});