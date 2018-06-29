/**
 * Created by am.gerasimov on 29.06.2018.
 */
define(
   [
      'Controls/Source/Cached',
      'WS.Data/Source/Memory'
   ],
   function(Cached, Memory) {
      
      'use strict';
      
      var memorySource = new Memory({
         data: [{id: 1}, {id: 2}],
         idProperty: 'id'
      });
      
      describe('Controls.Source.Cached', function() {
         
         it('check cached data query', function(done) {
            memorySource.query().addCallback(function(result) {
               var data = result.getAll();
               
               var cachedSource = new Cached({
                  data: data,
                  source: memorySource
               });
   
               cachedSource.query().addCallback(function(res) {
                  assert.equal(data, res);
                  done();
               });
            });
         });
   
         it('check cached data read', function(done) {
            memorySource.query().addCallback(function(result) {
               var data = result.getAll();
         
               var cachedSource = new Cached({
                  data: data,
                  source: memorySource
               });
         
               cachedSource.read(1).addCallback(function(res) {
                  assert.equal(data.at(0), res);
                  done();
               });
            });
         });
         
      });
   }
);