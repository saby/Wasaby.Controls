import chain = require('Types/chain');
import collection = require('Types/collection');
import Utils = require('Types/util');
      
      
      
      /* мапинг новой структуры в старую*/
      var recordToSructureElemMap = {
         id: 'internalValueField',
         caption: 'internalCaptionField',
         value: 'value',
         resetValue: 'resetValue',
         textValue: 'caption'
      };
      
      /* Мапинг старой стрктуры в новую */
      var structureMap = {};
      for (var i in recordToSructureElemMap) {
         if (recordToSructureElemMap.hasOwnProperty(i)) {
            structureMap[recordToSructureElemMap[i]] = i;
         }
      }

      function convertToFilterStructure(items) {
         return chain.factory(items).map(function(item) {
            var itemStructureItem = {};
            for (var i in structureMap) {
               if (Utils.object.getPropertyValue(item, structureMap[i]) !== undefined && structureMap.hasOwnProperty(i)) {
                  itemStructureItem[i] = Utils.object.getPropertyValue(item, structureMap[i]);
               }
            }
            return itemStructureItem;
         }).value();
      }
      
      function convertToSourceData(filterStructure) {
         var dataArray = [];

         chain.factory(filterStructure)
            .each(function(item) {
               var rsItem = {};
               for (var i in recordToSructureElemMap) {
                  if (Utils.object.getPropertyValue(item, recordToSructureElemMap[i]) && recordToSructureElemMap.hasOwnProperty(i)) {
                     rsItem[i] = Utils.object.getPropertyValue(item, recordToSructureElemMap[i]);
                  }
               }
               dataArray.push(rsItem);
            });
         return new collection.RecordSet({
            rawData: dataArray
         });

      }
      
      export = {
         convertToFilterStructure: convertToFilterStructure,
         convertToSourceData: convertToSourceData
      };
   
