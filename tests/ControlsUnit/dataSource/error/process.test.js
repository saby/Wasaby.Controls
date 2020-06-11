/* global define, beforeEach, afterEach, describe, it, assert, sinon */
define([
   'Controls/dataSource'
], function(
   { error: { process } }
) {
   describe('Controls/dataSource:error.process', () => {
      const popupId = '42';
      let _popupHelper;

      beforeEach(() => {
         _popupHelper = {
            preloadPopup: sinon.stub(),
            openConfirmation: sinon.stub().returns(Promise.resolve()),
            openDialog: sinon.stub().returns(Promise.resolve(popupId))
         };
      });

      afterEach(() => {
         sinon.restore();
      });

      it('is function', () => {
         assert.isFunction(process);
      });

      it('does nothing for unknown error', () => {
         const message = 'test message';
         const error = new Error(message);
         return process({
            error,
            _popupHelper
         }).then((result) => {
            assert.isUndefined(result, 'returns undefined');
            assert.isFalse(_popupHelper.openConfirmation.calledOnceWith({ message }), 'openConfirmation called');
            assert.isNotOk(_popupHelper.openDialog.called, 'openDialog was not called');
         });
      });

      it('returns popupId', () => {
         const opener = {};
         const dialogEventHandlers = {};
         const error = new Error();
         error.status = 0;

         return process({
            error,
            opener,
            dialogEventHandlers,
            _popupHelper
         }).then((result) => {
            assert.isTrue(_popupHelper.openDialog.calledOnce, 'openDialog called');
            const args = _popupHelper.openDialog.getCall(0).args;
            assert.strictEqual(args[1], opener, 'opener was passed');
            assert.strictEqual(args[2], dialogEventHandlers, 'dialogEventHandlers were passed');
            assert.strictEqual(result, popupId, 'returns popupId');
         });
      });

      it('calls custom handlers', () => {
         const error = new Error();
         const viewConfig = {
            template: {},
            options: {}
         };

         return process({
            error,
            handlers: [() => viewConfig],
            _popupHelper
         }).then((result) => {
            assert.isTrue(_popupHelper.openDialog.calledOnce, 'openDialog called');

            const args = _popupHelper.openDialog.getCall(0).args[0];
            assert.include(args, viewConfig, 'openDialog called with viewConfig');
            assert.strictEqual(result, popupId, 'returns popupId');
         });
      });
   });
});
