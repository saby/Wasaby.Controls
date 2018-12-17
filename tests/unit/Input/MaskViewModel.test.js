define(
   [
      'Core/core-merge',
      'Controls/Input/Mask/ViewModel'
   ],
   function(coreMerge, ViewModel) {

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
                  format: viewModel._format,
                  formatMaskChars: viewModel._formatMaskChars
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
                  },
                  formatMaskChars: options.formatMaskChars
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
               assert.equal(result, '1234');
            });
         });

         describe('getDisplayValue', function() {
            const gdvDefaultOptions = {
               value: '',
               replacer: '',
               mask: 'dd.dd',
               formatMaskChars: {
                  'd': '[0-9]'
               }
            };

            [
               { options: { }, resp: '' },
               { options: { replacer: '-' }, resp: '--.--' },
               { options: { value: '1234' }, resp: '12.34' },
               { options: { value: '1234', replacer: '-' }, resp: '12.34' }
            ].forEach(function(test) {
               const options = coreMerge(test.options, gdvDefaultOptions, { preferSource: true });
               it(`should return ${test.resp} if options is equals value: ${options.value}, valueType: ${options.valueType}`, function() {
                  viewModel.updateOptions(options);
                  result = viewModel.getDisplayValue();
                  assert.equal(viewModel.getDisplayValue(), test.resp);
               });
            });

         });
      });
   }
);
