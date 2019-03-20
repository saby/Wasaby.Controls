define(
   [
      'Controls/Popup/Previewer',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   (Previewer, SyntheticEvent) => {
      'use strict';
      describe('Controls/Popup/Previewer', () => {
         it('contentMousedownHandler', () => {
            let PWInstance = new Previewer();
            var result;
            PWInstance._isPopupOpened = function() {
               return false;
            };
            PWInstance._debouncedAction = function(method, args) {
               result = true;
            };
            var event = new SyntheticEvent(null, {});
            PWInstance._options.trigger = 'click';
            PWInstance._contentMousedownHandler(event);
            assert.deepEqual(result, true);
            result = false;
            PWInstance._options.trigger = 'hover';
            PWInstance._contentMousedownHandler(event);
            assert.deepEqual(result, false);
            PWInstance._options.trigger = 'hoverAndClick';
            PWInstance._contentMousedownHandler(event);
            assert.deepEqual(result, true);
            PWInstance.destroy();
         });
      });
   }
);
