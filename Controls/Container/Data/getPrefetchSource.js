define('Controls/Container/Data/getPrefetchSource',
   [
      'Controls/Controllers/SourceController',
      'WS.Data/Source/PrefetchProxy',
      'Core/Deferred'
   ],
   
   function(SourceController, PrefetchProxy, Deferred) {
      
      'use strict';
      
      return function(sourceOptions, data) {
         var sourceController = new SourceController({
            source: sourceOptions.source,
            navigation: sourceOptions.navigation,
            idProperty: sourceOptions.keyProperty
         });
         
         var dataReady = data ? Deferred.success(data) : sourceController.load(sourceOptions.filter, sourceOptions.sorting);
         
         return dataReady.addCallback(function(resultData) {
            return {
               source: new PrefetchProxy({
                  target: sourceOptions.source,
                  data: {
                     query: resultData
                  }
               }),
               data: resultData
            };
         });
      };
   });
