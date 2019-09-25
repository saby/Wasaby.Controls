define(['Controls/history', 'Core/Deferred'], (history, Deferred) => {

   describe('Controls/history:Service', () => {

      it('query', () => {
         const service = new history.Service({historyId: 'testId'});
         const loadDeferred = new Deferred();

         service._historyDataSource = {call: () => loadDeferred};

         let queryDef = service.query();
         assert.isTrue(queryDef === loadDeferred);

         let nextQuery = service.query();
         let loadData, expectedData = 'test';
         service.saveHistory('testId', expectedData);
         nextQuery.addCallback((data) => {
            loadData = data;
         });
         loadDeferred.callback();
         assert.equal(loadData, expectedData);
      });

   });

});