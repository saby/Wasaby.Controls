define(['Controls/_filter/Prefetch', 'Types/collection', 'Types/entity'], function(Prefetch, collection, entity) {

   function getPrefetchParams() {
      return {
         PrefetchSessionId: 'test',
         PrefetchDataValidUntil: new Date()
      };
   }
   
   function getRecordSetWithoutPrefetch() {
      return new collection.RecordSet();
   }

   function getRecordSetWithPrefetch() {
      var recordSet = getRecordSetWithoutPrefetch();
      var results = new entity.Model({
         rawData: getPrefetchParams()
      });

      recordSet.setMetaData({ results: results });
      return recordSet;
   }

   function getHistoryWithPrefetch() {
      return {
         items: [],
         prefetchParams: getPrefetchParams()
      };
   }

   describe('Controls.filter.Prefetch', function() {
      it('applyPrefetchFromItems', function() {
         var filter = {};
         assert.deepEqual(Prefetch.applyPrefetchFromItems(filter, getRecordSetWithPrefetch()), { PrefetchSessionId: 'test' });

         filter = {};
         assert.deepEqual(Prefetch.applyPrefetchFromItems(filter, getRecordSetWithoutPrefetch()), {});
      });

      it('applyPrefetchFromHistory', function() {
         var filter = {};
         assert.deepEqual(Prefetch.applyPrefetchFromHistory(filter, getHistoryWithPrefetch()), { PrefetchSessionId: 'test' });
      });

      it('getPrefetchParamsForSave', function() {
         var params = Prefetch.getPrefetchParamsForSave(getRecordSetWithPrefetch());
         assert.equal(params.PrefetchSessionId, 'test');

         params = Prefetch.getPrefetchParamsForSave(getRecordSetWithoutPrefetch());
         assert.equal(params, undefined);
      });

      it('addPrefetchToHistory', function() {
         var history = {
            items: []
         };

         Prefetch.addPrefetchToHistory(history, getPrefetchParams());
         assert.equal(history.prefetchParams.PrefetchSessionId, 'test');
      });

      it('needInvalidatePrefetch', function() {
         var history = getHistoryWithPrefetch();
         history.prefetchParams.PrefetchDataValidUntil = new Date('December 17, 1995 03:24:00');
         assert.isTrue(Prefetch.needInvalidatePrefetch(history));
      });

      it('prepareFilter', function() {
         var prefetchOptions = {
            PrefetchMethod: 'testMethodName'
         };
         assert.deepEqual(Prefetch.prepareFilter({}, prefetchOptions), {PrefetchMethod: 'testMethodName'})
      });

      it('clearPrefetchSession', function() {
         var filterWithSession = {
            PrefetchSessionId: 'test',
            anyField: 'anyValue'
         };

         assert.deepEqual(Prefetch.clearPrefetchSession(filterWithSession), {anyField: 'anyValue'});
      });
   });
});
