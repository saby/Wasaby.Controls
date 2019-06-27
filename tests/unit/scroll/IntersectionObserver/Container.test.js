define([
   'Core/core-merge',
   'Controls/scroll',
   'unit/Calendar/Utils'
], function(
   cMerge,
   scroll,
   calendarTestUtils
) {
   'use strict';

   const options = {
      data: 'some data'
   };

   describe('Controls/scroll:IntersectionObserverContainer', function() {

      describe('_afterMount', function() {
         it('should notify intersectionObserverRegister event', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverContainer, options);

            sandbox.stub(component, '_notify');
            component._afterMount();
            sinon.assert.calledWith(
               component._notify,
               'intersectionObserverRegister',
               [component.getInstanceId(), component._container, options.data],
               { bubbling: true }
            );
            sandbox.restore();
         });
      });
      describe('_beforeUnmount', function() {
         it('should notify intersectionObserverUnregister event', function() {
            const
               sandbox = sinon.createSandbox(),
               component = calendarTestUtils.createComponent(scroll.IntersectionObserverContainer, options);

            sandbox.stub(component, '_notify');
            component._beforeUnmount();
            sinon.assert.calledWith(
               component._notify,
               'intersectionObserverUnregister',
               [component.getInstanceId()],
               { bubbling: true }
            );
            sandbox.restore();
         });
      });
   });
});
