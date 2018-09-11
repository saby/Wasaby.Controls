/**
 * Created by as.krasilnikov on 25.10.16.
 */
define(['SBIS3.CONTROLS/FormattedTextBox'], function (FormattedTextBox) {

   'use strict';
   describe('SBIS3.CONTROLS/FormattedTextBox', function () {
      var FTB, inputField, componentElement;
      before(function() {
         if (typeof $ !== 'undefined') {
            componentElement = $('<div id="component"></div>');
            $('#mocha').append(componentElement);
            FTB = new FormattedTextBox({
               element: 'component',
               mask: 'xx:xx:xx'
            });
            FTB._getCursor = () => {return {}}; //Нативно группу не определить, т.к. высталяем значение из кода
            inputField = FTB._inputField;
         }
      });
      after(function () {
         if (typeof $ !== 'undefined') {
            FTB.destroy();
         }
         FTB = undefined;
         inputField = undefined;
         componentElement && componentElement.remove();
      });

      beforeEach(function() {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });

      context('Android: Get inputted symbol and symbol position', function (){
         it('Not changed', function (){
            let textGroups = FTB._getTextGroupAndroid();
            assert.equal(FTB._getTextDiff(textGroups.oldText, textGroups.newText, textGroups.maskGroups, false), false);
         });

         it('Input first symbol in first section', function (){
            inputField.text('a  :  :  ');
            let textGroups = FTB._getTextGroupAndroid();
            assert.deepEqual(FTB._getTextDiff(textGroups.oldText, textGroups.newText, textGroups.maskGroups, false), {
               character: 'a',
               position: 0,
               groupNum: undefined
            });
         });

         it('Input first symbol in second section', function (){
            inputField.text('  :b  :  ');
            let textGroups = FTB._getTextGroupAndroid();
            assert.deepEqual(FTB._getTextDiff(textGroups.oldText, textGroups.newText, textGroups.maskGroups, false), {
               character: 'b',
               position: 0,
               groupNum: undefined
            });
         });

         it('Input second symbol in third section', function (){
            inputField.text('  :  : c ');
            let textGroups = FTB._getTextGroupAndroid();
            assert.deepEqual(FTB._getTextDiff(textGroups.oldText, textGroups.newText, textGroups.maskGroups, false), {
               character: 'c',
               position: 1,
               groupNum: undefined
            });
         });
      });
   });
});