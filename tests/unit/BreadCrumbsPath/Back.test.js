define([
   'Controls/_breadcrumbs/HeadingPath/Back'
], function(
   PathBack
) {
   describe('Controls/_breadcrumbs/HeadingPath/Back', function() {
      it('_onBackButtonClick', function() {
         var
            instance = new PathBack.default(),
            notifyCalled = false;
         instance._notify = function(eventName, eventArgs, eventOpts) {
            assert.equal('backButtonClick', eventName);
            assert.deepEqual([], eventArgs);
            assert.deepEqual({
               bubbling: true
            }, eventOpts);
            notifyCalled = true;
         };
         instance._onBackButtonClick();
         assert.isTrue(notifyCalled);
      });
      it('_onArrowClick', function() {
         var
            instance = new PathBack.default(),
            notifyCalled = false;
         instance._notify = function(eventName, eventArgs, eventOpts) {
            assert.equal('arrowClick', eventName);
            assert.deepEqual([], eventArgs);
            assert.deepEqual({
               bubbling: true
            }, eventOpts);
            notifyCalled = true;
         };
         instance._onArrowClick();
         assert.isTrue(notifyCalled);
      });
   });
});
