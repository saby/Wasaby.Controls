define('Controls/Search/Misspell/getSwitcherStrFromData', [], function() {
   
   'use strict';
   
   var SWITCHED_STR_FIELD = 'switchedStr';
   
   return function(data) {
      var metaData = data && data.getMetaData();
      return metaData && metaData.results ? metaData.results.get(SWITCHED_STR_FIELD) : null;
   };
});
