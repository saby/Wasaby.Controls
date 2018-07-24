define(
   [
      'Controls/History/Menu',
      'WS.Data/Entity/Model'
   ],
   function (Menu, Model) {
      
      'use strict';
   
      describe('Controls/History/Menu', function() {
         it('_private.getMetaHistory', function() {
            assert.deepEqual(Menu._private.getMetaHistory(), {
               $_history: true
            });
         });
   
         it('_private.getMetaPinned', function() {
            var item = new Model({rawData: {
               pinned: false
            }});
      
            assert.deepEqual(Menu._private.getMetaPinned(item), {
               $_pinned: true
            });
         });
   
         it('_private.prepareFilter', function() {
            var filter = {
               test: 'test'
            };
      
            assert.deepEqual(Menu._private.prepareFilter(filter), {
               test: 'test',
               $_history: true
            });
         });
      });
      
   });