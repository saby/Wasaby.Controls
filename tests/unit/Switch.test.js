define(['js!Controls/Toggle/Switch'], function (Switch) {
   'use strict';
   var SW, changeValue;
   describe('SBIS3.CONTROLS.Switch', function () {
      beforeEach(function(){
         SW = new Switch({
            captions: ['capt1']
         });
         SW.subscribe('valueChanged', function (e, eventChangeValue) {
            changeValue = eventChangeValue
         });
      });

      afterEach(function () {
         SW.destroy();
         SW = undefined;
      });

      it('click to ON state', function () {
         var opt = {
           value:false
         };
         SW.saveOptions(opt);
         SW._clickHandler();
         assert(changeValue);
      });

      it('click to OFF state', function () {
         var opt = {
            value:true
         };
         SW.saveOptions(opt);
         SW._clickHandler();
         assert(!changeValue);
      });
   });
});