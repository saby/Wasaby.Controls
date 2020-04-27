



      export = {
         getMask: function(value) {
            var
               mask = '',
               plus = true,
               digitValue = value.replace(/[^0-9]/g, function(found, index) {
                  if (index === 0 && found === '+' && plus) {
                     plus = false;
                     return '+';
                  } else {
                     return '';
                  }
               });

            if (digitValue.indexOf('+7') === 0 || digitValue.indexOf('8') === 0) {
               if (digitValue.indexOf('+7') === 0) {
                  mask = '+';
                  digitValue = digitValue.slice(0, -1);
               }
               if (digitValue.length < 12) {
                  mask += 'd (ddd) ddd-dd-dd';
               } else if (digitValue.length === 12) {
                  mask += 'd ddddddddddd';
               } else {
                  mask += 'd\\*';
               }
            } else if (plus) {
               if (digitValue.length < 5) {
                  mask = 'dd-dd';
               } else if (digitValue.length === 5) {
                  mask = 'd-dd-dd';
               } else if (digitValue.length === 6) {
                  mask = 'dd-dd-dd';
               } else if (digitValue.length === 7) {
                  mask = 'ddd-dd-dd';
               } else if (digitValue.length > 7 && digitValue.length < 11) {
                  mask = '(ddd) ddd-dd-dd';
               }
            }

            return mask || '+\\?d\\*';
         }
      };

