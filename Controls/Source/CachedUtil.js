define('Controls/Source/CachedUtil',
   [
      'Controls/Controllers/SourceController',
      'Controls/Source/Cached',
      'Core/Deferred',
      'Core/core-instance'
   ],
   
   function(SourceController, Cached, Deferred, cInstance) {
      
      'use strict';
      
      return function(self, options) {
         var resultDeferred = new Deferred();
         var dataReadyDeferred;
         
         if (cInstance.instanceOfModule(options.source, 'Controls/Container/Source/Cached')) {
            dataReadyDeferred = Deferred.success(options.source.getCachedData());
         } else {
            var sourceController = new SourceController({
               source: options.source,
               navigation: options.navigation,
               idProperty: options.keyProperty
            });
            dataReadyDeferred = sourceController.load(options.filter, options.sorting);
         }
   
         dataReadyDeferred.addCallback(function(res) {
            self._source = new Cached({
               source: options.source,
               data: res
            });
            self._data = res;
            resultDeferred.callback();
            return res;
         });
         
         return resultDeferred;
      };
   });
