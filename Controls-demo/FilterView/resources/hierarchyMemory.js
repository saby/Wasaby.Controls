define('Controls-demo/FilterView/resources/hierarchyMemory', [
      'Core/Deferred',
      'Types/source',
      'Types/collection'
   ],

   function(Deferred, source, collection) {

      'use strict';

      var FilterViewMemory = source.Memory.extend({

         constructor: function(options) {
            FilterViewMemory.superclass.constructor.apply(this, arguments);
         },

         query: function(queryInst) {
            var resultDeferred = new Deferred();
            var superQuery = FilterViewMemory.superclass.query.apply(this, arguments);
            var self = this;

            superQuery.addCallback(function(dataSet) {
               var getAll = dataSet.getAll.bind(dataSet);
               var originAll = getAll();
               var originAllMeta = originAll.getMetaData();
               var moreResult = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: [{
                     id: 'Приход',
                     nav_result: true
                  }, {
                     id: 'Расход',
                     nav_result: false
                  }]
               });

               dataSet.getAll = function() {
                  var resultAll = getAll();
                  resultAll.setMetaData({more: moreResult});
                  return resultAll;
               };
               resultDeferred.callback(dataSet);
               return dataSet;
            });

            return resultDeferred;
         }

      });

      return FilterViewMemory;
   });
