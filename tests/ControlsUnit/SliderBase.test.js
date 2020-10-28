define([
   'Controls/slider',
   'Env/Env'
], function(slider, Env) {
   describe('Controls.slider:Base', function() {
      it('beforeUpdate', function() {
         var cfg = {minValue:0, maxValue: 100, value: 50};
         var sb = new slider.Base(cfg);
         sb._beforeMount(cfg);
         sb.saveOptions(cfg);
         var newValue = 40;
         sb._beforeUpdate({...cfg, value: newValue});
         assert.equal(sb._value, newValue);

         newValue = undefined;
         sb._beforeUpdate({...cfg, value: newValue});
         assert.equal(sb._value, 100);
      });
      it('_mouseMoveAndTouchMoveHandler', () => {
         const cfg = {
            minValue: 0,
            maxValue: 100,
            value: 50
         };
         const sb = new slider.Base(cfg);
         sb._beforeMount(cfg);
         Env.constants.browser.isMobilePlatform = true;
         sb._mouseMoveAndTouchMoveHandler({});
         assert.equal(sb._tooltipPosition, 50);
         Env.constants.browser.isMobilePlatform = false;
      });
   });
});
