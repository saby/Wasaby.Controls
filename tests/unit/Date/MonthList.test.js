define([
   'Core/core-merge',
   'Controls/calendar',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'unit/Calendar/Utils'
], function(
   coreMerge,
   calendar,
   DateUtil,
   calendarTestUtils
) {
   'use strict';
   let config = {
      startPosition: new Date(2018, 0, 1)
   };

   describe('Controls/_calendar/MonthList', function() {
      describe('_getMonth', function() {
         it('should return correct month', function() {
            let mv = calendarTestUtils.createComponent(calendar.MonthList, config);
            assert.isTrue(DateUtil.isDatesEqual(mv._getMonth(2018, 1), new Date(2018, 1, 1)));
         });
      });

      describe('_intersectHandler', function() {
         [{
            title: 'Should generate an event when the element appeared on top and half visible',
            entries: [{
               boundingClientRect: { top: 10, bottom: 30 },
               rootBounds: { top: 20 },
               data: new Date(2019, 0)
            }],
            options: {},
            date: new Date(2019, 0)
         }, {
            title: 'Should generate an event when the element appeared on top and the next one is half visible. viewMode: "year"',
            entries: [{
               boundingClientRect: { top: 50, bottom: 30 },
               rootBounds: { top: 60 },
               data: new Date(2019, 0),
               target: { offsetHeight: 50 }
            }],
            options: {},
            date: new Date(2020, 0)
         }, {
            title: 'Should generate an event when the element appeared on top and the next one is half visible. viewMode: "month"',
            entries: [{
               boundingClientRect: { top: 50, bottom: 30 },
               rootBounds: { top: 60 },
               data: new Date(2019, 0),
               target: { offsetHeight: 50 }
            }],
            options: { viewMode: 'month' },
            date: new Date(2019, 1)
         }].forEach(function(test) {
            it(test.title, function() {
               const
                  sandbox = sinon.createSandbox(),
                  component = calendarTestUtils.createComponent(
                     calendar.MonthList, coreMerge(test.options, config, { preferSource: true })
                  );

               sandbox.stub(component, '_notify');
               component._intersectHandler(null, test.entries);
               sinon.assert.calledWith(component._notify, 'positionChanged', [test.date]);
               sandbox.restore();
            });
         });
      });
   });
});
