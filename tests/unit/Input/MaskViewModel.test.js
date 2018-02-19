define(
   [
      'Controls/Input/Mask/ViewModel'
   ],
   function(ViewModel) {

      'use strcit';

      describe('Controls.Input.Mask.ViewModel', function() {
         var viewModel = new ViewModel({
            value: '  .  ',
            replacer: ' ',
            mask: 'dd.dd',
            formatMaskChars: {
               'd': '[0-9]'
            }
         }), result;

         describe('updateOptions', function() {
            it('test_01', function() {
               var options = {
                  value: '12.34',
                  replacer: ' ',
                  mask: 'dd.dd'
               };
               viewModel.updateOptions(options);
               result = {
                  value: viewModel._value,
                  replacer: viewModel._replacer,
                  maskData: viewModel._maskData
               };
               assert.deepEqual(result, {
                  value: options.value,
                  replacer: options.replacer,
                  maskData: undefined
               });
            });
         });
         describe('prepareData', function() {
            beforeEach(function() {
               viewModel.updateOptions({
                  value: '  .  ',
                  replacer: ' ',
                  mask: 'dd.dd'
               });
            });
            it('Valid value', function() {
               result = viewModel.prepareData({
                  before: '',
                  insert: '1',
                  after: '  .  ',
                  delete: ''
               }, 'insert');
               assert.deepEqual(result, {
                  value: '1 .  ',
                  position: 1
               });
            });
            it('Invalid value', function() {
               result = viewModel.prepareData({
                  before: '',
                  insert: 'a',
                  after: '  .  ',
                  delete: ''
               }, 'insert');
               assert.deepEqual(result, {
                  value: '  .  ',
                  position: 0
               });
            });
         });
      });
   }
);