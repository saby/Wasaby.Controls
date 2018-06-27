/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   ['SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/Selection',
    'WS.Data/Collection/RecordSet',
    'WS.Data/Display/Display',
    'WS.Data/Display/Collection'
   ],
   function (Selection, RecordSet, Projection) {
      'use strict';

      var data = new RecordSet({
         rawData: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}],
         idProperty: 'id'
      });

      var selection = new Selection({});

      selection.setProjection(Projection.getDefaultDisplay(data, {
         keyProperty: 'id'
      }));

      describe('SBIS3.CONTROLS/ListView/resources/MassSelectionController/resources/Selection', function () {
         beforeEach(function() {
            selection.unselectAll();
         });
         it('add', function () {
            selection.select([1]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
         });
         it('remove', function () {
            selection.select([1, 2]);
            selection.unselect([2]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, []);
         });
         it('addAll', function () {
            selection.selectAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, Selection.ALLSELECTION_VALUE);
         });
         it('removeAll', function () {
            selection.select([1, 2, 3]);
            selection.unselectAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
         });
         it('toggleAll', function () {
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, Selection.ALLSELECTION_VALUE);
            assert.deepEqual(sel.excluded, []);
         });
         it('add and toggleAll', function () {
            selection.select([1, 2]);
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, Selection.ALLSELECTION_VALUE);
            assert.deepEqual(sel.excluded, [1, 2]);
         });
         it('add, toggleAll and remove', function () {
            selection.select([1, 2]);
            selection.toggleAll();
            selection.unselect([3]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, Selection.ALLSELECTION_VALUE);
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
            selection.selectAll();
            selection.unselectAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
         });
         it('addAll and remove', function () {
            selection.selectAll();
            selection.unselect([1, 2]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.excluded, [1, 2]);
         });
      });
   });