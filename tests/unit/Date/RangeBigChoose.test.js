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

      let options = {
         quantum: {},
         minQuantum: 'month',
         mask: 'DD.MM.YYYY',
         startValueValidators: [],
         endValueValidators: []
      };

      describe('._modifyOptions', function() {

         it('should set date fields validators if minPeriod option is equal "month"', function() {
            let opts = DateRangeChoose.prototype._modifyOptions(Object.assign({}, options));
            assert.strictEqual(opts.startValueValidators[0].validator, controlsValidators.startOfMonth);
            assert.strictEqual(opts.endValueValidators[0].validator, controlsValidators.endOfMonth);
         });

         let tests = [
            ['DD.MM.YYYY', 'DD.MM.YYYY'],
            ['DD.MM.YY', 'DD.MM.YY'],
            ['DD.MM', 'DD.MM'],
            ['YYYY-MM-DD', 'YYYY-MM-DD'],
            ['YY-MM-DD', 'YY-MM-DD'],
            ['DD.MM.YYYY HH:II:SS.UUU', 'DD.MM.YYYY'],
            ['DD.MM.YYYY HH:II:SS', 'DD.MM.YYYY'],
            ['DD.MM.YYYY HH:II', 'DD.MM.YYYY'],
            ['DD.MM.YY HH:II:SS.UUU', 'DD.MM.YY'],
            ['DD.MM.YY HH:II:SS', 'DD.MM.YY'],
            ['DD.MM.YY HH:II', 'DD.MM.YY'],
            ['DD.MM HH:II:SS.UUU', 'DD.MM'],
            ['DD.MM HH:II:SS', 'DD.MM'],
            ['DD.MM HH:II', 'DD.MM'],
            ['YYYY-MM-DD HH:II:SS.UUU', 'YYYY-MM-DD'],
            ['YYYY-MM-DD HH:II:SS', 'YYYY-MM-DD'],
            ['YYYY-MM-DD HH:II', 'YYYY-MM-DD'],
            ['YY-MM-DD HH:II:SS.UUU', 'YY-MM-DD'],
            ['YY-MM-DD HH:II:SS', 'YY-MM-DD'],
            ['YY-MM-DD HH:II', 'YY-MM-DD']
         ];

         tests.forEach(function (test, index) {
            it(`should update mask field "${test[0]}" to "${test[1]}"`, function () {
               let opts = DateRangeChoose.prototype._modifyOptions(Object.assign({}, options, {
                  mask: test[0]
               }));
               assert.strictEqual(opts.mask, test[1]);
            });
         });

         it('should throw an error if mask is invalid', function () {
            assert.throws(function() {
               DateRangeChoose.prototype._modifyOptions(Object.assign({}, options, {
                  mask: 'invalid mask'
               }));
            });
         });

      });

   });
});
