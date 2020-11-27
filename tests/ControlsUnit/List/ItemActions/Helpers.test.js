/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/list',
   'Types/entity',
   'Types/collection'
], function(lists, entity, collection) {

   describe('Controls.List.ItemActions.Helpers', function() {
      /*describe('reorderMoveActionsVisibility', function() {
         var data, rs;
         beforeEach(function() {
            data = [{
               id: 1,
               parent: null,
               'parent@': true
            }, {
               id: 2,
               parent: 1,
               'parent@': null
            }, {
               id: 3,
               parent: 1,
               'parent@': null
            }, {
               id: 4,
               parent: null,
               'parent@': true
            }, {
               id: 5,
               parent: 4,
               'parent@': null
            }, {
               id: 6,
               parent: 4,
               'parent@': null
            }, {
               id: 7,
               parent: null,
               'parent@': true
            }, {
               id: 8,
               parent: null,
               'parent@': null
            }];
            rs = new collection.RecordSet({
               keyProperty: 'id',
               rawData: data
            });
         });

         it('move first item up', function() {
            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.at(0), rs));
         });

         it('move first item down', function() {
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.at(0), rs));
         });

         it('move last item down', function() {
            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.at(rs.getCount() - 1), rs));
         });

         it('move last item up', function() {
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.at(rs.getCount() - 1), rs));
         });

         it('move first item up in folder', function() {
            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(2), rs, 'parent'));
         });

         it('move first item down in folder', function() {
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(2), rs, 'parent'));
         });

         it('move last item down in folder', function() {
            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(3), rs, 'parent'));
         });

         it('move last item up in folder', function() {
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(3), rs, 'parent'));
         });

         it('move folder down', function() {
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(4), rs, 'parent', 'parent@'));
         });

         it('move last folder down', function() {
            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(7), rs, 'parent', 'parent@'));
         });

         it('change order list and list', function() {
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(5), rs, 'parent', 'parent@'));
         });

         it('append item', () => {
            const newItem = { id: 0, parent: null, 'parent@': null };
            const newItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [newItem]
            });

            // creating cached display
            lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(1), rs)

            rs.append(newItems);

            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(0), rs));
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(0), rs));
         });

         it('prepend item', () => {
            const newItem = { id: 0, parent: null, 'parent@': null };
            const newItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [newItem]
            });

            // creating cached display
            lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(1), rs)

            rs.prepend(newItems);

            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(0), rs));
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(0), rs));
         });

         it('in folder', function() {
            data = [{
               id: 2,
               parent: 1,
               'parent@': null
            }, {
               id: 3,
               parent: 1,
               'parent@': null
            }];
            rs = new collection.RecordSet({
               keyProperty: 'id',
               rawData: data
            });
            let root = 1;
            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(2), rs, 'parent', '', root));
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(2), rs, 'parent', '', root));
            assert.isFalse(lists.ItemActionsHelpers.reorderMoveActionsVisibility('down', rs.getRecordById(3), rs, 'parent', '', root));
            assert.isTrue(lists.ItemActionsHelpers.reorderMoveActionsVisibility('up', rs.getRecordById(3), rs, 'parent', '', root));
         });
      });*/
   });
});
