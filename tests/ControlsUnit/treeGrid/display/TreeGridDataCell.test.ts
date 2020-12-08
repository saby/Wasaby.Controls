import { assert } from 'chai';
import TreeGridCollection from 'Controls/_treeGridNew/display/TreeGridCollection';

describe('Controls/_treeGridNew/display/TreeGridDataCell', () => {
   const treeGridCollection = new TreeGridCollection({
      collection: [{
         id: 1,
         parent: null,
         node: true,
         hasChildren: true
      }],
      keyProperty: 'id',
      parentProperty: 'parent',
      nodeProperty: 'node',
      hasChildrenProperty: 'hasChildren'
   });

   describe('getWrapperClasses', () => {
      it('without multiselect', () => {
         const expected = '';
         const cell = treeGridCollection.at(0).getColumns()[0];
         assert.equal(cell.getWrapperClasses('default', 'default'), expected);
      });

      it('with multiselect && first column', () => {
         treeGridCollection.setMultiSelectVisibility('visible');

         const expected = '';
         const cell = treeGridCollection.at(0).getColumns()[0];
         assert.equal(cell.getWrapperClasses('default', 'default'), expected);
      });

      it('with multiselect && not first column', () => {
         treeGridCollection.setMultiSelectVisibility('visible');

         const expected = '';
         const cell = treeGridCollection.at(0).getColumns()[1];
         assert.equal(cell.getWrapperClasses('default', 'default'), expected);
      });

      it('with multiselect && first column && custom checkbox position', () => {
         treeGridCollection.setMultiSelectPosition('custom');
         treeGridCollection.setMultiSelectVisibility('visible');

         const expected = '';
         const cell = treeGridCollection.at(0).getColumns()[0];
         assert.equal(cell.getWrapperClasses('default', 'default'), expected);
      });
   });
});
