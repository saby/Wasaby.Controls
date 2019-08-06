define('ControlsUnit/Calendar/Utils', [
   'Core/core-clone',
   'Core/core-merge'
], function(
   coreClone,
   coreMerge
) {
   return {
      createComponent: function(Component, cfg) {
         let mv;
         if (Component.getDefaultOptions) {
            cfg = this.prepareOptions(Component, cfg);
         }
         mv = new Component(cfg);
         mv.saveOptions(cfg);
         mv._beforeMount(cfg);
         return mv;
      },

      prepareOptions: function(Component, cfg) {
         return coreMerge(coreClone(cfg), Component.getDefaultOptions(), { preferSource: true });
      },

      assertMonthView: function(weeks, dayAssertFn) {
         for (let week of weeks) {
            assert.equal(week.length, 7);
            for (let day of week) {
               if (dayAssertFn) {
                  dayAssertFn(day);
               }
            }
         }
      }
   };
});
