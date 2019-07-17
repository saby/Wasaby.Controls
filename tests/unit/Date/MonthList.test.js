define([
   'Core/core-merge',
   'Controls/calendar',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'unit/Calendar/Utils',
   'wml!Controls/_calendar/MonthList/MonthTemplate',
   'wml!Controls/_calendar/MonthList/YearTemplate'
], function(
   coreMerge,
   calendar,
   DateUtil,
   calendarTestUtils,
   MonthTemplate,
   YearTemplate
) {
   'use strict';
   let config = {
      startPosition: new Date(2018, 0, 1)
   };

   describe('Controls/_calendar/MonthList', function() {
      describe('_beforeMount', function() {
         it('default options', function() {
            let ml = calendarTestUtils.createComponent(calendar.MonthList, config);
            assert.strictEqual(ml._itemTemplate, YearTemplate);
            assert.strictEqual(ml._scrollToPosition, config.startPosition);
            assert.strictEqual(ml._displayedPosition, config.startPosition);
            assert.strictEqual(ml._startPositionId, '2018-01-01');
         });

         it('should render by month if viewMode is equals "month"', function() {
            let ml = calendarTestUtils.createComponent(
               calendar.MonthList, coreMerge({ viewMode: 'month' }, config, { preferSource: true }));
            assert.strictEqual(ml._itemTemplate, MonthTemplate);
         });

         it('position option', function() {
            let
               position = new Date(2018, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: position });
            assert.equal(ml._scrollToPosition, position);
            assert.equal(ml._displayedPosition, position);
            assert.equal(ml._startPositionId, '2018-01-01');
         });
      });

      describe('_beforeUpdate', function() {
         it('should update position fields if position changed', function () {
            let
               sandbox = sinon.createSandbox(),
               position = new Date(2018, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });

            sandbox.stub(ml, '_findElementByDate');
            ml._container = {};

            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position }));
            assert.isTrue(DateUtil.isDatesEqual(ml._scrollToPosition, position));
            assert.isTrue(DateUtil.isDatesEqual(ml._displayedPosition, position));
            assert.equal(ml._startPositionId, '2018-01-01');
            sandbox.restore();
         });

         it('should not update _startPositionId field if item already rendered', function () {
            let
               sandbox = sinon.createSandbox(),
               position = new Date(2018, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });

            sandbox.stub(ml, '_findElementByDate').returns([true]);
            ml._container = {};

            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position }));
            assert.isTrue(DateUtil.isDatesEqual(ml._scrollToPosition, position));
            assert.isTrue(DateUtil.isDatesEqual(ml._displayedPosition, position));
            assert.equal(ml._startPositionId, '2017-01-01');
            sandbox.restore();
         });
      });

      describe('_afterUpdate, _drawItemsHandler', function() {
         [
            '_afterUpdate',
            '_drawItemsHandler'
         ].forEach(function(test) {
            it('should scroll to item after position changed', function() {
               let
                  sandbox = sinon.createSandbox(),
                  position = new Date(2018, 0, 1),
                  ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });
               sandbox.stub(ml, '_findElementByDate').returns([true]);
               ml._container = {};
               sandbox.stub(ml, '_scrollToDate');
               ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position }));
               ml[test]();
               sinon.assert.called(ml._scrollToDate);
            });
         });
      });

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
