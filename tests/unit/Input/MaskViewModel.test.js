define(
   [
      'Controls/Input/Mask/ViewModel'
   ],
   function(ViewModel) {

      'use strict';

      describe('Controls.Input.Mask.ViewModel', function() {
         var viewModel = new ViewModel({}), result;

         describe('updateOptions', function() {
            it('test_01', function() {
               var options = {
                  replacer: ' ',
                  mask: 'dd.dd',
                  formatMaskChars: {
                     'd': '[0-9]'
                  }
               };
               viewModel.updateOptions(options);
               result = {
                  replacer: viewModel._replacer,
                  maskData: viewModel._maskData
               };
               assert.deepEqual(result, {
                  replacer: options.replacer,
                  maskData: {
                     "searchingGroups": "((?:[0-9]| ))((?:[0-9]| ))(\\.)?((?:[0-9]| ))((?:[0-9]| ))",
                     "delimiterGroups": {
                        "2": {
                           "value": ".",
                           "type": "single"
                        }
                     }
                  }
               });
            });
         });
      });
   }
);