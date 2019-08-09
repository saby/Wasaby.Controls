define([
   'Controls/Application/TouchDetector'
], function(
   TouchDetector
) {
   'use strict';

   describe('Controls/Application/TouchDetector', function() {
      it('two instances of TouchDetector on the same page should have different state', function() {
         var
            instance1 = new TouchDetector(),
            instance2 = new TouchDetector();

         instance1._beforeMount();
         instance2._beforeMount();

         assert.isFalse(instance1.isTouch());
         assert.isFalse(instance2.isTouch());
         instance1.touchHandler();
         assert.isTrue(instance1.isTouch());
         assert.isFalse(instance2.isTouch());
      });
   });
});
