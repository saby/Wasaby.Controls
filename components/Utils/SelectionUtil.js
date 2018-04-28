define('SBIS3.CONTROLS/Utils/SelectionUtil', [
   'WS.Data/Entity/Record'
], function(Record) {
   'use strict';

   return {
      selectionToRecord: function(selection, adapter) {
         var
            result = new Record({
               adapter: adapter,
               format: [{
                  name: 'marked', type: 'array', kind: 'string'
               }, {
                  name: 'excluded', type: 'array', kind: 'string'
               }]
            }),
            prepareArray = function(array) {
               return array.map(function(value) {
                  return value !== null ? '' + value : value;
               });
            };

         result.set('marked', prepareArray(selection.marked));
         result.set('excluded', prepareArray(selection.excluded));

         return result;
      }
   };
});