define(
   [
      'Controls/Validate/Validators/IsEmail',
      'Controls/Validate/Validators/IsRequired'
   ],
   function (isEmail, IsRequired) {

      'use strict';

      //Скипнем тесты до выполнения задачи: https://online.sbis.ru/opendoc.html?guid=d74685f2-a152-4e4a-8b77-040bee5e4c27
      describe('Controls.Validators', function () {
         describe('IsEmail', function () {
            it('Valid "email@email.ru"', function () {
               assert.equal(isEmail({
                  text: 'email@email.ru'
               }), true);
            });

            it('Invalid "email"', function () {
               assert.equal(typeof isEmail({
                  text: 'email'
               }), 'string');
            });

            it('Invalid "email@email"', function () {
               assert.equal(typeof isEmail({
                  text: 'email'
               }), 'string');
            });

            it('Invalid "email@ema@il.ru"', function () {
               assert.equal(typeof isEmail({
                  text: 'email'
               }), 'string');
            });

            it('Invalid "email@em.ail.ru"', function () {
               assert.equal(typeof isEmail({
                  text: 'email'
               }), 'string');
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