define([
   'js!SBIS3.CONTROLS.DateRangeSliderBase'
], function (DateRangeSliderBase) {
   'use strict';

   describe('SBIS3.CONTROLS.DateRangeSliderBase', function () {
      describe('._getCaption', function () {
         it('should return emptyCaption option value if range dont specified.', function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
            let emptyStr = '...',
               control = new DateRangeSliderBase({emptyCaption: emptyStr, showUndefined: true});
            assert.strictEqual(control._getCaption(), emptyStr);
         });
         it('should return range string value if emptyCaption option and range dont specified.', function () {
            if (typeof $ === 'undefined') {
               this.skip();
            }
            let control = new DateRangeSliderBase({
                  emptyCaption: '...',
                  showUndefined: true,
                  startValue: new Date(2017, 0, 1),
                  endValue: new Date(2017, 0, 1)
               });
            assert.strictEqual(control._getCaption(), "1 января'17");
         });

         it('should return emptyCaption option value if options passed as parameter and range dont specified.', function () {
            let emptyStr = '...';
            assert.strictEqual(DateRangeSliderBase.prototype._getCaption({emptyCaption: emptyStr, showUndefined: true}), emptyStr);
         });
         it('should return range string value if options passed as parameter and emptyCaption option and range dont specified.', function () {
            let opts =  {
                  emptyCaption: '...',
                  showUndefined: true,
                  startValue: new Date(2017, 0, 1),
                  endValue: new Date(2017, 0, 1)
               };
            assert.strictEqual(DateRangeSliderBase.prototype._getCaption(opts), "1 января'17");
         });
      });
   });
});
