define(
   [
      'Core/core-clone',
      'Core/core-merge',
      'Controls/_input/Number/ViewModel'
   ],
   function(cClone, cMerge, ViewModel) {
      describe('Controls._input.Number.ViewModel', function() {
         describe('handleInput', function() {
            const defaultOptions = {
               useGrouping: false,
               onlyPositive: false
            };
            const model = new ViewModel(defaultOptions, null);
            const getSelection = function(value) {
               return {
                  start: value,
                  end: value
               };
            };

            beforeEach(function() {
               model.options = cClone(defaultOptions);
            });

            it('Enter "1".', function() {
               model.handleInput({
                  after: '',
                  before: '',
                  insert: '1',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '1.0');
               assert.deepEqual(model.selection, getSelection(1));
            });
            it('Enter "test1test2test3test".', function() {
               model.handleInput({
                  after: '',
                  before: '',
                  insert: 'test1test2test3test',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '123.0');
               assert.deepEqual(model.selection, getSelection(3));
            });
            it('Enter "1". No fractional part.', function() {
               model.options = cMerge(model.options, {
                  precision: 0
               });
               model.handleInput({
                  after: '',
                  before: '',
                  insert: '1',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '1');
               assert.deepEqual(model.selection, getSelection(1));
            });
            it('Enter "-1".', function() {
               model.handleInput({
                  after: '',
                  before: '',
                  insert: '-1',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '-1.0');
               assert.deepEqual(model.selection, getSelection(2));
            });
            it('Enter "-1". Only positive numbers.', function() {
               model.options = cMerge(model.options, {
                  onlyPositive: true
               });
               model.handleInput({
                  after: '',
                  before: '',
                  insert: '-1',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '1.0');
               assert.deepEqual(model.selection, getSelection(1));
            });
            it('Enter "6" at the end of the integer part. The maximum length of the integer part equal 5.', function() {
               model.options = cMerge(model.options, {
                  integersLength: 5
               });
               model.handleInput({
                  after: '.0',
                  before: '12345',
                  insert: '6',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '12345.60');
               assert.deepEqual(model.selection, getSelection(7));
            });
            it('Enter "6" at the end of the integer part. The maximum length of the integer part equal 5. No fractional part.', function() {
               model.options = cMerge(model.options, {
                  precision: 0,
                  integersLength: 5
               });
               model.handleInput({
                  after: '',
                  before: '12345',
                  insert: '6',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '12345');
               assert.deepEqual(model.selection, getSelection(5));
            });
            it('Enter "6" at the end of the integer part. The maximum length of the integer part equal 5. The maximum length of the fractional part equal 1.', function() {
               model.options = cMerge(model.options, {
                  precision: 1,
                  integersLength: 5
               });
               model.handleInput({
                  after: '.0',
                  before: '12345',
                  insert: '6',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '12345.6');
               assert.deepEqual(model.selection, getSelection(7));
            });
            it('Enter "-". No fractional part.', function() {
               model.options = cMerge(model.options, {
                  precision: 0
               });

               model.handleInput({
                  after: '',
                  before: '',
                  insert: '-',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '-');
               assert.deepEqual(model.selection, getSelection(1));
            });
            it('Enter "-" front "0". No fractional part.', function() {
               model.options = cMerge(model.options, {
                  precision: 0
               });

               model.handleInput({
                  after: '0',
                  before: '',
                  insert: '-',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '-');
               assert.deepEqual(model.selection, getSelection(1));
            });
            it('Enter "4" at the start of the integer part. The maximum length of the integer part equal 3. No fractional part.', function() {
               model.options = cMerge(model.options, {
                  precision: 0,
                  integersLength: 3
               });
               model.handleInput({
                  after: '123',
                  before: '',
                  insert: '4',
                  delete: ''
               }, 'insert');

               assert.equal(model.displayValue, '423');
               assert.deepEqual(model.selection, getSelection(1));
            });
         });
      });
   }
);
