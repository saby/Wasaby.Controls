/* global Array, Object, Date, define, beforeEach, afterEach, describe, context, it, assert */
define([
   'SBIS3.CONTROLS/ComponentBinder/DateRangeRelationController',
   'Core/Abstract',
   'Lib/Control/Control.compatible',
   'SBIS3.CONTROLS/Mixins/RangeMixin',
   'SBIS3.CONTROLS/Mixins/DateRangeMixin',
], function (DateRangeRelationController, cAbstract, Control, RangeMixin, DateRangeMixin) {
   'use strict';

   function assertDates (date1, date2, message) {
      message = message || '';
      assert(date1.equals(date2), `${message}: ${date1} not equal ${date2}`);
   }

   function assertRangeControl (control, range, message) {
      message = message || '';
      assertDates(control.getStartValue(), range[0], `${message}: startDate`);
      assertDates(control.getEndValue(), range[1], `${message}: endDate`);
   }

   let DateRangeControl = cAbstract.extend([Control, RangeMixin, DateRangeMixin], {
      $protected: {
         _options: {
         }
      },
      setShowLock: function () {},
      setLocked: function (locked) {this._locked = locked; this._notify('onLockedChanged', locked);},
      isLocked: function () {return this._locked}
   });

   describe('SBIS3.CONTROLS/ComponentBinder/DateRangeRelationController', function () {
      let controls, controller;

      this.timeout(1500000);

      let initControls = function (start, endOrStep, options, count, period, periodType) {
            var step = typeof endOrStep === 'number' ? endOrStep : null,
               period = period || step,
               end;
            if (step) {
               if (periodType === 'days') {
                  end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + period - 1);
               } else {
                  end = new Date(start.getFullYear(), start.getMonth() + period, 0);
               }
            } else {
               end = endOrStep;
            }

            options = options || {};
            controls = [];
            count = count || 5;
            for (let i = 0; i < count; i++) {
               controls.push(new DateRangeControl({startValue: start, endValue: end}));
               if (period) {
                  if (periodType === 'days') {
                     start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + step);
                     end = new Date(end.getFullYear(), end.getMonth(),  end.getDate() + step);
                  } else {
                     start = new Date(start.getFullYear(), start.getMonth() + step, 1);
                     end = new Date(end.getFullYear(), end.getMonth() + step + 1, 0);
                  }
               }
            }
            controller = new DateRangeRelationController(Object.assign({dateRanges: controls}, options));
            controller.bindDateRanges();
         },
         createMonths = function (start, step, period, count) {
            let year = start.getFullYear(),
               month = start.getMonth(),
               dates = [];
            count = count || 5;
            for (let i of Array(count).keys()) {
               dates.push([new Date(year, month + i*step, 1), new Date(year, month + i*step + period, 0)]);
            }
            return dates;
         },
         createDates = function(start, step, period, count) {
            let year = start.getFullYear(),
               month = start.getMonth(),
               date = start.getDate(),
               dates = [];
            count = count || 5;
            for (let i of Array(count).keys()) {
               dates.push([
                  new Date(year, month, date + i * step),
                  new Date(year, month, date + i * step + period - 1)
               ]);
            }
            return dates;
         },
         capacityIncreasingTest = function () {
            it('should be reset steps on capacity increasing', function () {
               controls[0]._notify('onLockedChanged', false);
               controls[0].setRange(new Date(2011, 2, 1), new Date(2011, 2, 31));
               controls[0]._notify('onLockedChanged', true);
               controls[0].setRange(new Date(2012, 0, 1), new Date(2012, 11, 31));
               let dates = createMonths(new Date(2012, 0, 1), 12, 12);
               for (let [i, control] of controls.entries()) {
                  assertRangeControl(control, dates[i], `Control ${i}`);
               }
            });
         };

      it('should generate an event on date changed', function (done) {
         initControls(new Date(2015, 0, 1), new Date(2015, 0, 31));
         controller.subscribe('onDatesChange', function () {
            done();
         });
         controls[0].setRange(new Date(2017, 0, 1), new Date(2017, 0, 31));
      });

      it(`should save steps on initialisation`, function () {
         initControls(new Date(2015, 0, 1), 4, {onlyByCapacity: true}, 2, 1);
         assert(controller._steps[0], 4);
         controls[0].setRange(new Date(2015, 1, 1), new Date(2015, 2, 0));
         let dates = [[new Date(2015, 1, 1), new Date(2015, 2, 0)], [new Date(2015, 4, 1), new Date(2015, 5, 0)]];
         for (let [i, control] of controls.entries()) {
            assertRangeControl(control, dates[i], `Control ${i}`);
         }
      });

      describe('step = null', function () {
         beforeEach(function() {
            initControls(new Date(2015, 0, 1), new Date(2015, 0, 31));
         });

         it('should not update all controls on initialisation by first one', function () {
            let dates = createMonths(new Date(2015, 0, 1), 1, 1);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
            }
         });

         capacityIncreasingTest();

         describe('updating range with same period type', function () {
            let dates = createMonths(new Date(2016, 0, 1), 1, 1);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function () {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });

         describe('updating range with other period type', function () {
            let dates = createMonths(new Date(2016, 0, 1), 3, 3);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function () {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });
      });

      describe('step = 6 months, period = 1 month', function () {
         beforeEach(function() {
            initControls(new Date(2015, 0, 1), 6, {step: 6}, null, 1);
         });

         it('should not update all controls on initialisation', function () {
            let dates = createMonths(new Date(2015, 0, 1), 6, 1);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
            }
         });

         capacityIncreasingTest();

         describe('updating range with same period type', function () {
            let dates = createMonths(new Date(2016, 0, 1), 6, 1);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function () {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });

         describe('updating range with other period type', function () {
            let dates = createMonths(new Date(2016, 0, 1), 6, 6);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function () {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });

         describe('updating range with period type less than step', function () {
            let dates = createMonths(new Date(2016, 0, 1), 6, 3);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function () {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });
         describe('updating range with period type > initial period type', function () {
            let dates = createMonths(new Date(2016, 0, 1), 12, 12);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function () {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });
      });

      describe('period = 1 month, onlyByCapacity = true', function () {
         beforeEach(function() {
            initControls(new Date(2015, 0, 1), 12, {onlyByCapacity: true});
         });

         it('should not update all controls on initialisation by first one', function () {
            let dates = createMonths(new Date(2015, 0, 1), 12, 12);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
            }
         });

         describe('updating range with other period type', function () {
            let dates = createMonths(new Date(2016, 0, 1), 6, 6);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function () {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });

         //
         // describe('updating range with other period type', function () {
         //    let dates = createMonths(new Date(2016, 0, 1), 6, 6);
         //    for (let controlNumber of dates.keys()) {
         //       it(`should be update all controls after ${controlNumber} control updated`, function () {
         //          controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
         //          for (let [i, control] of controls.entries()) {
         //             assertRangeControl(control, dates[i], `Control ${i}`);
         //          }
         //       });
         //    }
         // });
      });

      describe('period = 1 day', function () {
         beforeEach(function() {
            initControls(new Date(2015, 0, 1), 1, {onlyByCapacity: true}, 5, 1, 'days');
         });

         it('should not update all controls on initialisation by first one', function () {
            let dates = createDates(new Date(2015, 0, 1), 1, 1);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
            }
         });

         describe('updating range with other period type', function () {
            let dates = createMonths(new Date(2016, 0, 1), 6, 6);
            for (let controlNumber of dates.keys()) {
               it(`should be update all controls after ${controlNumber} control updated`, function() {
                  controls[controlNumber].setRange(dates[controlNumber][0], dates[controlNumber][1]);
                  for (let [i, control] of controls.entries()) {
                     assertRangeControl(control, dates[i], `Control ${i}`);
                  }
               });
            }
         });

         describe('updating range with same period type', function () {
            let dates = createDates(new Date(2015, 2, 1), 1, 1);
            it('should be update all controls after 0 control updated', function() {
               controls[0].setRange(dates[0][0], dates[0][1]);
               for (let [i, control] of controls.entries()) {
                  assertRangeControl(control, dates[i], `Control ${i}`);
               }
            });
         });
      });

      describe('Auto update relation type', function () {

         it(`should update relation type if period type is month and onlyByCapacity = true and checked related periods`, function () {
            initControls(new Date(2015, 0, 1), 1, {onlyByCapacity: true}, 2);
            controls[0].setLocked(false);
            controls[0].setRange(new Date(2014, 1, 1), new Date(2014, 2, 0));
            let dates = createMonths(new Date(2014, 1, 1), 12, 1);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
               assert(control.isLocked());
            }
         });
         it(`should update relation type if period type is quarter and onlyByCapacity = true and checked related periods`, function () {
            initControls(new Date(2015, 0, 1), 3, {onlyByCapacity: true}, 2);
            controls[0].setLocked(false);
            controls[0].setRange(new Date(2014, 3, 1), new Date(2014, 6, 0));
            let dates = createMonths(new Date(2014, 3, 1), 12, 3, 2);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
               assert(control.isLocked());
            }
         });
         it(`should update relation type if period type is halfyear and onlyByCapacity = true and checked related periods`, function () {
            initControls(new Date(2015, 0, 1), 6, {onlyByCapacity: true}, 2);
            controls[0].setLocked(false);
            controls[0].setRange(new Date(2014, 6, 1), new Date(2014, 12, 0));
            let dates = createMonths(new Date(2014, 6, 1), 12, 6, 2);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
               assert(control.isLocked());
            }
         });

         it(`should not update relation type if period type changed to months`, function() {
            initControls(new Date(2015, 0, 1), 12, {onlyByCapacity: true}, 2);
            controls[0].setLocked(false);
            controls[0].setRange(new Date(2013, 0, 1), new Date(2013, 1, 0));
            let dates = createMonths(new Date(2013, 0, 1), 1, 1, 2);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
               assert.isFalse(control.isLocked());
            }
         });

         it(`should update relation type if period type is year and onlyByCapacity = true and checked smaller period`, function () {
            initControls(new Date(2015, 0, 1), 12, {onlyByCapacity: true, step: 12}, 2);
            controls[0].setLocked(false);
            controls[0].setRange(new Date(2013, 0, 1), new Date(2013, 1, 0));
            let dates = createMonths(new Date(2013, 0, 1), 1, 1, 2);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
               assert.isFalse(control.isLocked());
            }
         });

         it(`should not update relation type if period type and year does not changed `, function () {
            initControls(new Date(2015, 2, 1), 1, {onlyByCapacity: true}, 2);
            controls[0].setLocked(false);
            controls[0].setRange(new Date(2015, 0, 1), new Date(2015, 1, 0));
            let dates = createMonths(new Date(2015, 0, 1), 3, 1, 2);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
               assert(!control.isLocked());
            }
         });

         it(`should not update relation type if period type is year and onlyByCapacity = true and checked related periods`, function () {
            initControls(new Date(2015, 0, 1), 12, {onlyByCapacity: true}, 2);
            controls[0].setLocked(false);
            controls[0].setRange(new Date(2013, 0, 1), new Date(2013, 12, 0));
            let dates = createMonths(new Date(2013, 0, 1), 36, 12, 2);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
               assert(control.isLocked());
            }
         });
      });

      describe('shift periods', function () {
         [[
            '1 day',
            [new Date(2015, 0, 1), 1, { onlyByCapacity: true }, 5, 1, 'days'],
            createDates(new Date(2014, 11, 31), 1, 1)
         ], [
            '1 year',
            [new Date(2015, 0, 1), 12, {onlyByCapacity: true}],
            createMonths(new Date(2014, 0, 1), 12, 12)
         ]].forEach(function(test) {
            it(`period ${test[0]}, shift prev`, function () {
               initControls.apply(null, test[1]);
               controller.shiftPrev();
               for (let [i, control] of controls.entries()) {
                  assertRangeControl(control, test[2][i], `Control ${i}`);
               }
            });
         });

         [[
            '1 day',
            [new Date(2015, 0, 1), 1, {onlyByCapacity: true}, 5, 1, 'days'],
            createDates(new Date(2015, 0, 2), 1, 1)
         ], [
            '1 year',
            [new Date(2015, 0, 1), 12, {onlyByCapacity: true}],
            createMonths(new Date(2016, 0, 1), 12, 12)
         ]].forEach(function(test) {
            it('period 1 day, shift next', function () {
               initControls.apply(null, test[1]);
               controller.shiftNext();
               for (let [i, control] of controls.entries()) {
                  assertRangeControl(control, test[2][i], `Control ${i}`);
               }
            });
         });

      });
   });
});
