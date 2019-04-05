define([
   'Controls/_slider/Utils'
], function(utils) {
   describe('Controls.slider Utils', function() {
      it('calculations', function() {
         var minValue = 10;
         var maxValue = 100;
         var value = 40;
         var width = 200;
         var left = 100;
         var precision = 0;
         var scaleData = undefined;
         var clickX = 100;

         var ratio = utils.default.getRatio(clickX, left, width);
         assert.equal(0, ratio, 'Case 1 getRatio: WrongResult');
         var newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         assert.equal(10, newValue, 'Case 1 calcValue: WrongResult');

         clickX = 300;

         ratio = utils.default.getRatio(clickX, left, width);
         assert.equal(1, ratio, 'Case 2 getRatio: WrongResult');
         newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         assert.equal(100, newValue, 'Case 2 calcValue: WrongResult');

         clickX = 200;

         ratio = utils.default.getRatio(clickX, left, width);
         assert.equal(0.5, ratio, 'Case 3 getRatio: WrongResult');
         newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         assert.equal(55, newValue, 'Case 3 calcValue: WrongResult');

         clickX = 230;

         ratio = utils.default.getRatio(clickX, left, width);
         assert.equal(0.65, ratio, 'Case 4 getRatio: WrongResult');
         newValue = utils.default.calcValue(minValue, maxValue, ratio, precision);
         assert.equal(69, newValue, 'Case 4 calcValue: WrongResult');
         
         var scaleStep = 20;
         var expectedScale = [{value: 10, position: 0},
                              {value: 30, position: 22.22222222222222},
                              {value: 50, position: 44.44444444444444},
                              {value: 70, position: 66.66666666666666},
                              {value: 90, position: 88.88888888888889},
                              {value: 100, position: 100}];
         scaleData = utils.default.getScaleData(minValue, maxValue, scaleStep);
         assert.deepEqual(expectedScale, scaleData, 'Case 1 getScaleData: WrongResult');

         scaleStep = 100;
         expectedScale = [{value: 10, position: 0},
                          {value: 100, position: 100}];
         scaleData = utils.default.getScaleData(minValue, maxValue, scaleStep);
         assert.deepEqual(expectedScale, scaleData, 'Case 2 getScaleData: WrongResult');

         scaleStep = 30;
         expectedScale = [{value: 10, position: 0},
            {value: 40, position: 33.33333333333333},
            {value: 70, position: 66.66666666666666},
            {value: 100, position: 100}];
         scaleData = utils.default.getScaleData(minValue, maxValue, scaleStep);
         assert.deepEqual(expectedScale, scaleData, 'Case 3 getScaleData: WrongResult');
      });
   })
});
