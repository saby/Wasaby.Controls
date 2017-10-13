define(['js!SBIS3.CONTROLS.TreeDataGridView', 'WS.Data/Collection/RecordSet'], function (TreeDataGridView, RecordSet) {

   'use strict';

   describe('SBIS3.CONTROLS.TreeDataGridView (MassSelection)', function () {
      var
         sortSelection = function(selection) {
            selection.marked = selection.marked.sort();
            selection.excluded = selection.excluded.sort();
            return selection;
         },
         testComponent,
         testResult1 = { marked: [], excluded: [] },
         testResult2 = { marked: [1, 11, 12, 13], excluded: [] },
         testResult3 = { marked: [], excluded: [1] },
         testResult4 = { marked: [12], excluded: [] },
         testResult5 = { marked: [1, 11, 12, 13], excluded: [] },
         testResult6 = { marked: [], excluded: [11, 12, 13] },
         testResult7 = { marked: [13, 131, 133], excluded: [132] },
         testResult8 = { marked: [11, 12], excluded: [] };

      beforeEach(function() {
         if (typeof window !== 'undefined') {
            testComponent = new TreeDataGridView({
               element: $('<div class="TreeDataGridView"></div>').appendTo($('body')),
               idProperty: 'id',
               multiselect: true,
               useSelectAll: true,
               parentProperty: 'parent',
               displayProperty: 'title',
               items: new RecordSet({
                  rawData: [
                     { id: 1,  'title': '1',            'parent@': true, parent: null },
                     { id: 11, 'title': '1 -> 1',       'parent@': null, parent: 1 },
                     { id: 12, 'title': '1 -> 2',       'parent@': null, parent: 1 },
                     { id: 13, 'title': '1 -> 3',       'parent@': null, parent: 1 },
                     { id: 131, 'title': '1 -> 3 -> 1', 'parent@': null, parent: 13 },
                     { id: 132, 'title': '1 -> 3 -> 2', 'parent@': null, parent: 13 },
                     { id: 133, 'title': '1 -> 3 -> 3', 'parent@': null, parent: 13 }
                  ],
                  idProperty: 'id'
               })
            });
         } else {
            this.skip();
         }
      });

      afterEach(function() {
         if (typeof window !== 'undefined') {
            testComponent.destroy();
            testComponent = undefined;
         } else {
            this.skip();
         }
      });

      describe('Check default value', function () {
         if (typeof window !== 'undefined') {
            it('First check load component | Empty value', function () {
               assert.deepEqual(testComponent.getSelection(), testResult1);
            });
         }
      });
      describe('Check selecting items', function () {
         if (typeof window !== 'undefined') {
            it('Select and expand node "1"', function () {
               testComponent.addItemsSelection([1]);
               testComponent.expandNode(1);
               assert.deepEqual(sortSelection(testComponent.getSelection()), testResult2);
            });
            it('Select node "1" and expand', function () {
               testComponent.expandNode(1);
               testComponent.addItemsSelection([1]);
               assert.deepEqual(sortSelection(testComponent.getSelection()), testResult2);
            });
            it('Remove selection on collapsed node "1"', function () {
               testComponent.addItemsSelection([1]);
               testComponent.expandNode(1);
               testComponent.collapseNode(1);
               testComponent.removeItemsSelection([1]);
               assert.deepEqual(testComponent.getSelection(), testResult3);
            });
            it('Select child item', function () {
               testComponent.expandNode(1);
               testComponent.addItemsSelection([12]);
               assert.deepEqual(testComponent.getSelection(), testResult4);
            });
            it('Select all children', function () {
               testComponent.expandNode(1);
               testComponent.addItemsSelection([11, 12, 13]);
               assert.deepEqual(sortSelection(testComponent.getSelection()), testResult5);
            });
            it('Select parent and unselect all children', function () {
               testComponent.expandNode(1);
               testComponent.addItemsSelection([1]);
               testComponent.removeItemsSelection([11, 12, 13]);
               assert.deepEqual(sortSelection(testComponent.getSelection()), testResult6);
            });
            it('Select parent and unselect child', function () {
               testComponent.expandNode(1);
               testComponent.addItemsSelection([13]);
               testComponent.expandNode(13);
               testComponent.removeItemsSelection([132]);
               assert.deepEqual(sortSelection(testComponent.getSelection()), testResult7);
            });
            it('Select child and child', function () {
               testComponent.expandNode(1);
               testComponent.addItemsSelection([11]);
               testComponent.addItemsSelection([12]);
               assert.deepEqual(sortSelection(testComponent.getSelection()), testResult8);
            });
         }
      });
   });
});