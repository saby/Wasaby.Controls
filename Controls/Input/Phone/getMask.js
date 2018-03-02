define('Controls/Input/Phone/getMask',
   [],
   function() {

      'use strict';

      return function(value) {
         var
            plus = true,
            digitValue = value.replace(/[^0-9]/g, function(found) {
               if (found === '+' && plus) {
                  plus = false;
                  return '+';
               } else {
                  return ''
               }
            }),
            mask;

         if (digitValue.indexOf('+') === 0) {
            if (digitValue.indexOf('+7') === 0) {
               if (digitValue.length < 13) {
                  mask = '+d (ddd) ddd-dd-dd'
               } else {
                  mask = '+d ddddddddddd'
               }
            }
         } else if (digitValue.indexOf('8') === 0) {
            if (~'34589'.indexOf(digitValue[1]) && digitValue.length < 12) {
               mask = 'd (ddd) ddd-dd-dd'
            } else if (digitValue.length <= 12) {
               mask = 'd ddddddddddd';
            }
         } else {
            if (digitValue.length < 5) {
               mask = 'dd-dd';
            } else if (digitValue.length === 5) {
               mask = 'd-dd-dd';
            } else if (digitValue.length === 6) {
               mask = 'dd-dd-dd';
            } else if (digitValue.length === 7) {
               mask = 'ddd-dd-dd';
            } else if (digitValue.length > 7 && digitValue.length < 11) {
               mask = '(ddd)-ddd-dd-dd';
            }
         }

         return mask || '+d\\*';
      }
   }
);