define([
   'Controls/_validate/Validators/IsValidDate',
   'Types/entity'
], function (
   isValidDate,
   entity
) {
   'use strict';

   describe('Controls.Validators.IsValidDate', function () {
      [{
         value: null,
         resp: true
      }, {
         value: new entity.Date(2019, 0, 1),
         resp: true
      }, {
         value: new entity.Date('Invalid'),
         resp: 'Дата заполнена некорректно'
      }, {
         value: new entity.Time('Invalid'),
         resp: 'Время заполнено некорректно'
      }, {
         value: new entity.DateTime('Invalid'),
         resp: 'Дата или время заполнены некорректно'
      }].forEach(function(test) {
         it(`should return ${test.resp} for ${test.value}`, function () {
            assert.equal(isValidDate({
               value: test.value
            }), test.resp);
         });
      });
   });
});
