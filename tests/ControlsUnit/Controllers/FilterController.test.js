define(['Controls/operations', 'Types/source'], function (operations, source) {
   describe('Controls.operations:FilterController', function() {
      it('_beforeUpdate', function() {
         let filterController = new operations.FilterController();
         let sourceInstance = new source.SbisService({
            endpoint: {contract: '123'},
            keyProperty: 'id'
         });

         filterController._beforeUpdate({filter: {}});
         assert.deepEqual(filterController._filter, {});

         filterController._beforeUpdate({filter: {}, source: sourceInstance, selectionViewMode: 'selected'});
         assert.isTrue('SelectionWithPath' in filterController._filter);

         filterController._beforeUpdate({filter: {}, source: sourceInstance, selectedKeys: [1, 2], excludedKeys: [3], parentProperty: 'testParentProperty'});
         assert.isTrue('entries' in filterController._filter);
      });
   });
});
