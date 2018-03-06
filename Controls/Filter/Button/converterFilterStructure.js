define('Controls/Filter/Button/converterFilterStructure',
   [
      'WS.Data/Chain',
      'WS.Data/Entity/Record',
      'WS.Data/Collection/RecordSet'
   ],
   function (Chain, Record, RecordSet) {
      
      'use strict';
      
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
      
      function convertToFilterStructure (items) {
         return Chain(items).map(function (item) {
            var itemStructureItem = {};
            for (var i in structureMap) {
               if (item.hasOwnProperty(structureMap[i]) && structureMap.hasOwnProperty(i)) {
                  itemStructureItem[i] = item[structureMap[i]];
               }
            }
            return itemStructureItem;
         }).value();
      }
      
      function convertToSourceData (filterStructure) {
         return Chain(filterStructure)
            .map(function (item) {
               var rsItem = {};
               for (var i in recordToSructureElemMap) {
                  if (item.hasOwnProperty(recordToSructureElemMap[i]) && recordToSructureElemMap.hasOwnProperty(i)) {
                     rsItem[i] = item[recordToSructureElemMap[i]];
                  }
               }
               return new Record({
                  rawData: rsItem
               });
            })
            .value(RecordSet);
      }
      
      return {
         convertToFilterStructure: convertToFilterStructure,
         convertToSourceData: convertToSourceData
      };
   });