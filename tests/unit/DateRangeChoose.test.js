define(['js!SBIS3.CONTROLS.DateRangeChoose'], function (DateRangeChoose) {
   'use strict';

   describe('SBIS3.CONTROLS.DateRangeChoose, current date 2017-01-01', function () {
      // this.timeout(1500000);
      let oldDate = Date;

      let fakeDate = function (fake) {
         return new oldDate('2017-01-01');
      };

      beforeEach(function () {
         Date = fakeDate;
      });

      afterEach(function () {
         Date = oldDate;
      });

      describe('._getDefaultYear', function () {
         let yearsOnlyConfig = {showYears: true, showHalfyears: false, showQuarters: false, showMonths:false},
            tests = [
            [{startValue: new Date(2000, 0)}, 2000],
            [{startValue: new Date(2016, 0)}, 2016],
            [{startValue: new Date(2017, 0)}, 2017],
            [{startValue: new Date(2018, 0)}, 2018],
            [{startValue: new Date(2030, 0)}, 2030],

            [Object.assign({startValue: new Date(2000, 0)}, yearsOnlyConfig), 2004],
            [Object.assign({startValue: new Date(2012, 0)}, yearsOnlyConfig), 2016],
            [Object.assign({startValue: new Date(2013, 0)}, yearsOnlyConfig), 2017],
            [Object.assign({startValue: new Date(2014, 0)}, yearsOnlyConfig), 2017],
            [Object.assign({startValue: new Date(2016, 0)}, yearsOnlyConfig), 2017],
            [Object.assign({startValue: new Date(2017, 0)}, yearsOnlyConfig), 2017],
            [Object.assign({startValue: new Date(2018, 0)}, yearsOnlyConfig), 2018],
            [Object.assign({startValue: new Date(2030, 0)}, yearsOnlyConfig), 2030]

         ];
         tests.forEach(function (test, index) {
            it('should return "' + test[1] + '" for options ' + test[0].startValue, function () {
               assert.strictEqual(DateRangeChoose.prototype._getDefaultYear(test[0]), test[1]);
            });
         });
      });


   });
});
