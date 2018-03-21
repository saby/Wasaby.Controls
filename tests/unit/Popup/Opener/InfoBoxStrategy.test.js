define(
   [
      'Controls/Popup/Opener/InfoBox/InfoBoxStrategy'
   ],

   function (InfoBoxStrategy) {
      'use strict';
      describe('Controls/Popup/Opener/InfoBox/InfoBoxStrategy', function () {

         var arrowOffset = 12;
         var arrowWidth = 16;

         var tests = [{
            cfg: {
               targetWidth: 10,
               alignSide: 'l'
            },
            value: -15
         }, {
            cfg: {
               targetWidth: 10,
               alignSide: 'c'
            },
            value: 0
         }, {
            cfg: {
               targetWidth: 10,
               alignSide: 'r'
            },
            value: 15
         }, {
            cfg: {
               targetWidth: 100,
               alignSide: 'r'
            },
            value: 0
         }];

         tests.forEach(function(test){
            it('align: ' + JSON.stringify(test.cfg), function(){
               assert.isTrue(InfoBoxStrategy.getOffset(test.cfg.targetWidth, test.cfg.alignSide, arrowOffset, arrowWidth) === test.value);
            });
         });

      });
   }
);