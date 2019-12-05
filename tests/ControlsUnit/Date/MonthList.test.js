define([
   'Core/core-merge',
   'Types/collection',
   'Controls/calendar',
   'SBIS3.CONTROLS/Utils/DateUtil',
   'ControlsUnit/Calendar/Utils',
   'Controls/_calendar/MonthList/ItemTypes',
   'wml!Controls/_calendar/MonthList/MonthTemplate',
   'wml!Controls/_calendar/MonthList/YearTemplate'
], function(
   coreMerge,
   collection,
   calendar,
   DateUtil,
   calendarTestUtils,
   ItemTypes,
   MonthTemplate,
   YearTemplate
) {
   'use strict';
   let config = {
      startPosition: new Date(2018, 0, 1)
   };

   ItemTypes = ItemTypes.default;

   describe('Controls/_calendar/MonthList', function() {
      describe('_beforeMount', function() {
         it('default options', function() {
            let ml = calendarTestUtils.createComponent(calendar.MonthList, config);
            assert.strictEqual(ml._itemTemplate, YearTemplate);
            assert.strictEqual(ml._positionToScroll, config.startPosition);
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
            assert.equal(ml._positionToScroll, position);
            assert.equal(ml._displayedPosition, position);
            assert.equal(ml._startPositionId, '2018-01-01');
         });

         it('should initialize _extDataLastVersion if source option passed', function() {
            let
               sandbox = sinon.createSandbox(),
               control = calendarTestUtils.createComponent(
               calendar.MonthList, coreMerge({ source: {} }, config, { preferSource: true }));
            sandbox.stub(control, '_enrichItemsDebounced');
            assert.strictEqual(control._extDataLastVersion, control._extData.getVersion());
            sandbox.restore();
         });
      });

      describe('_afterMount', function() {
         it('should set setShadowMode', function() {
            let
               sandbox = sinon.createSandbox(),
               control = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });

            control._children = {
               scroll: {
                  setShadowMode: sinon.fake()
               }
            };
            sandbox.stub(control, '_canScroll').returns([true]);
            sandbox.stub(control, '_scrollToDate');
            control._afterMount();
            sinon.assert.called(control._children.scroll.setShadowMode);
            sinon.assert.called(control._scrollToDate);
            sandbox.restore();
         });
      });

      describe('_beforeUpdate', function() {
         it('should update position fields if position changed', function () {
            let
               sandbox = sinon.createSandbox(),
               position = new Date(2018, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });

            sandbox.stub(ml, '_canScroll');
            ml._children.months = { reload: sinon.fake() };
            ml._container = {};
            ml._displayedDates = [1, 2];

            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position }));
            assert.isTrue(DateUtil.isDatesEqual(ml._positionToScroll, position));
            assert.strictEqual(ml._displayedPosition, position);
            assert.equal(ml._startPositionId, '2018-01-01');
            assert.isEmpty(ml._displayedDates);
            sinon.assert.called(ml._children.months.reload);
            sandbox.restore();
         });

         it('should not update _startPositionId field if item already rendered', function () {
            let
               sandbox = sinon.createSandbox(),
               position = new Date(2018, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });

            sandbox.stub(ml, '_canScroll').returns([true]);
            sandbox.stub(ml, '_findElementByDate').returns([true]);
            ml._children.months = { reload: sinon.fake() };
            ml._container = {};

            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position }));
            assert.isNull(ml._positionToScroll);
            assert.strictEqual(ml._displayedPosition, position);
            assert.equal(ml._startPositionId, '2017-01-01');
            sinon.assert.notCalled(ml._children.months.reload);
            sandbox.restore();
         });

         it('should not update the position before the list is updated', function () {
            let
               sandbox = sinon.createSandbox(),
               position1 = new Date(2018, 0, 1),
               position2 = new Date(2019, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });

            sandbox.stub(ml, '_canScroll').returns(false);
            sandbox.stub(ml, '_findElementByDate').returns(null);
            ml._children.months = { reload: sinon.fake() };
            ml._container = {};

            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position1 }));
            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position2 }));
            assert.strictEqual(+ml._positionToScroll, +position1);
            assert.strictEqual(ml._displayedPosition, position1);
            assert.strictEqual(ml._lastPositionFromOptions, position2);
            assert.equal(ml._startPositionId, '2018-01-01');
            sinon.assert.calledOnce(ml._children.months.reload);
            sandbox.restore();
         });

         it('should scroll to position immediately without changing position if item already rendered', function () {
            let
               sandbox = sinon.createSandbox(),
               position1 = new Date(2018, 0, 1),
               position2 = new Date(2019, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });

            sandbox.stub(ml, '_canScroll').returns(true);
            sandbox.stub(ml, '_findElementByDate').returns(null);
            ml._children.months = { reload: sinon.fake() };
            ml._container = {};

            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position1 }));
            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position2 }));
            assert.strictEqual(+ml._positionToScroll, +position1);
            assert.strictEqual(ml._displayedPosition, position1);
            assert.strictEqual(ml._lastPositionFromOptions, position2);
            assert.equal(ml._startPositionId, '2017-01-01');
            sinon.assert.notCalled(ml._children.months.reload);
            sandbox.restore();
         });

      });

      describe('_afterUpdate', function() {
         it('should notify \'enrichItems\' event if model has been changed', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(
                  calendar.MonthList, coreMerge({ source: {} }, config, { preferSource: true }));

            sandbox.stub(component, '_notify');
            sandbox.stub(component, '_enrichItemsDebounced');
            component._extData._nextVersion();
            component._afterUpdate();
            sinon.assert.calledWith(component._notify, 'enrichItems');
            sandbox.restore();
         });

         it('should\'t notify "enrichItems" event if model has\'t been changed', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(
                  calendar.MonthList, coreMerge({ source: {} }, config, { preferSource: true }));

            sandbox.stub(component, '_notify');
            sandbox.stub(component, '_enrichItemsDebounced');
            component._afterUpdate();
            sinon.assert.notCalled(component._notify);
            sandbox.restore();
         });
      });


      describe('_afterRender, _drawItemsHandler', function() {
         [
            '_afterRender',
            '_drawItemsHandler'
         ].forEach(function(test) {
            it('should scroll to item after position changed', function() {
               let
                  sandbox = sinon.createSandbox(),
                  position = new Date(2018, 0, 1),
                  ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });
               sandbox.stub(ml, '_canScroll').returns([true]);
               ml._container = {};
               sandbox.stub(ml, '_scrollToDate');
               ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position }));
               ml[test]();
               sinon.assert.called(ml._scrollToDate);
               sandbox.restore();
            });
         });
      });

      describe('_drawItemsHandler', function() {
         it('should set the position if the _beforeUpdate function has been called several times', function() {
            let
               sandbox = sinon.createSandbox(),
               position1 = new Date(2018, 0, 1),
               position2 = new Date(2019, 0, 1),
               ml = calendarTestUtils.createComponent(calendar.MonthList, { position: new Date(2017, 2, 3) });
            sandbox.stub(ml, '_canScroll').returns([true]);
            ml._container = {};
            sandbox.stub(ml, '_scrollToPosition');
            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position1 }));
            ml._beforeUpdate(calendarTestUtils.prepareOptions(calendar.MonthList, { position: position2 }));
            ml._drawItemsHandler();
            assert.strictEqual(ml._displayedPosition, position2);
            sinon.assert.called(ml._scrollToPosition);
            sandbox.restore();
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
               nativeEntry: {
                  boundingClientRect: { top: 10, bottom: 30 },
                  rootBounds: { top: 20 }
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.body
               }
            }],
            options: {},
            date: new Date(2019, 0)
         }, {
            title: 'Should generate an event when the element appeared on top and the next one is half visible. viewMode: "year"',
            entries: [{
               nativeEntry: {
                  boundingClientRect: { top: 50, bottom: 30 },
                  rootBounds: { top: 60 },
                  target: { offsetHeight: 50 }
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.body
               }
            }],
            options: {},
            date: new Date(2020, 0)
         }, {
            title: 'Should generate an event when the element appeared on top and the next one is half visible. viewMode: "month"',
            entries: [{
               nativeEntry: {
                  boundingClientRect: { top: 50, bottom: 30 },
                  rootBounds: { top: 60 },
                  target: { offsetHeight: 50 }
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.body
               }
            }],
            options: { viewMode: 'month' },
            date: new Date(2019, 1)
         }, {
            title: 'Should generate an event when the 2 elements appeared on top and the next one is half visible. viewMode: "month"',
            entries: [{
               nativeEntry: {
                  boundingClientRect: { top: 0, bottom: 30 },
                  rootBounds: { top: 55 },
                  target: { offsetHeight: 30 }
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.body
               }
            }, {
               nativeEntry: {
                  boundingClientRect: { top: 30, bottom: 50 },
                  rootBounds: { top: 55 },
                  target: { offsetHeight: 20 }
               },
               data: {
                  date: new Date(2019, 1),
                  type: ItemTypes.body
               }
            }],
            options: { viewMode: 'month' },
            date: new Date(2019, 2)
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

         [{
            title: 'Should add date to displayed dates.',
            entries: [{
               nativeEntry: {
                  boundingClientRect: { top: 10, bottom: 30 },
                  rootBounds: { top: 20 },
                  isIntersecting: true
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.body
               }
            }],
            displayedDates: [],
            options: { source: {} },
            resultDisplayedDates: [(new Date(2019, 0)).getTime()],
            date: new Date(2019, 0)
         }, {
            title: 'Should\'t add date to displayed dates if header item is has been shown.',
            entries: [{
               nativeEntry: {
                  boundingClientRect: { top: 10, bottom: 30 },
                  rootBounds: { top: 20 },
                  isIntersecting: true
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.header
               }
            }],
            displayedDates: [],
            options: { source: {} },
            resultDisplayedDates: [],
            date: new Date(2019, 0)
         }, {
            title: 'Should remove date from displayed dates.',
            entries: [{
               nativeEntry: {
                  boundingClientRect: { top: 10, bottom: 30 },
                  rootBounds: { top: 20 },
                  isIntersecting: false
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.body
               }
            }],
            displayedDates: [(new Date(2019, 0)).getTime(), 123],
            options: { source: {} },
            resultDisplayedDates: [123],
            date: new Date(2019, 0)
         }, {
            title: 'Should\'t remove date from displayed dates if header item is has been hidden.',
            entries: [{
               nativeEntry: {
                  boundingClientRect: { top: 10, bottom: 30 },
                  rootBounds: { top: 20 },
                  isIntersecting: false
               },
               data: {
                  date: new Date(2019, 0),
                  type: ItemTypes.header
               }
            }],
            displayedDates: [(new Date(2019, 0)).getTime(), 123],
            options: { source: {} },
            resultDisplayedDates: [(new Date(2019, 0)).getTime(), 123],
            date: new Date(2019, 0)
         }].forEach(function(test) {
            it(test.title, function() {
               const
                  sandbox = sinon.createSandbox(),
                  component = calendarTestUtils.createComponent(
                     calendar.MonthList, coreMerge(test.options, config, { preferSource: true })
                  );

               sandbox.stub(component, '_enrichItemsDebounced');
               component._displayedDates = test.displayedDates;
               component._intersectHandler(null, test.entries);
               assert.deepEqual(component._displayedDates, test.resultDisplayedDates);
               sandbox.restore();
            });
         });
      });

      describe('_canScroll', function() {
         [{
            title: 'should scroll if viewMode === \'year\' and period is not the first month of the year',
            options: { viewMode: 'year' },
            date: new Date(2018, 3, 1),
            result: true
         }].forEach(function(test) {
            it(test.title, function () {
               let
                  sandbox = sinon.createSandbox(),
                  control = calendarTestUtils.createComponent(
                     calendar.MonthList, coreMerge(test.options, config, { preferSource: true })),
                  result;

               sandbox.stub(control, '_findElementByDate').returns({});
               result = control._canScroll(test.date);
               if (test.result) {
                  assert.isTrue(result);
               } else {
                  assert.isFalse(result);
               }
               sandbox.restore();
            });
         });
      });
   });
});
