define([
   'Core/core-merge',
   'Controls/scroll',
   'ControlsUnit/Calendar/Utils'
], function(
   cMerge,
   scroll,
   calendarTestUtils
) {
   'use strict';

   const options = {
      observerName: 'observerName',
   };

   describe('Controls/scroll:IntersectionObserverController', function() {
      const event = {
         stopImmediatePropagation: function() {}
      }
      describe('_registerHandler', function() {
         it('should create _observer, and observe container', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverController, options),
               instId = 'id',
               element = 'element',
               data = {};

            component._initObserver();

            sandbox.stub(component._observer, '_createObserver').returns({
               observe: sinon.fake()
            });
            component._registerHandler(event,
                {instId: instId, observerName: options.observerName, element: element, data: data});
            assert.hasAllDeepKeys(component._observer._items, { id: { instId: instId, element: element, data: data } });
            sinon.assert.called(component._observer._createObserver);
            sandbox.restore();
         });
      });
      describe('_unregisterHandler', function() {
         it('should unobserve and delete element', function() {
            const
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverController, options),
               instId = 'instId',
               element = 'element',
               observer = {
                  unobserve: sinon.fake()
               };
            component._initObserver();
            component._observer._observers = {
               "t1_rm0px_0px_0px_0px": {
                  count: 1,
                  observer
               }
            };
            component._observer._items = {
               instId: {
                  instId: instId,
                  element: element,
                  threshold: [1],
                  rootMargin: '0px 0px 0px 0px'
               }
            };
            component._unregisterHandler(event, instId, options.observerName);
            assert.isUndefined(component._observer._items[instId]);
            sinon.assert.calledWith(observer.unobserve, element);
         });
      });

      describe('_intersectionObserverHandler', function() {
         it('should generate "intersect" event', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverController, options),
               instId = 'id',
               element = 'element',
               data = { someField: 'fieldValue' },
               entry = { target: element, entryData: 'data' },
               handler = sinon.fake();

            component._initObserver();
            sandbox.stub(component._observer, '_createObserver').returns({
               observe: sinon.fake()
            });
            sandbox.stub(component, '_notify');
            component._registerHandler(event,
                {instId: instId, observerName: options.observerName, element: element, data: data, handler: handler});
            component._observer._intersectionObserverHandler([entry]);
            sinon.assert.calledWith(
               component._notify,
               'intersect'
            );
            sinon.assert.called(handler);
            sandbox.restore();
         });

         it('should not generate "intersect" event on handle unregistered container', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverController, options),
               element = 'element',
               entry = { target: element, entryData: 'data' };

            component._initObserver();
            sandbox.stub(component._observer, '_createObserver').returns({
               observe: sinon.fake()
            });
            sandbox.stub(component, '_notify');
            component._observer._intersectionObserverHandler([entry]);
            sinon.assert.notCalled(component._notify);
            sandbox.restore();
         });
      });

   });
});
