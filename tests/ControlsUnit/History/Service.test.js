define(['Controls/history', 'Core/Deferred'], (history, Deferred) => {

   describe('Controls/history:Service', () => {

      it('query', () => {
         const service = new history.Service({historyId: 'testId'});
         const loadDeferred = new Deferred();

         service._historyDataSource = {call: () => loadDeferred};

         let queryDef = service.query();
         assert.isTrue(queryDef === loadDeferred);
         //the same query on next call
         assert.isTrue(service.query() === queryDef);
      });

   });

});