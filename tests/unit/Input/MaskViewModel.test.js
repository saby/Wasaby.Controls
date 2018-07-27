define(
   [
      'Controls/Input/Mask/ViewModel'
   ],
   function(ViewModel) {

      'use strict';

      describe('Controls.Input.Mask.ViewModel', function() {
         var viewModel = new ViewModel({
               mask: '',
               value: '',
               replacer: '',
               formatMaskChars: {}
            }), result;

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
                  format: viewModel._format
               };
               assert.deepEqual(result, {
                  replacer: options.replacer,
                  format: {
                     'searchingGroups': '((?:[0-9]| )(?:[0-9]| ))(\\.)?((?:[0-9]| )(?:[0-9]| ))',
                     'delimiterGroups': {
                        '1': {
                           'value': '.',
                           'type': 'single'
                        }
                     }
                  }
               });
            });
         });
         describe('handleInput', function() {
            beforeEach(function() {
               viewModel.updateOptions({
                  value: '',
                  replacer: ' ',
                  mask: 'dd.dd',
                  formatMaskChars: {
                     'd': '[0-9]'
                  }
               });
            });
            it('test_changeValue', function() {
               viewModel.handleInput({
                  before: '12.34',
                  after: '',
                  insert: 'a',
                  delete: ''
               });
               result = viewModel._options.value;
               assert.equal(result, '12.34');
            });
         });
      });
   }
);
