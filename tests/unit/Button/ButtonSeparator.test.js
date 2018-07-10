define(['Controls/Button/ButtonSeparator'], function(Separator) {
   'use strict';
   var separator;
   describe('Controls/Button/ButtonSeparator', function() {
      function getSeparator() {
         separator = new Separator();
      }

      function destroySeparator() {
         separator.destroy();
         separator = undefined;
      }

      it('counter open state', function() {
         getSeparator();
         var opt = {
            value: true
         };
         separator.saveOptions(opt);
         separator._beforeMount(opt);
         assert.isTrue(separator._icon === 'icon-CollapseLight ', 'icon style generate incorrect');
         destroySeparator();
      });

      it('counter close state', function() {
         getSeparator();
         var opt = {
            value: false
         };
         separator.saveOptions(opt);
         separator._beforeMount(opt);
         assert.isTrue(separator._icon === 'icon-ExpandLight ', 'icon style generate incorrect');
         destroySeparator();
      });

      it('update counter open state to close state', function() {
         getSeparator();
         var opt = {
            value: true
         };
         var newOpt = {
            value: false
         };
         separator.saveOptions(opt);
         separator._beforeUpdate(newOpt);
         assert.isTrue(separator._icon === 'icon-ExpandLight ', 'icon style generate incorrect');
         destroySeparator();
      });

      it('update counter close state to open state', function() {
         getSeparator();
         var opt = {
            value: false
         };
         var newOpt = {
            value: true
         };
         separator.saveOptions(opt);
         separator._beforeUpdate(newOpt);
         assert.isTrue(separator._icon === 'icon-CollapseLight ', 'icon style generate incorrect');
         destroySeparator();
      });
   });
});