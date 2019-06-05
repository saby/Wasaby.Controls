define([
   'Controls/_validate/Validators/IsValidDate'
], function (
   isValidDate
) {
   'use strict';

   describe('Controls.Validators.IsValidDate', function () {
      [{
         value: null,
         resp: true
      }, {
         value: new Date(2019, 0, 1),
         resp: true
      }, {
         value: new Date('InvalidDate'),
         resp: 'Дата или время заполнены некорректно.'
      }].forEach(function(test) {
         it(`should return ${test.resp} for ${test.value}`, function () {
            assert.equal(isValidDate({
               value: test.value
            }), test.resp);
         });
      });
   });
});
