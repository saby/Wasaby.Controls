/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define('[SBIS3.CONTROLS/ListView/resources/VirtualScrollController', [
   'Core/core-clone',
   'SBIS3.CONTROLS/ListView/resources/VirtualScrollController'
], function(
   cClone,
   VirtualScrollController
) {

   'use strict';
   var newState = null,
      heights = [10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20,
                 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20,
                 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20];
   describe('SBIS3.CONTROLS/ListView/resources/VirtualScrollController', function() {
      var controller = new VirtualScrollController();

      describe('._getWrappersHeight', function() {
         controller._heights = cClone(heights);
         it('First Page', function() {
            newState = controller._getWrappersHeight([0, 100]);
            assert.deepEqual(newState, { begin: 0, end: 3180 });
         });
         it('Middle Page', function() {
            newState = controller._getWrappersHeight([60, 160]);
            assert.deepEqual(newState, { begin: 960 , end: 2220 });
         });
         it('Last Page', function() {
            newState = controller._getWrappersHeight([220, 320]);
            assert.deepEqual(newState, { begin: 3520, end: 0 });
         });
      });

      describe('._getRangeToShow', function() {
         //pageNumber, pageSize, pagesCount
         it('Simple', function() {
            newState = controller._getRangeToShow(0, 1);
            assert.deepEqual(newState, [0, 20]);
         });
         it('Two pages', function() {
            newState = controller._getRangeToShow(0, 2);
            assert.deepEqual(newState, [0, 40]);
         });
         it('Not from start', function() {
            newState = controller._getRangeToShow(10, 10);
            assert.deepEqual(newState, [120, 299]);
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
            assert.deepEqual(newState, { add: [20, 30], remove: [0, 10], addPosition: 11 });
         });
         it('No intersection to bottom', function() {
            newState = controller._getDiff([20, 30], [0, 10]);
            assert.deepEqual(newState, { remove: [20, 30], add: [0, 10], addPosition: 0 });
         });
         it('Intersection 1 element', function() {
            newState = controller._getDiff([0, 10], [10, 20]);
            assert.deepEqual(newState, { add: [ 11, 20 ], remove: [ 0, 9 ], addPosition: 11 });
         });
         it('Intersection 10 elements', function() {
            newState = controller._getDiff([0, 20], [10, 30]);
            assert.deepEqual(newState, { remove: [ 0, 9 ], add: [ 21, 30 ], addPosition: 21 });
         });
      });

      describe('._getPage', function() {
         //scrollTop, viewportHeight, additionalHeight, pages
         controller._heights = cClone(heights);
         it('1st page', function() {
            newState = controller._getPage(0);
            assert.equal(newState, 0);
         });
         it('2nd page', function() {
            newState = controller._getPage(321);
            assert.equal(newState, 1);
         });
         it('End of 2nd page', function() {
            newState = controller._getPage(640);
            assert.equal(newState, 2);
         });
         it('Last page', function() {
            newState = controller._getPage(99999999);
            assert.equal(newState, 15);
         });
      });
   });
});