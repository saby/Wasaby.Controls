define('Controls/Input/Phone/PhoneHelper',
   [],
   function() {

      'use strict';

      var PhoneHelper = {
         getMask: function(value) {
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

            if (digitValue.indexOf('+7') === 0) {
               mask = digitValue.length < 13 ? '+7 (ddd) ddd-dd-dd' : '+7 ddddddddddd';
            } else if (digitValue.indexOf('8') === 0) {
               mask = ~'34589'.indexOf(digitValue[1]) && digitValue.length < 12 ? 'd (ddd) ddd-dd-dd' : 'd ddddddddddd';
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
               } else {
                  mask = 'ddddddddddd';
               }
            }

            return mask || 'd\\\\*';
         }
      };

      return PhoneHelper;
   }
);