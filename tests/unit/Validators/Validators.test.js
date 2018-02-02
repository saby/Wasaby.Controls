define(
   [
      'Controls/Validate/Validators/IsEmail',
      'Controls/Validate/Validators/IsRequired'
   ],
   function (isEmail, IsRequired) {

      'use strict';

      var
         emails = [
            {
               value: 'email@email.ru',
               valid: true
            },
            {
               value: 'email@em.ail.ru',
               valid: true
            },
            {
               value: 'тест@тест.рф',
               valid: true
            },
            {
               value: 'email',
               valid: false
            },
            {
               value: 'email@email',
               valid: false
            },
            {
               value: 'email@ema@il.ru',
               valid: false
            },
            {
               value: 'тест@test.рф',
               valid: false
            }
         ];

      describe('Controls.Validators', function () {
         describe('IsEmail', function () {
            emails.forEach(function(item) {
               it((item.valid ? 'Valid' : 'Invalid') + ' "' + item.value + '"', function () {
                  if (item.valid) {
                     assert.equal(isEmail({
                        text: item.value
                     }), true);
                  } else {
                     assert.equal(typeof isEmail({
                        text: item.value
                     }), 'string');
                  }
               });
            });
         });

         describe('IsRequired', function () {
            it('Valid "qwe"', function () {
               assert.equal(IsRequired({
                  text: 'qwe'
               }), true);
            });

            it('Invalid ""', function () {
               assert.equal(typeof IsRequired({
                  text: ''
               }), 'string');
            });

            it('Valid "" if doNotValidate', function () {
               assert.equal(IsRequired({
                  text: '',
                  doNotValidate: true
               }), true);
            });
         });
      });
   }
);