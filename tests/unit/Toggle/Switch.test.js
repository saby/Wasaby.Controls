define(['js!Controls/Toggle/Switch'], function (Switch) {
   'use strict';
   var SW, changeValue;
   describe('Controls.Toggle.Switch', function () {
      beforeEach(function(){
         if (typeof $ === 'undefined') {
            this.skip();
         }
         SW = new Switch({
            captions: ['capt1']
         });
         SW.subscribe('valueChanged', function (e, eventChangeValue) {
            changeValue = eventChangeValue
         });
      });

      afterEach(function () {
         //SW.destroy();
         //TODO: раскомментить дестрой когда будет сделана задача https://online.sbis.ru/opendoc.html?guid=4675dcd2-309b-402a-9c78-0bb4b3b2e644
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