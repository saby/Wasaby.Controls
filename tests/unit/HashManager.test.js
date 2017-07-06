define(['Core/HashManager'], function (HashManager) {

   'use strict';

   describe('Core/HashManager', function () {
      if (typeof window !== 'undefined') {
         beforeEach(function () {
            window.location.hash = "";
         });

         it('Set value.', function(){
            HashManager.set("keyS", "123");
            assert.equal("123", HashManager.get("keyS"));
         });

         it('Set value then remove it.', function () {
            HashManager.set("keyS", "123");
            HashManager.remove("keyS");
            assert.equal(HashManager.get("keyS"), undefined);
         });
      }
   });
});