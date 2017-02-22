/**
 * Created by as.krasilnikov on 25.10.16.
 */
define(['js!SBIS3.CONTROLS.FormattedTextBox'], function (FormattedTextBox) {

   'use strict';
   describe('js!SBIS3.CONTROLS.FormattedTextBox', function () {
      beforeEach(function() {
         $('#mocha').append('<div id="component"></div>');
      });
      let FTB = new FormattedTextBox({
         element: 'component',
         mask: 'xx:xx:xx'
      });
      let inputField = FTB._inputField;
      describe('Android: Get inputted symbol and symbol position', function (){
         it('Not changed', function (){
            assert.equal(FTB._getTextDiff(), false);
         });

         it('Input first symbol in first section', function (){
            inputField.text('a  :  :  ');
            assert.deepEqual(FTB._getTextDiff(), {
               char: 'a',
               position: 0
            });
         });

         it('Input first symbol in second section', function (){
            inputField.text('  :b  :  ');
            assert.deepEqual(FTB._getTextDiff(), {
               char: 'b',
               position: 0
            });
         });

         it('Input second symbol in third section', function (){
            inputField.text('  :  : c ');
            assert.deepEqual(FTB._getTextDiff(), {
               char: 'c',
               position: 1
            });
         });
      });
      after(function () {
         FTB.destroy();
         FTB = undefined;
         inputField = undefined;
      });
   });
});