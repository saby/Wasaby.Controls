define([
   'Core/i18n',
   'SBIS3.CONTROLS/Date/RangeBigChoose',
   'SBIS3.CONTROLS/Utils/ControlsValidators'
], function(
   i18n,
   DateRangeChoose,
   controlsValidators
) {
   'use strict';

   describe('SBIS3.CONTROLS/Date/RangeBigChoose', function() {

      describe('._modifyOptions', function() {
         it('should set date fields validators if minPeriod option is equal "month"', function() {
            let opts = DateRangeChoose.prototype._modifyOptions({
               quantum: {},
               minQuantum: 'month',
               startValueValidators: [],
               endValueValidators: []
            });
            assert.strictEqual(opts.startValueValidators[0].validator, controlsValidators.startOfMonth);
            assert.strictEqual(opts.endValueValidators[0].validator, controlsValidators.endOfMonth);
         });
      });

   });
});
