
define([
   'Controls/Input/resources/SuggestView/SuggestView',
   'WS.Data/Collection/List',
   'WS.Data/Entity/Model'
], function(SuggestView, List, Model) {
   
   'use strict';
   
   describe('Controls/Input/resources/SuggestView/SuggestView', function() {
      
      it('_private.getMarkedKey', function() {
         var items = new List({
            items: [
               new Model({
                  idProperty: 'idProperty',
                  rawData: {
                     idProperty: 1
                  }
               }),
               new Model({
                  idProperty: 'idProperty',
                  rawData: {
                     idProperty: 2
                  }
               })
            ]
         });
         
         assert.equal(SuggestView._private.getMarkedKey(items, 'idProperty', 0), 1);
         assert.equal(SuggestView._private.getMarkedKey(items, 'idProperty', 1), 2);
         assert.equal(SuggestView._private.getMarkedKey(items, 'idProperty', 2), null);
      });
   
      it('_private.getOptionsForShowAll', function() {
         var self = {
            _options: {
               filter: {
                  myField: 'myValue'
               }
            }
         };
         
         assert.deepEqual(
            SuggestView._private.getOptionsForShowAll(self),
            {
               templateOptions: {
                  filter: {
                     myField: 'myValue'
                  }
               }
            },
            'wrong options for showAll component'
         );
      });

   });
});
