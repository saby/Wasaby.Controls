/* global define, describe, it, assert */
define([
   'Core/core-merge',
   'Controls/Utils/Date',
   'SBIS3.CONTROLS/Date/RangeChoose'
], function (
   coreMerge,
   DateUtils,
   DateRangeChoose
) {
   'use strict';

   describe('SBIS3.CONTROLS/Date/RangeChoose', function () {
      describe('._modifyOptions', function () {
         it('should create correct month model', function() {
            const year = (new Date()).getFullYear(),
               opts = DateRangeChoose.prototype._modifyOptions({}),
               data = [{
                  name: 'I',
                  quarters: [{
                     name: 'I',
                     months: [ new Date(year, 0, 1), new Date(year, 1, 1), new Date(year, 2, 1) ]
                  }, {
                     name: 'II',
                     months: [ new Date(year, 3, 1), new Date(year, 4, 1), new Date(year, 5, 1) ]
                  }]
               }, {
                  name: 'II',
                  quarters: [{
                     name: 'III',
                     months: [ new Date(year, 6, 1), new Date(year, 7, 1), new Date(year, 8, 1) ]
                  }, {
                     name: 'IV',
                     months: [ new Date(year, 9, 1), new Date(year, 10, 1), new Date(year, 11, 1) ]
                  }]
               }];

            // Compare all but months.
            assert.deepEqual(
               coreMerge({}, opts._months, { ignoreRegExp: /^months$/, clone: true }),
               coreMerge({}, data, { ignoreRegExp: /^months$/, clone: true })
            );

            // And now let's check the month.
            for (let [halhyearIndex, halhyear] of data.entries()) {
               for (let [quarterIndex, quarter] of halhyear.quarters.entries()) {
                  for (let [monthIndex, month] of quarter.months.entries()) {
                     assert(
                        DateUtils.isDatesEqual(
                           opts._months[halhyearIndex].quarters[quarterIndex].months[monthIndex], month
                        )
                     );
                  }
               }
            }
         });
      });


      describe('current date 2017-01-01', function () {
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
});
