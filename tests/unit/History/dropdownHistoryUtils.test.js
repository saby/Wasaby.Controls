define(
   [
      'Controls/dropdown',
      'Controls/history',
      'Types/source'
   ],
   (dropdown, history, Source) => {
   describe('dropdownHistoryUtils',() => {
      it('getFilter', () => {
         var filter = dropdown.dropdownHistoryUtils.getSourceFilter({id: 'test'}, new history.Source({}));
         assert.deepEqual(filter, {$_history: true, id: 'test'});
         filter = dropdown.dropdownHistoryUtils.getSourceFilter({id: 'test2'}, new Source.Memory({}));
         assert.deepEqual(filter, {id: 'test2'});
         filter = dropdown.dropdownHistoryUtils.getSourceFilter(undefined, new history.Source({}));
         assert.deepEqual(filter, {$_history: true});
      });
   });
});
