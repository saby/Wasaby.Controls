/**
 * Created by kraynovdo on 23.10.2017.
 */
define([
   'Controls/List/ItemActions/Helpers',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/RecordSet'
], function(Helpers, Model, RecordSet) {

   describe('Controls.List.ItemActions.Helpers', function() {
      describe('reorderMoveActionsVisibility', function() {
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
               parent: null,
               'parent@': null
            }, {
               id: 6,
               parent: null,
               'parent@': null
            }];
            rs = new RecordSet({
               idProperty: 'id',
               rawData: data
            });
         });

         it('move first item up', function() {
            assert.isFalse(Helpers.reorderMoveActionsVisibility('up', rs.at(0), rs));
         });

         it('move first item down', function() {
            assert.isTrue(Helpers.reorderMoveActionsVisibility('down', rs.at(0), rs));
         });

         it('move last item down', function() {
            assert.isFalse(Helpers.reorderMoveActionsVisibility('down', rs.at(rs.getCount() - 1), rs));
         });

         it('move last item up', function() {
            assert.isTrue(Helpers.reorderMoveActionsVisibility('up', rs.at(rs.getCount() - 1), rs));
         });

         it('move first item up in folder', function() {
            assert.isFalse(Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(2), rs, 'parent'));
         });

         it('move first item down in folder', function() {
            assert.isTrue(Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(2), rs, 'parent'));
         });

         it('move last item down in folder', function() {
            assert.isFalse(Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(3), rs, 'parent'));
         });

         it('move last item up in folder', function() {
            assert.isTrue(Helpers.reorderMoveActionsVisibility('up', rs.getRecordById(3), rs, 'parent'));
         });

         it('change order list and folder', function() {
            assert.isFalse(Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(4), rs, 'parent', 'parent@'));
         });

         it('change order list and list', function() {
            assert.isTrue(Helpers.reorderMoveActionsVisibility('down', rs.getRecordById(5), rs, 'parent', 'parent@'));
         });
      });
   });
});
