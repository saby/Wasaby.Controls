define(['Controls/operations', 'Types/source'], function (operations, source) {
   describe('Controls.operations:FilterController', function() {
      it('_beforeUpdate', function() {
         let filterController = new operations.FilterController();
         let sourceInstance = new source.SbisService({
            endpoint: {contract: '123'},
            keyProperty: 'id'
         });

         filterController._beforeUpdate({filter: {}, source: sourceInstance});
         assert.deepEqual(filterController._filter, {});

         filterController._showSelectedEntries = true;
         filterController._beforeUpdate({filter: {}, source: sourceInstance});
         assert.isTrue('selectionWithPaths' in filterController._filter);
      });
   });
});
