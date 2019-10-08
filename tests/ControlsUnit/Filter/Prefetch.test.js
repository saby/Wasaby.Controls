define(['Controls/_filter/Prefetch', 'Types/collection', 'Types/entity'], function(Prefetch, collection, entity) {

   function getPrefetchParams() {
      return {
         PrefetchSessionId: 'test',
         PrefetchDataValidUntil: new Date(),
         PrefetchDataCreated: new Date('December 17, 1995 03:24:00')
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
         assert.deepEqual(Prefetch.default.applyPrefetchFromItems(filter, getRecordSetWithPrefetch()), { PrefetchSessionId: 'test' });

         filter = {};
         assert.deepEqual(Prefetch.default.applyPrefetchFromItems(filter, getRecordSetWithoutPrefetch()), {});
      });

      it('applyPrefetchFromHistory', function() {
         var filter = {};
         assert.deepEqual(Prefetch.default.applyPrefetchFromHistory(filter, getHistoryWithPrefetch()), { PrefetchSessionId: 'test' });
      });

      it('getPrefetchParamsForSave', function() {
         var params = Prefetch.default.getPrefetchParamsForSave(getRecordSetWithPrefetch());
         assert.equal(params.PrefetchSessionId, 'test');

         params = Prefetch.default.getPrefetchParamsForSave(getRecordSetWithoutPrefetch());
         assert.equal(params, undefined);
      });

      it('addPrefetchToHistory', function() {
         var history = {
            items: []
         };

         Prefetch.default.addPrefetchToHistory(history);
         assert.isTrue(!history.prefetchParams);

         Prefetch.default.addPrefetchToHistory(history, getPrefetchParams());
         assert.equal(history.prefetchParams.PrefetchSessionId, 'test');
      });

      it('needInvalidatePrefetch', function() {
         var history = getHistoryWithPrefetch();
         history.prefetchParams.PrefetchDataValidUntil = new Date('December 17, 1995 03:24:00');
         assert.isTrue(Prefetch.default.needInvalidatePrefetch(history));
      });

      it('prepareFilter', function() {
         var prefetchOptions = {
            PrefetchMethod: 'testMethodName'
         };
         assert.deepEqual(Prefetch.default.prepareFilter({}, prefetchOptions), {PrefetchMethod: 'testMethodName'})
      });

      it('clearPrefetchSession', function() {
         var filterWithSession = {
            PrefetchSessionId: 'test',
            anyField: 'anyValue'
         };

         assert.deepEqual(Prefetch.default.clearPrefetchSession(filterWithSession), {anyField: 'anyValue'});
      });

      it('getPrefetchDataCreatedFromItems', function() {
         let dataCreated = new Date('December 17, 1995 03:24:00');
         assert.isTrue(Prefetch.default.getPrefetchDataCreatedFromItems(getRecordSetWithPrefetch()).getTime() === dataCreated.getTime());
      });
   });
});
