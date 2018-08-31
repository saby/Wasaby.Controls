define('Controls/Container/MultiSelector/selectionToRecord', [
   'WS.Data/Entity/Record'
], function(Record) {
   'use strict';
   
   var prepareArray = function(array) {
      return array.map(function(value) {
         return value !== null ? '' + value : value;
      });
   };
   
   return function(selection, adapter) {
      var result = new Record({
         adapter: adapter,
         format: [{
            name: 'marked', type: 'array', kind: 'string'
         }, {
            name: 'excluded', type: 'array', kind: 'string'
         }]
      });
      
      result.set('marked', prepareArray(selection.selected));
      result.set('excluded', prepareArray(selection.excluded));
      
      return result;
   };
});