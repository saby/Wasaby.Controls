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
   };

   describe('Controls/scroll:IntersectionObserverController', function() {

      describe('_registerHandler', function() {
         it('should create _observer, and observe container', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverController, options),
               instId = 'id',
               element = 'element',
               data = {};

            sandbox.stub(component, '_createObserver').returns({
               observe: sinon.fake()
            });
            component._registerHandler(null, instId, element, data);
            assert.deepEqual(component._items, { id: { instId: instId, element: element, data: data } });
            sinon.assert.calledWith(component._observer.observe, element);
            sandbox.restore();
         });
      });
      describe('_unregisterHandler', function() {
         it('should unobserve and delete element', function() {
            const
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverController, options),
               instId = 'instId',
               element = 'element';
            component._observer = {
               unobserve: sinon.fake()
            };
            component._items = {
               instId: {
                  instId: instId,
                  element: element
               }
            };
            component._unregisterHandler(null, instId);
            assert.isUndefined(component._items[instId]);
            sinon.assert.calledWith(component._observer.unobserve, element);
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
               entry = { target: element, entryData: 'data' };

            sandbox.stub(component, '_createObserver').returns({
               observe: sinon.fake()
            });
            sandbox.stub(component, '_notify');
            component._registerHandler(null, instId, element, data);
            component._intersectionObserverHandler([entry]);
            sinon.assert.calledWith(
               component._notify,
               'intersect'
            );
            sandbox.restore();
         });
      });

   });
});
