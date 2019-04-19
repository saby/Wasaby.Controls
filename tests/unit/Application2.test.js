/**
 * Created by dv.zuev on 27.12.2017.
 */
define([
   'Controls/Application'
], function(Application) {
   describe('Controls.Application2', function() {

      it('Check _forceUpdate reaction', function() {
         let ctrl = new Application({}),
            test = false;
         ctrl._forceUpdate = () => {
            test = true;
         };

         ctrl._popupCreatedHandler();
         assert.isTrue(test);

         test = false;
         ctrl._popupDestroyedHandler(null, null, {getCount: ()=>{return 0;}});
         assert.isTrue(test);

         test = false;
         ctrl._suggestStateChangedHandler();
         assert.isTrue(test);
      });
   });
});
