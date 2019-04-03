define([
   'Controls/Utils/scheduleCallbackAfterRedraw'
], function(
   scheduleCallbackAfterRedraw
) {
   describe('Controls.Utils.scheduleCallbackAfterRedraw', function() {
      var sandbox;
      beforeEach(function() {
         sandbox = sinon.createSandbox();
      });
      afterEach(function() {
         sandbox.restore();
      });

      it('should call callback only if _beforeUpdate was called before _afterUpdate', function() {
         var
            _beforeUpdate = sandbox.stub(),
            _afterUpdate = sandbox.stub(),
            instance = {
               _beforeUpdate,
               _afterUpdate
            },
            callback = sandbox.stub();

         scheduleCallbackAfterRedraw.default(instance, callback);
         instance._afterUpdate();
         assert.isFalse(callback.called);
         instance._beforeUpdate();
         assert.isFalse(callback.called);
         instance._afterUpdate();
         assert.isTrue(callback.called);
      });

      it('should restore _beforeUpdate and _afterUpdate to original values after update', function() {
         var
            _beforeUpdate = sandbox.stub(),
            _afterUpdate = sandbox.stub(),
            instance = {
               _beforeUpdate,
               _afterUpdate
            };

         scheduleCallbackAfterRedraw.default(instance, sandbox.stub());
         instance._beforeUpdate();
         instance._afterUpdate();
         assert.equal(instance._beforeUpdate, _beforeUpdate);
         assert.equal(instance._afterUpdate, _afterUpdate);
      });

      it('should work even if instance doesn\'t have _beforeUpdate\\_afterUpdate', function() {
         var
            instance = {},
            callback = sandbox.stub();

         scheduleCallbackAfterRedraw.default(instance, callback);
         instance._beforeUpdate();
         assert.isFalse(callback.called);
         instance._afterUpdate();
         assert.isTrue(callback.called);
         assert.isUndefined(instance._beforeUpdate);
         assert.isUndefined(instance._afterUpdate);
      });
   });
});
