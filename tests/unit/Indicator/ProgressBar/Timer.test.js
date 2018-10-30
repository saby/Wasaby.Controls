define(
   [
      'Controls/Indicator/Progress/Timer'
   ],
   function(Timer) {
      'use strict';

      describe('Controls/Indicator/Progress/Timer', function() {
         it('_getDisplayTime', function() {
            var
               res = (new Timer())._getDisplayTime.apply({
                  _time: 1536
               });
            assert.equal(res, '25:36');
         });
      });
   }
);
