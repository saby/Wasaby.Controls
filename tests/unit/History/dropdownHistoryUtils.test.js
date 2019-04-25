define(
   [
      'Controls/History/dropdownHistoryUtils',
      'Controls/history',
      'Types/source'
   ],
   (hUtils, history, Source) => {
   describe('dropdownHistoryUtils',() => {
      it('getFilter', () => {
         var filter = hUtils.getSourceFilter({id: 'test'}, new history.Source({}));
         assert.deepEqual(filter, {$_history: true, id: 'test'});
         filter = hUtils.getSourceFilter({id: 'test2'}, new Source.Memory({}));
         assert.deepEqual(filter, {id: 'test2'});
         filter = hUtils.getSourceFilter(undefined, new history.Source({}));
         assert.deepEqual(filter, {$_history: true});
      });
   });
});
