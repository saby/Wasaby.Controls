define([
   'Controls/slider',
   'Controls/_slider/Utils'
], function(slider, utils) {
   describe('Controls.slider:Range', function() {
      it('calculations', function() {
         var sb = new slider.Range({});
         var startValue = 40;
         var endValue = 80;

         var pointName = slider.Range._private._getClosestPoint(10, startValue, endValue);
         assert.equal('start', pointName, 'Case 1 _getClosestPoint: WrongResult');

         pointName = slider.Range._private._getClosestPoint(100, startValue, endValue);
         assert.equal('end', pointName, 'Case 2 _getClosestPoint: WrongResult');

         pointName = slider.Range._private._getClosestPoint(55, startValue, endValue);
         assert.equal('start', pointName, 'Case 3 _getClosestPoint: WrongResult');

         pointName = slider.Range._private._getClosestPoint(69, startValue, endValue);
         assert.equal('end', pointName, 'Case 4 _getClosestPoint: WrongResult');

      });
   })
});
