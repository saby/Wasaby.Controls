/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/Utils/MemorySourceFilter', [], function() {
   
   'use strict';
   
   function compareValues(given, expect, operator) {
      var i;
      
      //If array expected, use "given in expect" logic
      if (expect instanceof Array) {
         for (i = 0; i < expect.length; i++) {
            if (compareValues(given, expect[i], operator)) {
               return true;
            }
         }
         return false;
      }
      
      //If array given, use "given has only expect" logic
      if (given instanceof Array) {
         for (i = 0; i < given.length; i++) {
            if (!compareValues(given[i], expect, operator)) {
               return false;
            }
         }
         return true;
      }
      
      //Otherwise - just compare
      return given == expect;
   }
   
   return function memorySourceFilter() {
      return function(item, queryFilter) {
         var addToData = true;
         
         for (var filterField in queryFilter) {
            if (queryFilter.hasOwnProperty(filterField) && item.get(filterField) && addToData) {
               var filterValue = queryFilter[filterField];
               var itemValue = item.get(filterField);
               var itemValueLowerCase;
               var filterValueLowerCase;
   
               if (typeof itemValue === 'string') {
                  itemValueLowerCase = itemValue.toLowerCase();
               }
               
               if (typeof filterValue === 'string') {
                  filterValueLowerCase = filterValue.toLowerCase();
               }
   
               if (typeof filterValue === 'string') {
                  addToData = compareValues(itemValue, filterValue, '=') || itemValueLowerCase.indexOf(filterValueLowerCase) !== -1;
               } else {
                  addToData = compareValues(itemValue, filterValue, '=');
               }
            }
         }
         return addToData;
      };
   };
});