define(
   [
      'Controls/Validate/Validators/IsRequired'
   ],
   function (IsRequired) {

      'use strict';

      describe('Controls.Validators', function () {
         describe('IsRequired', function () {
            it('Valid "qwe"', function () {
               assert.equal(IsRequired({
                  value: 'qwe'
               }), true);
            });

            it('Invalid ""', function () {
               var
                  res = IsRequired({
                     value: ''
                  });

               //IsRequired при ошибке валидации возвращает результат функции rk, который может быть типа object, когда нет window
               if (typeof res === 'string' || typeof res === 'object') {
                  assert.ok(true);
               } else {
                  assert.ok(false);
               }
            });

            it('Valid "" if doNotValidate', function () {
               assert.equal(IsRequired({
                  value: '',
                  doNotValidate: true
               }), true);
            });
         });
      });
   }
);