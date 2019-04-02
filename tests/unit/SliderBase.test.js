define([
   'Controls/slider'
], function(slider) {
   describe('Controls.slider:Base', function() {
      it('calculations', function() {
         var sb = new slider.Base({});
         var minValue = 10;
         var maxValue = 100;
         var value = 40;
         var width = 200;
         var left = 100;
         var precision = 0;
         var clickX = 100;

         var ratio = slider.Base._private._getRatio(clickX, left, width);
         assert.equal(0, ratio, 'Case 1 _getRatio: WrongResult');
         var newValue = slider.Base._private._calcValue(minValue, maxValue, ratio);
         assert.equal(10, newValue, 'Case 1 _calcValue: WrongResult');
         newValue = slider.Base._private._round(newValue, precision);
         assert.equal(10, newValue, 'Case 1 _round: WrongResult');

         clickX = 300;

         ratio = slider.Base._private._getRatio(clickX, left, width);
         assert.equal(1, ratio, 'Case 2 _getRatio: WrongResult');
         newValue = slider.Base._private._calcValue(minValue, maxValue, ratio);
         assert.equal(100, newValue, 'Case 2 _calcValue: WrongResult');
         newValue = slider.Base._private._round(newValue, precision);
         assert.equal(100, newValue, 'Case 2 _round: WrongResult');

         clickX = 200;

         ratio = slider.Base._private._getRatio(clickX, left, width);
         assert.equal(0.5, ratio, 'Case 3 _getRatio: WrongResult');
         newValue = slider.Base._private._calcValue(minValue, maxValue, ratio);
         assert.equal(55, newValue, 'Case 3 _calcValue: WrongResult');
         newValue = slider.Base._private._round(newValue, precision);
         assert.equal(55, newValue, 'Case 3 _round: WrongResult');

         clickX = 230;

         ratio = slider.Base._private._getRatio(clickX, left, width);
         assert.equal(0.65, ratio, 'Case 4 _getRatio: WrongResult');
         newValue = slider.Base._private._calcValue(minValue, maxValue, ratio);
         assert.equal(68.5, newValue, 'Case 4 _calcValue: WrongResult');
         newValue = slider.Base._private._round(newValue, precision);
         assert.equal(69, newValue, 'Case 4 _round: WrongResult');
      });
   })
});
