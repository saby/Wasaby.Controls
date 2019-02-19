define(
   [
      'Controls/History/dropdownHistoryUtils',
      'Controls/History/Source',
      'Types/source'
   ],
   (hUtils, historySource, Source) => {
   describe('dropdownHistoryUtils',() => {
      it('getFilter', () => {
         var filter = hUtils.getSourceFilter({id: 'test'}, new historySource({}));
         assert.deepEqual(filter, {$_history: true, id: 'test'});
         filter = hUtils.getSourceFilter({id: 'test2'}, new Source.Memory({}));
         assert.deepEqual(filter, {id: 'test2'});
         filter = hUtils.getSourceFilter(undefined, new historySource({}));
         assert.deepEqual(filter, {$_history: true});
      });
   });
});
