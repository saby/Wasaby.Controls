define('tests/unit/Calendar/Utils', [
   'Core/core-merge'
], function(
   coreMerge
) {
   return {
      createComponent: function(Component, cfg) {
         let mv;
         if (Component.getDefaultOptions) {
            cfg = coreMerge(cfg, Component.getDefaultOptions(), {preferSource: true});
         }
         mv = new Component(cfg);
         mv.saveOptions(cfg);
         mv._beforeMount(cfg);
         return mv;
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
