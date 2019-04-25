define('Controls/Container/Data/getPrefetchSource',
   [
      'Controls/source',
      'Types/source',
      'Core/Deferred'
   ],
   
   function(scroll, sourceLib, Deferred) {
      
      'use strict';
      
      return function(sourceOptions, data) {
         var sourceController = new scroll.Controller({
            source: sourceOptions.source,
            navigation: sourceOptions.navigation,
            idProperty: sourceOptions.keyProperty
         });
         
         var dataReady = data ? Deferred.success(data) : sourceController.load(sourceOptions.filter, sourceOptions.sorting);
         
         return dataReady.addCallback(function(resultData) {
            return {
               source: new sourceLib.PrefetchProxy({
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
