define('Controls/Container/Data/getPrefetchSource',
   [
      'Controls/source',
      'Types/source',
      'Core/Deferred'
   ],
   
   function(scroll, sourceLib, Deferred) {
      
      'use strict';
      function load(sourceOptions, data) {
         var sourceController = new scroll.Controller({
            source: sourceOptions.source,
            navigation: sourceOptions.navigation,
            idProperty: sourceOptions.keyProperty
         });

         if (data) {
            return Promise.resolve(data);
         }

         return sourceController.load(sourceOptions.filter, sourceOptions.sorting);
      }

      function getThenFunction(source) {
         return function (result) {
            var error;
            var data;

            if (result instanceof Error) {
               error = result;
               data = undefined;
            } else {
               error = undefined;
               data = result;
            }

            return {
               source: new sourceLib.PrefetchProxy({
                  target: source,
                  data: {
                     query: error || data
                  }
               }),
               data: data,
               error: error
            };
         }
      }

      return function(sourceOptions, data) {
        var thenFunction = getThenFunction(sourceOptions.source);
        return load(sourceOptions, data).then(thenFunction, thenFunction)
      };
   });
