define(['Controls/Button/ButtonSeparator'], function (Separator) {
   'use strict';
   var separator, successIconClick;
   describe('Controls/Button/ButtonSeparator', function () {
      beforeEach(function(){
         separator = new Separator();
      });

      afterEach(function () {
         separator.destroy();
         separator = undefined;
      });

      it('counter open state', function () {
         var opt = {
            value: true
         };
         separator._beforeMount(opt);
         assert(separator._icon === 'icon-CollapseLight icon-16');
      });

      it('counter close state', function () {
         var opt = {
            value: false
         };
         separator._beforeMount(opt);
         assert(separator._icon === 'icon-ExpandLight icon-16');
      });

      it('update counter open state to close state', function () {
         var opt = {
            value: true
         };
         var newOpt = {
            value: false
         };
         separator.saveOptions(opt);
         separator._beforeUpdate(newOpt);
         assert(separator._icon === 'icon-ExpandLight icon-16');
      });

      it('update counter close state to open state', function () {
         var opt = {
            value: false
         };
         var newOpt = {
            value: true
         };
         separator.saveOptions(opt);
         separator._beforeUpdate(newOpt);
         assert(separator._icon === 'icon-CollapseLight icon-16');
      });
   });
});