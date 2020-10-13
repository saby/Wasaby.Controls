/* global define, beforeEach, afterEach, describe, it, assert, sinon */
define([
   'Controls/error',
], function(
   { DialogOpener }
) {
   describe('Controls/dataSource:error.DialogOpener', () => {
      let _popupHelper;
      let instance;
      const popupId = '42';

      beforeEach(() => {
         _popupHelper = {
            openDialog: sinon.stub().resolves(popupId),
            closeDialog: sinon.stub().resolves()
         };
         instance = new DialogOpener({ _popupHelper });
      });

      afterEach(() => {
         instance._popupId = null;
         sinon.restore();
      });

      describe('getDialogOptions', () => {
         it('will not set popupId, if instance has no its own', () => {
            let options = instance.getDialogOptions({ id: 1 });
            assert.strictEqual(options.id, 1);
         });

         it('will set popupId, if instance has no its own', () => {
            instance._popupId = 2;
            let options = instance.getDialogOptions({ id: 1 });
            assert.strictEqual(options.id, 2);
         });

         it('resets _popupId on calling custom "onClose" event handler', () => {
            const onClose = sinon.stub();
            const options = instance.getDialogOptions({ eventHandlers: { onClose } });
            instance._popupId = '42';
            options.eventHandlers.onClose();
            assert.isTrue(onClose.calledOnce, 'onClose was not called');
            assert.isNull(instance._popupId, '_popupId was not reset');
         });
      });

      describe('open', () => {
         it('returns empty resolved Promise, when config wasn\'t passed', () => {
            return instance.open().then(result => assert.isUndefined(result), () => assert.fail('Promise error'));
         });

         it('openDialog was called with proper args, sets popupId', () => {
            instance.getDialogOptions = sinon.stub().returnsArg(0);
            const config = {};
            return instance.open(config, 'dialogOptions').then(() => {
               const args = _popupHelper.openDialog.getCall(0).args;
               assert.strictEqual(args[0], config, 'openDialog was called with wrong config');
               assert.strictEqual(args[1], 'dialogOptions', 'openDialog was called with wrong options');
               assert.strictEqual(instance._popupId, popupId, 'wrong popupId');
            });
         });
      });

      describe('close', () => {
         it('calls closeDialog with proper args, when instance has _popupId', () => {
            instance._popupId = '1';
            return instance.close().then(() => {
               const args = _popupHelper.closeDialog.getCall(0).args;
               assert.strictEqual(args[0], '1', 'wrong closeDialog args');
            });
         });

         it('returns empty resolved Promise, when instance has no _popupId', () => {
            return instance.close().then(result => assert.isUndefined(result), () => assert.fail('Promise error'));
         });
      });

      describe('destroy', () => {
         it('closes dialog and resets _popupId', () => {
            instance._popupId = '1';
            sinon.spy(instance, 'close');
            instance.destroy();
            assert.isTrue(instance.close.calledOnce, 'close method was not called');
            assert.isNull(instance._popupId, '_popupId was not reset');
         });
      });
   });
});
