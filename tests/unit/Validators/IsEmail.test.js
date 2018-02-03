define(
   [
      'Controls/Validate/Validators/IsEmail'
   ],
   function (isEmail) {

      'use strict';

      var
         emails = [
            //valid:
            {
               value: 'email@example.com',
               valid: true
            },
            {
               value: 'firstname.lastname@example.com',
               valid: true
            },
            {
               value: 'email@subdomain.example.com',
               valid: true
            },
            {
               value: 'firstname+lastname@example.com',
               valid: true
            },
            {
               value: '1234567890@example.com',
               valid: true
            },
            {
               value: 'email@example-one.com',
               valid: true
            },
            {
               value: '_______@example.com',
               valid: true
            },
            {
               value: 'email@example.name',
               valid: true
            },
            {
               value: 'email@example.museum',
               valid: true
            },
            {
               value: 'email@example.co.jp',
               valid: true
            },
            {
               value: 'firstname-lastname@example.com',
               valid: true
            },
            //invalid:
            {
               value: 'plainaddress',
               valid: false
            },
            {
               value: '#@%^%#$@#$@#.com',
               valid: false
            },
            {
               value: '@example.com',
               valid: false
            },
            {
               value: 'Joe Smith <email@example.com>',
               valid: false
            },
            {
               value: 'email.example.com',
               valid: false
            },
            {
               value: 'email@example@example.com',
               valid: false
            },
            {
               value: '.email@example.com',
               valid: false
            },
            {
               value: 'email.@example.com',
               valid: false
            },
            {
               value: 'email..email@example.com',
               valid: false
            },
            {
               value: 'あいうえお@example.com',
               valid: false
            },
            {
               value: 'email@example.com (Joe Smith)',
               valid: false
            },
            {
               value: 'email@example',
               valid: false
            },
            {
               value: 'email@111.222.333.44444',
               valid: false
            },
            {
               value: 'email@example..com',
               valid: false
            },
            {
               value: 'Abc..123@example.com',
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
      });
   }
);