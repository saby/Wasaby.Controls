/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   ['js!SBIS3.CONTROLS.Selection',
    'WS.Data/Collection/RecordSet',
    'WS.Data/Display/Display'
   ],
   function (Selection, RecordSet, Projection) {
      'use strict';

      var data = new RecordSet({
         rawData: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}],
         idProperty: 'id'
      });

      var selection = new Selection({
         projection: Projection.getDefaultDisplay(data, {
            idProperty: 'id'
         })
      });


      describe('SBIS3.CONTROLS.Selection', function () {
         beforeEach(function() {
            selection.removeAll();
         });
         it('add', function () {
            selection.add([1]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
         });
         it('remove', function () {
            selection.add([1, 2]);
            selection.remove([2]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, []);
         });
         it('addAll', function () {
            selection.addAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.isTrue(sel.isMarkedAll);
         });
         it('removeAll', function () {
            selection.add([1, 2, 3]);
            selection.removeAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
         });
         it('toggleAll', function () {
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
         });
         it('add and toggleAll', function () {
            selection.add([1, 2]);
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, [1, 2]);
         });
         it('add, toggleAll and remove', function () {
            selection.add([1, 2]);
            selection.toggleAll();
            selection.remove([3]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, [1, 2, 3]);
         });
         it('toggleAll and toggleAll', function () {
            selection.toggleAll();
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
         });
         it('addAll and removeAll', function () {
            selection.addAll();
            selection.removeAll();
            var sel = selection.getSelection();
            assert.isFalse(sel.isMarkedAll);
         });
         it('addAll and remove', function () {
            selection.addAll();
            selection.remove([1, 2]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.excluded, [1, 2]);
            assert.isTrue(sel.isMarkedAll);
         });
      });
   });