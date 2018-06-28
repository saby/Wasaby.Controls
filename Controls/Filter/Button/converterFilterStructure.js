define('Controls/Filter/Button/converterFilterStructure',
   [
      'WS.Data/Chain',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Utils'
   ],
   function(Chain, RecordSet, Util) {
      
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

      function convertToFilterStructure(items) {
         return Chain(items).map(function(item) {
            var itemStructureItem = {};
            for (var i in structureMap) {
               if (Util.getItemPropertyValue(item, structureMap[i]) !== undefined && structureMap.hasOwnProperty(i)) {
                  itemStructureItem[i] = Util.getItemPropertyValue(item, structureMap[i]);
               }
            }
            return itemStructureItem;
         }).value();
      }
      
      function convertToSourceData(filterStructure) {
         var dataArray = [];

         Chain(filterStructure)
            .each(function(item) {
               var rsItem = {};
               for (var i in recordToSructureElemMap) {
                  if (Util.getItemPropertyValue(item, recordToSructureElemMap[i]) && recordToSructureElemMap.hasOwnProperty(i)) {
                     rsItem[i] = Util.getItemPropertyValue(item, recordToSructureElemMap[i]);
                  }
               }
               dataArray.push(rsItem);
            });
         return new RecordSet({
            rawData: dataArray
         });

      }
      
      return {
         convertToFilterStructure: convertToFilterStructure,
         convertToSourceData: convertToSourceData
      };
   });
