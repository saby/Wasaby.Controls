/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(
   ['js!SBIS3.CONTROLS.HierarchySelection',
    'WS.Data/Collection/RecordSet',
    'WS.Data/Display/Tree'
   ],
   function (Selection, RecordSet, Projection) {
      'use strict';

      var data = new RecordSet({
         rawData: [
            { id: 1,    'title': '1',            'parent@': true, parent: null },
            { id: 11,   'title': '1 -> 1',       'parent@': null, parent: 1 },
            { id: 12,   'title': '1 -> 2',       'parent@': null, parent: 1 },
            { id: 13,   'title': '1 -> 3',       'parent@': null, parent: 1 },
            { id: 131,  'title': '1 -> 3 -> 1',  'parent@': null, parent: 13 },
            { id: 132,  'title': '1 -> 3 -> 2',  'parent@': null, parent: 13 },
            { id: 133,  'title': '1 -> 3 -> 3',  'parent@': null, parent: 13 },
            { id: 2,    'title': '2',            'parent@': null, parent: null },
            { id: 3,    'title': '3',            'parent@': null, parent: null }
         ],
         idProperty: 'id'
      });

      var selection = new Selection({
         projection: new Projection({
            collection: data,
            idProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'parent@',
            root: null,
            rootEnumerable: false
         }),
         root: null
      });


      describe('SBIS3.CONTROLS.HierarchySelection', function () {
         beforeEach(function() {
            selection.removeAll();
         });
         it('addAll', function () {
            selection.addAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [null]);
            assert.deepEqual(sel.excluded, []);
         });
         it('removeAll', function () {
            selection.removeAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
         });
         it('add and removeAll', function () {
            selection.add([1]);
            selection.removeAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
         });
         it('add leaf first lvl', function () {
            selection.add([2]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [2]);
            assert.deepEqual(sel.excluded, []);
         });
         it('add folder first lvl', function () {
            selection.add([1]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, []);
         });
         it('add leaf second lvl', function () {
            selection.add([11]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [11]);
            assert.deepEqual(sel.excluded, []);
         });
         it('add folder second lvl', function () {
            selection.add([13]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [13]);
            assert.deepEqual(sel.excluded, []);
         });
         it('remove leaf first lvl', function () {
            selection.add([2]);
            selection.remove([2]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            //assert.deepEqual(sel.excluded, []);
         });
         it('remove leaf first lvl', function () {
            selection.add([1]);
            selection.remove([1]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            //assert.deepEqual(sel.excluded, []);
         });
         it('remove leaf second lvl', function () {
            selection.add([11]);
            selection.remove([11]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            //assert.deepEqual(sel.excluded, []);
         });
         it('add folder and remove leaf', function () {
            selection.add([1]);
            selection.remove([12]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, [12]);
         });
         it('add folder and delete two leafs', function () {
            selection.add([1]);
            selection.remove([11]);
            selection.remove([12]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, [11, 12]);
         });
         it('add folder and delete all leafs', function () {
            selection.add([1]);
            debugger;
            selection.remove([11, 12, 13]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            //assert.deepEqual(sel.excluded, []);
         });
         it('add all leafs', function () {
            selection.add([11, 12, 13]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [11, 12, 13]);
            assert.deepEqual(sel.excluded, []);
         });
         it('add folder delete child folder and add leaf', function () {
            selection.add([1]);
            selection.remove([13]);
            selection.add([131]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1, 131]);
            assert.deepEqual(sel.excluded, [13]);
         });
         it('toggle leaf first lvl', function () {
            selection.toggle([2]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [2]);
            assert.deepEqual(sel.excluded, []);
         });
         it('toggle folder first lvl', function () {
            selection.toggle([1]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, []);
         });
         it('toggle leaf second lvl', function () {
            selection.toggle([11]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [11]);
            assert.deepEqual(sel.excluded, []);
         });
         it('toggle folder second lvl', function () {
            selection.toggle([13]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [13]);
            assert.deepEqual(sel.excluded, []);
         });
         it('toggle and toggle', function () {
            selection.toggle([13]);
            selection.toggle([13]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, [13]);
         });
         it('add leafs and toggle parent folder', function () {
            selection.add([11, 12]);
            selection.toggle([1]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, []);
         });
         it('add all leafs and toggle parent folder', function () {
            selection.add([11, 12, 13]);
            selection.toggle([1]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, [1]);
         });
         it('toggleAll', function () {
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [null]);
            assert.deepEqual(sel.excluded, []);
            assert.isTrue(sel.isMarkedAll);
         });
         it('toggleAll and toggleAll', function () {
            selection.toggleAll();
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, []);
            assert.deepEqual(sel.excluded, []);
            assert.isFalse(sel.isMarkedAll);
         });
         it('add, toggleAll and toggleAll', function () {
            selection.add([1]);
            selection.toggleAll();
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [1]);
            assert.deepEqual(sel.excluded, []);
            assert.isFalse(sel.isMarkedAll);
         });
         it('add and toggleAll', function () {
            selection.add([2]);
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [null]);
            assert.deepEqual(sel.excluded, [2]);
         });
         it('add, toggleAll and remove', function () {
            selection.add([2]);
            selection.toggleAll();
            selection.remove([3]);
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [null]);
            assert.deepEqual(sel.excluded, [2, 3]);
         });
         it('add in folder and toggleAll', function () {
            selection.add([11, 12]);
            selection.toggleAll();
            var sel = selection.getSelection();
            assert.deepEqual(sel.marked, [null]);
            assert.deepEqual(sel.excluded, [11, 12]);
         });
      });
   });