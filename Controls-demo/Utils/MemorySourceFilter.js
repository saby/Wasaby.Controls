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
   
   return function memorySourceFilter(searchParam) {
      return function(item, queryFilter) {
         var data = item.getData();
         var addToData = false;
         var hasItemFieldInFilter = false;
         var searchParamFilterValue = queryFilter[searchParam];
         
         //Сначала понимаем, подходит ли запись под поисковой параметр
         if (searchParamFilterValue) {
            hasItemFieldInFilter = true;
            searchParamFilterValue = searchParamFilterValue.toLowerCase();
            
            for (var dataKey in data) {
               var dataValue = data[dataKey];
               
               if (typeof dataValue === 'string') {
                  dataValue = dataValue.toLowerCase();
                  
                  if (compareValues(dataValue, searchParamFilterValue, '=') || dataValue.indexOf(searchParamFilterValue) !== -1) {
                     addToData = true;
                  }
               }
            }
         } else {
            //Поискового параметра нет, фильтруем по остальным полям
            for (var filterKey in queryFilter) {
               var filterValue = queryFilter[filterKey];
               
               if (typeof filterValue === 'string') {
                  filterValue = filterValue.toLowerCase();
               }
               
               for (var dataKey in data) {
                  var dataValue = data[dataKey];
                  var dataValueLoweCase;
                  
                  if (filterKey === dataKey) {
                     hasItemFieldInFilter = true;
                     
                     if (typeof dataValue === 'string') {
                        dataValueLoweCase = dataValue.toLowerCase();
                     }
                     
                     if (typeof filterValue === 'string') {
                        addToData = compareValues(dataValue, filterValue, '=') || dataValueLoweCase.indexOf(filterValue) !== -1;
                     } else {
                        addToData = compareValues(dataValue, filterValue, '=');
                     }
                  }
               }
            }
         }
         
         return hasItemFieldInFilter ? addToData : true;
      };
   };
});