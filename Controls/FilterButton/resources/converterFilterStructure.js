define('Controls/FilterButton/resources/converterFilterStructure',
   [
      'WS.Data/Chain'
   ],
   function (Chain) {

      'use strict';

      function convertToFilterStructure (structure) {
         return Chain(structure).map(function (item) {
            var itemStructure = {};
            itemStructure.internalValueField = item.id;
            itemStructure.itemTemplate = item.template;
            itemStructure.caption = item.textValue;
            itemStructure.value = item.value;
            itemStructure.resetValue = item.resetValue;
            itemStructure.internalCaptionField = item.caption;
            return itemStructure;
         });
      }

      function convertToSourceData (filterStructure) {
         return Chain(filterStructure).map(function (item) {
            var itemStructure = {};
            itemStructure.id = item.internalValueField;
            itemStructure.template = item.itemTemplate;
            itemStructure.textValue = item.caption;
            itemStructure.value = item.value;
            itemStructure.resetValue = item.resetValue;
            itemStructure.caption = item.internalCaptionField;
            return itemStructure;
         });
      }

      return {
         convertToFilterStructure: convertToFilterStructure,
         convertToSourceData: convertToSourceData
      };
   });