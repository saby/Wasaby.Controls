/* global Array, Object, Date, define, beforeEach, afterEach, describe, context, it, assert */
define([
   'Core/core-clone',
   'Controls/dateRange',
   'unit/Calendar/Utils'
], function(
   cClone,
   dateRange,
   calendarTestUtils
) {
   'use strict';

   const RelationController = dateRange.RelationController;

   describe('Controls.dateRange:RelationController', function() {

      let createMonths = function(start, step, period, count) {
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
         getOptions = function(start, endOrStep, options, count, period, periodType) {
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
            count = count || 5;
            for (let i = 0; i < count; i++) {
               options['startValue' + i] = start;
               options['endValue' + i] = end;
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
            return options;
         },
         beforeUpdateTestCase = function(componentOptions, dates) {
            for (let controlNumber of dates.keys()) {
               it(`should update all controls after ${controlNumber} control updated`, function() {
                  let
                     options = getOptions.apply(null, componentOptions),
                     component = calendarTestUtils.createComponent(RelationController, options);
                  options = cClone(options);
                  options['startValue' + controlNumber] = dates[controlNumber][0];
                  options['endValue' + controlNumber] = dates[controlNumber][1];
                  component._beforeUpdate(options);
                  for (let [i, range] of component._model.ranges.entries()) {
                     assert.deepEqual(range, dates[i]);
                  }
               });
            }
         },
         testCase = function(componentOptions, dates) {
            for (let controlNumber of dates.keys()) {
               it(`should update all controls after ${controlNumber} control updated`, function() {
                  let
                     options = getOptions.apply(null, componentOptions),
                     component = calendarTestUtils.createComponent(RelationController, options);
                  component._onRelationWrapperRangeChanged(null, dates[controlNumber][0], dates[controlNumber][1], controlNumber);
                  for (let [i, range] of component._model.ranges.entries()) {
                     assert.deepEqual(range, dates[i]);
                  }
               });
            }
         };

      it('should generate an event on date changed', function () {
         let
            options = getOptions(new Date(2015, 0, 1), new Date(2015, 0, 31)),
            component = calendarTestUtils.createComponent(RelationController, options),
            sandbox = sinon.sandbox.create();

         sandbox.stub(component, '_notify');
         options = cClone(options);
         options.startValue0 = new Date(2016, 0, 1);
         options.endValue0 = new Date(2016, 0, 1);
         component._beforeUpdate(options);
         sinon.assert.calledWith(component._notify, 'periodsChanged');
         sandbox.restore();
      });

      it('should save steps on initialisation', function () {
         let
            options = getOptions(new Date(2015, 0, 1), 4, {bindType: 'byCapacity'}, 2, 1),
            component = calendarTestUtils.createComponent(RelationController, options);
         assert.strictEqual(component._model._steps[0], 4);
      });

      describe('step = null', function () {
         describe('updating range with same period type', function () {
            testCase([new Date(2017, 0, 1), 1, {}, 5, 1], createMonths(new Date(2016, 0, 1), 1, 1));
         });
         describe('updating range with other period type', function () {
            testCase([new Date(2017, 0, 1), 1, {}, 5, 1], createMonths(new Date(2016, 0, 1), 1, 1));
         });
      });

      describe('step = 6 months, period = 1 month', function () {
         describe('updating range with same period type', function () {
            testCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 6, 1));
         });
         describe('updating range with other period type', function () {
            testCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 6, 6));
         });
         describe('updating range with period type less than step', function () {
            testCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 6, 3));
         });
         describe('updating range with period type > initial period type', function () {
            testCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 12));
         });
      });

      describe('step = 12 months, period = 1 month', function () {
         describe('updating range with same period type', function () {
            testCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 1));
         });
         describe('updating range with other period type', function () {
            testCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 6));
         });
         describe('updating range with period type less than step', function () {
            testCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 3));
         });
      });

      describe('step = 12 months, period = 1 year', function () {
         describe('updating range with same period type', function () {
            testCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 12));
         });
         describe('updating range with other period type', function () {
            testCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 6));
         });
      });

      describe('period = 1 month, onlyByCapacity = true', function () {
         describe('updating range with other period type', function () {
            testCase([new Date(2017, 0, 1), 6, { bindType: 'byCapacity' }, 5, 1], createMonths(new Date(2016, 0, 1), 6, 6));
         });
      });

      describe('period = 1 day', function () {
         describe('updating range with other period type', function () {
            testCase([new Date(2017, 0, 1), 1, { bindType: 'byCapacity' }, 5, 1, 'days'], createMonths(new Date(2016, 0, 1), 6, 6));
         });
      });

      describe('Auto update relation type', function() {
         [{
            title: 'should update relation type if period type is month and onlyByCapacity = true and checked related periods',
            componentOptions: [new Date(2015, 0, 1), 1, { bindType: 'byCapacity' }, 2],
            updateToRange: [new Date(2014, 1, 1), new Date(2014, 2, 0)],
            updatedRangesOptions: [new Date(2014, 1, 1), 12, 1],
            bindTypeTest: true
         }, {
            title: 'should update relation type if period type is quarter and onlyByCapacity = true and checked related periods',
            componentOptions: [new Date(2015, 0, 1), 3, { bindType: 'byCapacity' }, 2],
            updateToRange: [new Date(2014, 3, 1), new Date(2014, 6, 0)],
            updatedRangesOptions: [new Date(2014, 3, 1), 12, 3, 2],
            bindTypeTest: true
         }, {
            title: 'should update relation type if period type is halfyear and onlyByCapacity = true and checked related periods',
            componentOptions: [new Date(2015, 0, 1), 6, { bindType: 'byCapacity' }, 2],
            updateToRange: [new Date(2014, 6, 1), new Date(2014, 12, 0)],
            updatedRangesOptions: [new Date(2014, 6, 1), 12, 6, 2],
            bindTypeTest: true
         }, {
            title: 'should not update relation type if period type changed to months',
            componentOptions: [new Date(2015, 0, 1), 12, { bindType: 'byCapacity' }, 2],
            updateToRange: [new Date(2013, 0, 1), new Date(2013, 1, 0)],
            updatedRangesOptions: [new Date(2013, 0, 1), 1, 1, 2],
            bindTypeTest: false
         }, {
            title: 'should not update relation type if period type and year does not changed',
            componentOptions: [new Date(2015, 2, 1), 1, { bindType: 'byCapacity' }, 2],
            updateToRange: [new Date(2015, 0, 1), new Date(2015, 1, 0)],
            updatedRangesOptions: [new Date(2015, 0, 1), 3, 1, 2],
            bindTypeTest: false
         }, {
            title: 'should not update relation type if period type is year and onlyByCapacity = true and checked related periods',
            componentOptions: [new Date(2015, 0, 1), 12, { bindType: 'byCapacity' }, 2],
            updateToRange: [new Date(2013, 0, 1), new Date(2013, 12, 0)],
            updatedRangesOptions: [new Date(2013, 0, 1), 36, 12, 2],
            bindTypeTest: true
         }].forEach(function(test) {
            it(test.title, function() {
               let
                  options = getOptions.apply(null, test.componentOptions),
                  component = calendarTestUtils.createComponent(RelationController, options),
                  sandbox = sinon.sandbox.create();
               sandbox.stub(component, '_notify');
               component._onRelationWrapperRangeChanged(null, test.updateToRange[0], test.updateToRange[1], 0);
               let dates = createMonths.apply(null, test.updatedRangesOptions);
               for (let [i, range] of component._model.ranges.entries()) {
                  assert.deepEqual(range, dates[i]);
               }
               if (test.bindTypeTest) {
                  sinon.assert.calledWith(component._notify, 'bindTypeChanged', ['normal']);
               } else {
                  assert.isFalse(component._notify.calledWith('bindTypeChanged', ['normal']));
               }
               sandbox.restore();
            });
         });
      });

      describe('old api', function() {
         describe('step = null', function () {
            describe('updating range with same period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 1, {}, 5, 1], createMonths(new Date(2016, 0, 1), 1, 1));
            });
            describe('updating range with other period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 1, {}, 5, 1], createMonths(new Date(2016, 0, 1), 1, 1));
            });
         });

         describe('step = 6 months, period = 1 month', function () {
            describe('updating range with same period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 6, 1));
            });
            describe('updating range with other period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 6, 6));
            });
            describe('updating range with period type less than step', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 6, 3));
            });
            describe('updating range with period type > initial period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 6, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 12));
            });
         });

         describe('step = 12 months, period = 1 month', function () {
            describe('updating range with same period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 1));
            });
            describe('updating range with other period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 6));
            });
            describe('updating range with period type less than step', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 3));
            });
         });

         describe('step = 12 months, period = 1 year', function () {
            describe('updating range with same period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 12));
            });
            describe('updating range with other period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 12, {}, 5, 1], createMonths(new Date(2016, 0, 1), 12, 6));
            });
         });

         describe('period = 1 month, onlyByCapacity = true', function () {
            describe('updating range with other period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 6, { bindType: 'byCapacity' }, 5, 1], createMonths(new Date(2016, 0, 1), 6, 6));
            });
         });

         describe('period = 1 day', function () {
            describe('updating range with other period type', function () {
               beforeUpdateTestCase([new Date(2017, 0, 1), 1, { bindType: 'byCapacity' }, 5, 1, 'days'], createMonths(new Date(2016, 0, 1), 6, 6));
            });
         });

         describe('Auto update relation type', function() {
            [{
               title: 'should update relation type if period type is month and onlyByCapacity = true and checked related periods',
               componentOptions: [new Date(2015, 0, 1), 1, { bindType: 'byCapacity' }, 2],
               updateToRange: [new Date(2014, 1, 1), new Date(2014, 2, 0)],
               updatedRangesOptions: [new Date(2014, 1, 1), 12, 1],
               bindTypeTest: true
            }, {
               title: 'should update relation type if period type is quarter and onlyByCapacity = true and checked related periods',
               componentOptions: [new Date(2015, 0, 1), 3, { bindType: 'byCapacity' }, 2],
               updateToRange: [new Date(2014, 3, 1), new Date(2014, 6, 0)],
               updatedRangesOptions: [new Date(2014, 3, 1), 12, 3, 2],
               bindTypeTest: true
            }, {
               title: 'should update relation type if period type is halfyear and onlyByCapacity = true and checked related periods',
               componentOptions: [new Date(2015, 0, 1), 6, { bindType: 'byCapacity' }, 2],
               updateToRange: [new Date(2014, 6, 1), new Date(2014, 12, 0)],
               updatedRangesOptions: [new Date(2014, 6, 1), 12, 6, 2],
               bindTypeTest: true
            }, {
               title: 'should not update relation type if period type changed to months',
               componentOptions: [new Date(2015, 0, 1), 12, { bindType: 'byCapacity' }, 2],
               updateToRange: [new Date(2013, 0, 1), new Date(2013, 1, 0)],
               updatedRangesOptions: [new Date(2013, 0, 1), 1, 1, 2],
               bindTypeTest: false
            }, {
               title: 'should not update relation type if period type and year does not changed',
               componentOptions: [new Date(2015, 2, 1), 1, { bindType: 'byCapacity' }, 2],
               updateToRange: [new Date(2015, 0, 1), new Date(2015, 1, 0)],
               updatedRangesOptions: [new Date(2015, 0, 1), 3, 1, 2],
               bindTypeTest: false
            }, {
               title: 'should not update relation type if period type is year and onlyByCapacity = true and checked related periods',
               componentOptions: [new Date(2015, 0, 1), 12, { bindType: 'byCapacity' }, 2],
               updateToRange: [new Date(2013, 0, 1), new Date(2013, 12, 0)],
               updatedRangesOptions: [new Date(2013, 0, 1), 36, 12, 2],
               bindTypeTest: true
            }].forEach(function(test) {
               it(test.title, function() {
                  let
                     options = getOptions.apply(null, test.componentOptions),
                     component = calendarTestUtils.createComponent(RelationController, options),
                     sandbox = sinon.sandbox.create();
                  sandbox.stub(component, '_notify');
                  options = cClone(options);
                  options.startValue0 = test.updateToRange[0];
                  options.endValue0 = test.updateToRange[1];
                  component._beforeUpdate(options);
                  let dates = createMonths.apply(null, test.updatedRangesOptions);
                  for (let [i, range] of component._model.ranges.entries()) {
                     assert.deepEqual(range, dates[i]);
                  }
                  if (test.bindTypeTest) {
                     sinon.assert.calledWith(component._notify, 'bindTypeChanged', ['normal']);
                  } else {
                     assert.isFalse(component._notify.calledWith('bindTypeChanged', ['normal']));
                  }
                  sandbox.restore();
               });
            });
         });
      })

      describe('The type of relation sets by control.', function() {
         describe('Relation type is byCapacity.', function() {
            [{
               componentOptions: [new Date(2015, 0, 1), 1, {}, 2],
               updateToRange: [new Date(2014, 1, 1), new Date(2014, 2, 0)],
               updatedRangesOptions: [new Date(2014, 1, 1), 12, 1, 2],
               relationType: 'byCapacity'
            }, {
               componentOptions: [new Date(2015, 0, 1), 3, {}, 2],
               updateToRange: [new Date(2014, 3, 1), new Date(2014, 6, 0)],
               updatedRangesOptions: [new Date(2014, 3, 1), 12, 3, 2],
               relationType: 'byCapacity'
            }, {
               componentOptions: [new Date(2015, 0, 1), 6, {}, 2],
               updateToRange: [new Date(2014, 6, 1), new Date(2014, 12, 0)],
               updatedRangesOptions: [new Date(2014, 6, 1), 12, 6, 2],
               relationType: 'byCapacity'
            }, {
               componentOptions: [new Date(2015, 0, 1), 12, {}, 2],
               updateToRange: [new Date(2013, 0, 1), new Date(2013, 1, 0)],
               updatedRangesOptions: [new Date(2013, 0, 1), 1, 1, 2],
               relationType: 'byCapacity'
            }, {
               componentOptions: [new Date(2015, 2, 1), 1, {}, 2],
               updateToRange: [new Date(2015, 0, 1), new Date(2015, 1, 0)],
               updatedRangesOptions: [new Date(2015, 0, 1), 3, 1, 2],
               relationType: 'byCapacity'
            }, {
               componentOptions: [new Date(2015, 0, 1), 12, {}, 2],
               updateToRange: [new Date(2013, 0, 1), new Date(2013, 12, 0)],
               updatedRangesOptions: [new Date(2013, 0, 1), 36, 12, 2],
               relationType: 'byCapacity'
            }, {
               componentOptions: [new Date(2015, 0, 1), 1, {}, 2],
               updateToRange: [new Date(2014, 1, 1), new Date(2014, 2, 0)],
               updatedRangesOptions: [new Date(2014, 1, 1), 1, 1, 2],
               relationType: 'normal'
            }, {
               componentOptions: [new Date(2015, 0, 1), 3, {}, 2],
               updateToRange: [new Date(2014, 3, 1), new Date(2014, 6, 0)],
               updatedRangesOptions: [new Date(2014, 3, 1), 3, 3, 2],
               relationType: 'normal'
            }, {
               componentOptions: [new Date(2015, 0, 1), 6, {}, 2],
               updateToRange: [new Date(2014, 6, 1), new Date(2014, 12, 0)],
               updatedRangesOptions: [new Date(2014, 6, 1), 6, 6, 2],
               relationType: 'normal'
            }, {
               componentOptions: [new Date(2015, 0, 1), 12, {}, 2],
               updateToRange: [new Date(2013, 0, 1), new Date(2013, 1, 0)],
               updatedRangesOptions: [new Date(2013, 0, 1), 12, 1, 2],
               relationType: 'normal'
            }, {
               componentOptions: [new Date(2015, 2, 1), 1, {}, 2],
               updateToRange: [new Date(2015, 0, 1), new Date(2015, 1, 0)],
               updatedRangesOptions: [new Date(2015, 0, 1), 1, 1, 2],
               relationType: 'normal'
            }, {
               componentOptions: [new Date(2015, 0, 1), 12, {}, 2],
               updateToRange: [new Date(2013, 0, 1), new Date(2013, 12, 0)],
               updatedRangesOptions: [new Date(2013, 0, 1), 12, 12, 2],
               relationType: 'normal'
            }].forEach(function(test, testNumber) {
               it(`Test ${testNumber}`, function() {
                  let
                     options = getOptions.apply(null, test.componentOptions),
                     component = calendarTestUtils.createComponent(RelationController, options),
                     sandbox = sinon.sandbox.create();
                  sandbox.stub(component, '_notify');
                  component._onRelationWrapperRangeChanged(null, test.updateToRange[0], test.updateToRange[1], 0, test.relationType);
                  let dates = createMonths.apply(null, test.updatedRangesOptions);
                  for (let [i, range] of component._model.ranges.entries()) {
                     assert.deepEqual(range, dates[i]);
                  }
                  sandbox.restore();
               });
            });
         });
      });

      describe('shift periods', function() {
         [{
            period: '1 day',
            args: [new Date(2015, 0, 1), 1, { bindType: 'byCapacity' }, 5, 1, 'days'],
            dates: createDates(new Date(2014, 11, 31), 1, 1),
            method: 'shiftBackward'
         }, {
            period: '1 year',
            args: [new Date(2015, 0, 1), 12, { bindType: 'byCapacity' }],
            dates: createMonths(new Date(2014, 0, 1), 12, 12),
            method: 'shiftBackward'
         }, {
            period: '1 day',
            args: [new Date(2015, 0, 1), 1, { bindType: 'byCapacity' }, 5, 1, 'days'],
            dates: createDates(new Date(2015, 0, 2), 1, 1),
            method: 'shiftForward'
         }, {
            period: '1 year',
            args: [new Date(2015, 0, 1), 12, { bindType: 'byCapacity' }],
            dates: createMonths(new Date(2016, 0, 1), 12, 12),
            method: 'shiftForward'
         }].forEach(function(test) {
            it(`period ${test[0]}, shift prev`, function() {
               let
                  options = getOptions.apply(null, test.args),
                  component = calendarTestUtils.createComponent(RelationController, options);
               component[test.method]();
               for (let [i, range] of component._model.ranges.entries()) {
                  assert.deepEqual(range, test.dates[i]);
               }
            });
         });
      });

   });
});
