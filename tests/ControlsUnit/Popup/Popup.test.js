define(
   [
      'Controls/_popup/Manager/Popup',
   ],

   function(PopupClass) {
      'use strict';

      describe('Controls/_popup/Manager/Popup', () => {
         it('isResized', () => {
            const Popup = new PopupClass.default();
            let oldOptions = { position: {} };
            let newOptions = { position: {} };
            assert.equal(false, Popup._isResized(oldOptions, newOptions));

            newOptions.position.width = 10;
            assert.equal(true, Popup._isResized(oldOptions, newOptions));

            oldOptions.position.width = 10;
            assert.equal(false, Popup._isResized(oldOptions, newOptions));

            oldOptions = { position: { height: 10 } };
            newOptions = { position: {} };
            assert.equal(true, Popup._isResized(oldOptions, newOptions));

            newOptions.position.height = 10;
            assert.equal(false, Popup._isResized(oldOptions, newOptions));

            oldOptions = { position: { hidden: true } };
            newOptions = { position: { hidden: false } };

            assert.equal(true, Popup._isResized(oldOptions, newOptions));
         });
         it('_showIndicatorHandler', () => {
            const Popup = new PopupClass.default();
            let config = '';
            let promise = '';
            let stopPropagation = () => {
            };
            Popup._notify = (eventName, eventArgs, eventOptions) => {
               config = eventArgs[0];
               promise = eventArgs[1];
            };
            Popup._showIndicatorHandler({ event: 'event', stopPropagation }, 'config', 'promise');
            assert.equal(config, 'config');
            assert.equal(promise, 'promise');
            Popup.destroy();
         });
         it('_preparePrefetchData', () => {
            const prefetchPromise = new Promise((resolve) => {
               const promise1 = new Promise(resolve1 => setTimeout(() => { resolve1('data1') }, 1));
               const promise2 = new Promise(resolve2 => setTimeout(() => { resolve2('data2') }, 10));
               resolve({
                  'loader1': promise1,
                  'loader2': promise2
               });
            });
            const Popup = new PopupClass.default();
            const prefetchData = {
               'loader1': 'data1',
               'loader2': 'data2'
            };
            return Popup._preparePrefetchData(prefetchPromise).then((data) => {
               assert.deepEqual(data, prefetchData);
               Popup.destroy();
            });
         });
      });
   }
);
