/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.VirtualScrollController', 'Core/core-functions'], function(VirtualScrollController, cFunctions) {

   'use strict';
   var newState = null,
      heights = [10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20,
                 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20,
                 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20, 10, 20, 10, 20, 20];
   describe('SBIS3.CONTROLS.VirtualScrollController', function() {
      var controller = new VirtualScrollController();
      describe('._getShownRange', function() {
         controller._heights = cFunctions.clone(heights);
         it('First page', function() {
            newState = controller._getShownRange(0, 5);
            assert.deepEqual(newState, [0, 100]);
         });
         it('Second page', function() {
            newState = controller._getShownRange(1, 5);
            assert.deepEqual(newState, [0, 100]);
         });
         it('Fourth page', function() {
            newState = controller._getShownRange(3, 5); 
            assert.deepEqual(newState, [20, 120]);
         });
         it('Fifth page', function() {
            newState = controller._getShownRange(4, 5);
            assert.deepEqual(newState, [40, 140]);
         });
         it('Large page', function() {
            newState = controller._getShownRange(12, 5);
            assert.deepEqual(newState, [200, 299]);
         });
      });

      describe('._calculateWrappersHeight', function() {
         controller._heights = cFunctions.clone(heights);
         it('From start', function() {
            newState = controller._calculateWrappersHeight([0, 40]);
            assert.deepEqual(newState, { begin: 0, end: 4160 });
         });
         it('All pages', function() {
            newState = controller._calculateWrappersHeight([0, 300]);
            assert.deepEqual(newState, { begin: 0, end: 0 });
         });
         it('From second page', function() {
            newState = controller._calculateWrappersHeight([40, 60]);
            assert.deepEqual(newState, { begin: 640, end: 3840 });
         });
         it('To last page', function() {
            newState = controller._calculateWrappersHeight([220, 300]);
            assert.deepEqual(newState, { begin: 3520, end: 0 });
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
            assert.deepEqual(newState, { add: [20, 30], remove: [0, 10], addPosition: 0 });
         });
         it('No intersection to bottom', function() {
            newState = controller._getDiff([20, 30], [0, 10]);
            assert.deepEqual(newState, { remove: [20, 30], add: [0, 10], addPosition: 0 });
         });
         it('Intersection 1 element', function() {
            newState = controller._getDiff([0, 10], [10, 20]);
            assert.deepEqual(newState, { add: [ 0, 9 ], remove: [ 11, 20 ], addPosition: 0 });
         });
         it('Intersection 10 elements', function() {
            newState = controller._getDiff([0, 20], [10, 30]);
            assert.deepEqual(newState, { remove: [ 0, 9 ], add: [ 21, 30 ], addPosition: 21 });
         });
      });

      describe('._getPage', function() {
         //scrollTop, viewportHeight, additionalHeight, pages
         controller._heights = cFunctions.clone(heights);
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
            assert.equal(newState, 1);
         });
         it('Last page', function() {
            newState = controller._getPage(99999999);
            assert.equal(newState, 14);
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

      describe('._getDirection', function() {
         //oldWindow, newWindow
         it('To end', function() {
            newState = controller._getDirection([0, 1], [2, 3]);
            assert.equal(newState, false);
         });
         it('To begin', function() {
            newState = controller._getDirection([2, 3], [0, 1]);
            assert.equal(newState, true);
         });
      });
      describe('._getPositionToAdd', function() {
         //diff, direction, mode
         it('To end [down]', function() {
            newState = controller._getPositionToAdd({begin: [0, 20], end: [40, 60]}, true);
            assert.equal(newState, 40);
         });
         it('To begin [down]', function() {
            newState = controller._getPositionToAdd({begin: [0, 20], end: [40, 60]}, false);
            assert.equal(newState, 0);
         });
      });
   });
});