define([
   'Controls/_calendar/MonthSlider',
   'Controls/_calendar/MonthSlider/Slider',
   'ControlsUnit/Calendar/Utils'
], function(
   MonthSlider,
   Slider,
   calendarTestUtils
) {

   MonthSlider = MonthSlider.default;
   Slider = Slider.default;

   describe('Controls/Calendar/MonthSlider', function() {

      let defaultOptions = {
         month: new Date(2018, 0, 1)
      };

      it('should create correct model when component initialized', function() {
         let component = calendarTestUtils.createComponent(MonthSlider, defaultOptions);
         assert.strictEqual(component._month, defaultOptions.month);
      });

      describe('_setMonth', function() {
         it('should update model when new month is set', function() {
            let component = calendarTestUtils.createComponent(MonthSlider, defaultOptions),
               newMonth = new Date(defaultOptions.month);
            MonthSlider._private._setMonth(component, newMonth);
            assert.strictEqual(component._month, defaultOptions.month);
         });

         it('should not update model if new date is equal the old one', function() {
            let component = calendarTestUtils.createComponent(MonthSlider, defaultOptions),
               newMonth = new Date();
            MonthSlider._private._setMonth(component, newMonth);
            assert.strictEqual(component._month, newMonth);
         });

         it('should set "slideLeft" animation if month has increased', function() {
            let component = calendarTestUtils.createComponent(MonthSlider, defaultOptions);
            MonthSlider._private._setMonth(component, new Date(defaultOptions.month.getFullYear(), defaultOptions.month.getMonth() + 1));
            assert.strictEqual(component._animation, Slider.ANIMATIONS.slideLeft);
         });

         it('should set "slideRight" animation if month has decreased', function() {
            let component = calendarTestUtils.createComponent(MonthSlider, defaultOptions);
            MonthSlider._private._setMonth(component, new Date(defaultOptions.month.getFullYear(), defaultOptions.month.getMonth() - 1));
            assert.strictEqual(component._animation, Slider.ANIMATIONS.slideRight);
         });
      });
   });
});
