define([
   'Controls/slider'
], function(slider) {
   describe('Controls.slider:Range', function() {
      it('calculations', function() {
         var sb = new slider.Range({});
         var minValue = 10;
         var maxValue = 100;
         var startValue = 40;
         var endValue = 80;
         var width = 200;
         var left = 100;
         var precision = 0;
         var clickX = 100;

         var ratio = slider.Range._private._getRatio(clickX, left, width);
         assert.equal(0, ratio, 'Case 1 _getRatio: WrongResult');
         var newValue = slider.Range._private._calcValue(minValue, maxValue, ratio);
         assert.equal(10, newValue, 'Case 1 _calcValue: WrongResult');
         newValue = slider.Range._private._round(newValue, precision);
         assert.equal(10, newValue, 'Case 1 _round: WrongResult');
         var pointName = slider.Range._private._getClosestPoint(newValue, startValue, endValue);
         assert.equal('start', pointName, 'Case 1 _round: WrongResult');

         clickX = 300;

         ratio = slider.Range._private._getRatio(clickX, left, width);
         assert.equal(1, ratio, 'Case 2 _getRatio: WrongResult');
         newValue = slider.Range._private._calcValue(minValue, maxValue, ratio);
         assert.equal(100, newValue, 'Case 2 _calcValue: WrongResult');
         newValue = slider.Range._private._round(newValue, precision);
         assert.equal(100, newValue, 'Case 2 _round: WrongResult');
         pointName = slider.Range._private._getClosestPoint(newValue, startValue, endValue);
         assert.equal('end', pointName, 'Case 2 _round: WrongResult');

         clickX = 200;

         ratio = slider.Range._private._getRatio(clickX, left, width);
         assert.equal(0.5, ratio, 'Case 3 _getRatio: WrongResult');
         newValue = slider.Range._private._calcValue(minValue, maxValue, ratio);
         assert.equal(55, newValue, 'Case 3 _calcValue: WrongResult');
         newValue = slider.Range._private._round(newValue, precision);
         assert.equal(55, newValue, 'Case 3 _round: WrongResult');
         pointName = slider.Range._private._getClosestPoint(newValue, startValue, endValue);
         assert.equal('start', pointName, 'Case 3 _round: WrongResult');

         clickX = 230;

         ratio = slider.Range._private._getRatio(clickX, left, width);
         assert.equal(0.65, ratio, 'Case 4 _getRatio: WrongResult');
         newValue = slider.Range._private._calcValue(minValue, maxValue, ratio);
         assert.equal(68.5, newValue, 'Case 4 _calcValue: WrongResult');
         newValue = slider.Range._private._round(newValue, precision);
         assert.equal(69, newValue, 'Case 4 _round: WrongResult');
         pointName = slider.Range._private._getClosestPoint(newValue, startValue, endValue);
         assert.equal('end', pointName, 'Case 4 _round: WrongResult');

      });
   })
});
