define(
   [
      'Controls/validate'
   ],
   function (validate) {

      'use strict';

      describe('Controls.Validators', function () {
         describe('IsRequired', function () {
            it('Valid "qwe"', function () {
               assert.equal(validate.isRequired({
                  value: 'qwe'
               }), true);
            });

            it('Invalid ""', function () {
               assert.notEqual(validate.isRequired({
                  value: ''
               }), true);
            });

            it('Valid "" if doNotValidate', function () {
               assert.equal(validate.isRequired({
                  value: '',
                  doNotValidate: true
               }), true);
            });

            it('Valid {}', function () {
               assert.notEqual(validate.isRequired({
                  value: {}
               }), true);
            });

            it('Valid Date', function() {
               assert.equal(validate.isRequired({
                  value: new Date()
               }), true);
            });
   
            it('Array validation', function() {
               assert.equal(validate.isRequired({
                  value: []
               }), 'Поле обязательно для заполнения');
               assert.equal(validate.isRequired({
                  value: [null]
               }), 'Поле обязательно для заполнения');
               assert.equal(validate.isRequired({
                  value: ['test']
               }), true);
            });

         });
      });
   }
);