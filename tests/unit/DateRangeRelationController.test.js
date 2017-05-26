/* global Array, Object, Date, define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.DateRangeRelationController',
   'Core/Abstract',
   'js!SBIS3.CONTROLS.RangeMixin',
   'js!SBIS3.CONTROLS.DateRangeMixin',
], function (DateRangeRelationController, cAbstract, RangeMixin, DateRangeMixin) {
   'use strict';

   function assertDates (date1, date2, message) {
      assert(date1.equals(date2), `${message}: ${date1} not equal ${date2}`);
   }

   function assertRangeControl (control, range, message) {
      assertDates(control.getStartValue(), range[0], `${message}: startDate`);
      assertDates(control.getEndValue(), range[1], `${message}: endDate`);
   }

   let DateRangeControl = cAbstract.extend([RangeMixin, DateRangeMixin], {
      $protected: {
         _options: {
         }
      },
      _notifyOnPropertyChanged: function () {},
      setShowLock: function () {}
   });

   describe('SBIS3.CONTROLS.DateRangeRelationController', function () {
      let controls, controller;

      // this.timeout(1500000);

      let initControls = function (start, endOrStep, options) {
            var step = typeof endOrStep === 'number' ? endOrStep : null,
               end = step ? new Date(start.getFullYear(), start.getMonth() + step, 0): endOrStep;
            options = options || {};
            controls = [];
            for (let i = 0; i < 5; i++) {
               controls.push(new DateRangeControl({startValue: start, endValue: end}));
               if (step) {
                  start = new Date(start.getFullYear(), start.getMonth() + step, 1);
                  end = new Date(end.getFullYear(), end.getMonth() + step + 1, 0);
               }
            }
            controller = new DateRangeRelationController(Object.assign({dateRanges: controls}, options));
            controller.bindDateRanges();
         },
         createDates = function (start, step, period) {
            let year = start.getFullYear(),
               month = start.getMonth(),
               dates = [];
            for (let i of Array(5).keys()) {
               dates.push([new Date(year, month + i*step, 1), new Date(year, month + i*step + period, 0)])
            }
            return dates;
         };

      it('should generate an event on date changed', function (done) {
         initControls(new Date(2015, 0, 1), new Date(2015, 0, 31));
         controller.subscribe('onDatesChange', function () {
            done();
         });
         controls[0].setRange(new Date(2017, 0, 1), new Date(2017, 0, 31));
      });

      describe('step = null', function () {
         beforeEach(function() {
            initControls(new Date(2015, 0, 1), new Date(2015, 0, 31));
         });

         it('should be update all controls on initialisation by first one', function () {
            let dates = createDates(new Date(2015, 0, 1), 1, 1);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
            }
         });

         describe('updating range with same period type', function () {
            let dates = createDates(new Date(2016, 0, 1), 1, 1);
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
            let dates = createDates(new Date(2016, 0, 1), 3, 3);
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

      describe('step = 6, period = 1', function () {
         beforeEach(function() {
            initControls(new Date(2015, 0, 1), new Date(2015, 0, 31), {step: 6});
         });

         it('should be update all controls on initialisation by first one', function () {
            let dates = createDates(new Date(2015, 0, 1), 6, 1);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
            }
         });

         describe('updating range with same period type', function () {
            let dates = createDates(new Date(2016, 0, 1), 6, 1);
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
            let dates = createDates(new Date(2016, 0, 1), 6, 6);
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
            let dates = createDates(new Date(2016, 0, 1), 6, 3);
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
            let dates = createDates(new Date(2016, 0, 1), 12, 12);
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

      describe('period = 1, onlyByCapacity = true', function () {
         beforeEach(function() {
            initControls(new Date(2015, 0, 1), 12, {onlyByCapacity: true});
         });

         it('should be update all controls on initialisation by first one', function () {
            let dates = createDates(new Date(2015, 0, 1), 12, 12);
            for (let [i, control] of controls.entries()) {
               assertRangeControl(control, dates[i], `Control ${i}`);
            }
         });

         describe('updating range with other period type', function () {
            let dates = createDates(new Date(2016, 0, 1), 6, 6);
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
         //    let dates = createDates(new Date(2016, 0, 1), 6, 6);
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
   });
});
