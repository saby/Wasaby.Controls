define(
   [
      'Core/core-merge',
      'Controls/_input/Mask/ViewModel'
   ],
   function(coreMerge, ViewModel) {

      'use strict';

      describe('Controls/_input/Mask/ViewModel', function() {
         var viewModel = new ViewModel({
               mask: 'DD.MM.YY',
               value: '',
               replacer: ' ',
               formatMaskChars: {
                  'D': '[0-9]',
                  'M': '[0-9]',
                  'Y': '[0-9]',
                  'H': '[0-9]',
                  'm': '[0-9]',
                  's': '[0-9]',
                  'U': '[0-9]'
               },
            }), result;

         describe('handleInput', function() {
            var splitValue = {
               after: '  .  .  ',
               before: '',
               delete: '',
               insert: '1'
            };
            viewModel.handleInput(splitValue, 'insert');
            assert.deepEqual(viewModel.value, '1     ');
         });
      });
   }
);
