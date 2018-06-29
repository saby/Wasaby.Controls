define(
   [
      'Controls/Container/SourceBase',
      'WS.Data/Source/Memory'
   ],
   function(SourceBase, Memory) {
      
      'use strict';
      
      var memorySource = new Memory({
         data: [{id: 1}, {id: 2}],
         idProperty: 'id'
      });
      var optsObject = {
         filter: {},
         navigation: {},
         keyProperty: 'id'
      };
      var stateObject = {
         _filter: {},
         _navigation: {},
         _keyProperty: 'id'
      };
      
      describe('Controls.Container.SourceBase', function() {
         
         it('_private.getStateFieldByOptName', function() {
            assert.equal('_filter', SourceBase._private.getStateFieldByOptName('filter'));
         });
         
         it('_private.createOptionsObject', function() {
            var opts = SourceBase._private.createOptionsObject(stateObject);
            assert.deepEqual(opts.filter, optsObject.filter);
            assert.deepEqual(opts.navigation, optsObject.navigation);
            assert.deepEqual(opts.keyProperty, optsObject.keyProperty);
         });
   
         it('_beforeMount', function(done) {
            var sb = new SourceBase();
            var optsObject = {
               filter: {},
               navigation: {},
               keyProperty: 'id',
               source: memorySource
            };
            sb._beforeMount(optsObject).addCallback(function(result) {
               assert.equal(sb._data.getCount(), 2);
               done();
               return result;
            });
         });
         
      });
   }
);