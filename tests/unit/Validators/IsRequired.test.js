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
               assert.notEqual(IsRequired({
                  value: ''
               }), true);
            });

            it('Valid "" if doNotValidate', function () {
               assert.equal(IsRequired({
                  value: '',
                  doNotValidate: true
               }), true);
            });

            it('Valid {}', function () {
               assert.notEqual(IsRequired({
                  value: {}
               }), true);
            });

         });
      });
   }
);