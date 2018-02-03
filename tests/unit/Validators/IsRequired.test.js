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