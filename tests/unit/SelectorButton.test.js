/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['SBIS3.CONTROLS/SelectorButton', 'WS.Data/Source/Memory'], function (SelectorButton, MemorySource) {
   'use strict';
   var
      SB;

   describe('SBIS3.CONTROLS/SelectorButton', function () {

      before(function() {
         var solarSystem = new MemorySource({
            data: [
               {id: 1, name: 'Sun', kind: 'Star'},
               {id: 2, name: 'Mercury', kind: 'Planet'},
               {id: 3, name: 'Venus', kind: 'Planet'}
            ],
            idProperty: 'id'
         });

         if (typeof $ === 'undefined') {
            this.skip();
         }
         var container = $('<div></div>');
         $('#mocha').append(container);
         SB = new SelectorButton({
            element: container,
            idProperty: 'id',
            dataSource: solarSystem
         });

      });

      beforeEach(function() {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });
      after(function() {
         SB && SB.destroy();
      });

      describe('Selector Button', function (){
         it('set key', function (){
            var keyAdded = false;
            SB.once("onSelectedItemChange", function () {
               keyAdded = true;
            });
            SB.setSelectedKey(1);
            assert.isTrue(keyAdded);
         });

         it('set key all ready setted',  function () {
            var keyAdded = false;
            SB.once("onSelectedItemChange", function () {
               keyAdded = true;
            });
            SB.setSelectedKey(1);
            assert.isFalse(keyAdded);
         });
      });
   });

});