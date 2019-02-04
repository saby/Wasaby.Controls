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

            it('Valid Date', function() {
               assert.equal(IsRequired({
                  value: new Date()
               }), true);
            });
   
            it('Array validation', function() {
               assert.equal(IsRequired({
                  value: []
               }), 'Поле обязательно для заполнения');
               assert.equal(IsRequired({
                  value: [null]
               }), 'Поле обязательно для заполнения');
               assert.equal(IsRequired({
                  value: ['test']
               }), true);
            });

         });
      });
   }
);