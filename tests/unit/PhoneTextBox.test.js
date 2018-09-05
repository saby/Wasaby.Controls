/**
 * Created by as.krasilnikov on 25.10.16.
 */
define(['SBIS3.CONTROLS/PhoneTextBox'], function (PhoneTextBox) {

   'use strict';
   describe('SBIS3.CONTROLS/PhoneTextBox', function () {
      var phone;
      var componentElement = $('<div id="component"></div>');
      before(function() {
         if (typeof $ !== 'undefined') {
            $('#mocha').append(componentElement);
            phone = new PhoneTextBox({
               element: 'component'
            });
         }
      });
      after(function () {
         if (typeof $ !== 'undefined') {
            phone.destroy();
         }
         phone = undefined;
         componentElement && componentElement.remove();
      });

      beforeEach(function() {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });

      describe('Paste value', function (){
         it('Paste value with spaces', function () {
            phone._onPasteValue('+7 (123) 456 - 78 - 90');
            assert.equal(phone.getText(), '+7(123)456-78-90');
         });
      });
   });
});