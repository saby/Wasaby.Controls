define([
   'js!Controls/Input/resources/TargetUtil'
], function(TargetUtil){
   describe('Controls.Input.TargetUtil', function () {

      var targetUtil = new TargetUtil();

      var test = function(oldValue, newValue, splitValue, cursorPosition, selectionLength){

         targetUtil.saveSelectionPosition({
            selectionStart: cursorPosition,
            selectionEnd: cursorPosition + (selectionLength || 0)
         });

         var res = targetUtil.buildSplitValue({
            value: newValue,
            selectionEnd: splitValue.before.length + splitValue.input.length
         }, oldValue);

         assert.deepEqual(res, splitValue);
      };

      describe('buildSplitValue method:', function () {

         describe('insert char', function () {

            it('at the beginning', function () {
               test('before', 'ibefore', {
                  before: '',
                  input: 'i',
                  after: 'before'
               }, 0);
            });

            it('in the middle', function () {
               test('beforeafter', 'beforeiafter', {
                  before: 'before',
                  input: 'i',
                  after: 'after'
               }, 'before'.length);
            });

            it('in the end', function () {
               test('after', 'afteri', {
                  before: 'after',
                  input: 'i',
                  after: ''
               }, 'after'.length);
            });

         });

         describe('insert string', function () {

            it('at the beginning', function () {
               test('before', 'inputbefore', {
                  before: '',
                  input: 'input',
                  after: 'before'
               }, 0);
            });

            it('in the middle', function () {
               test('beforeafter', 'beforeinputafter', {
                  before: 'before',
                  input: 'input',
                  after: 'after'
               }, 'before'.length);
            });

            it('in the end', function () {
               test('after', 'afterinput', {
                  before: 'after',
                  input: 'input',
                  after: ''
               }, 'after'.length);
            });

         });

         describe('remove char use delete button', function () {

            it('at the beginning', function () {
               test('ibefore', 'before', {
                  before: '',
                  input: '',
                  after: 'before'
               }, 0);
            });

            it('in the middle', function () {
               test('beforeiafter', 'beforeafter', {
                  before: 'before',
                  input: '',
                  after: 'after'
               }, 'before'.length);
            });

            it('in the end', function () {
               test('afteri', 'after', {
                  before: 'after',
                  input: '',
                  after: ''
               }, 'after'.length);
            });

         });

         describe('remove char use backspace button', function () {

            it('at the beginning', function () {
               test('ibefore', 'before', {
                  before: '',
                  input: '',
                  after: 'before'
               }, 1);
            });

            it('in the middle', function () {
               test('beforeiafter', 'beforeafter', {
                  before: 'before',
                  input: '',
                  after: 'after'
               }, 'before'.length + 1);
            });

            it('in the end', function () {
               test('afteri', 'after', {
                  before: 'after',
                  input: '',
                  after: ''
               }, 'after'.length + 1);
            });

         });

         describe('remove string', function () {

            it('at the beginning', function () {
               test('inputbefore', 'before', {
                  before: '',
                  input: '',
                  after: 'before'
               }, 0, 'input'.length);
            });

            it('in the middle', function () {
               test('beforeinputafter', 'beforeafter', {
                  before: 'before',
                  input: '',
                  after: 'after'
               }, 'before'.length, 'input'.length);
            });

            it('in the end', function () {
               test('afterinput', 'after', {
                  before: 'after',
                  input: '',
                  after: ''
               }, 'after'.length, 'input'.length);
            });

         });

         describe('replace char', function () {

            it('at the beginning', function () {
               test('ibefore', 'Ibefore', {
                  before: '',
                  input: 'I',
                  after: 'before'
               }, 0, 1);
            });

            it('in the middle', function () {
               test('beforeiafter', 'beforeIafter', {
                  before: 'before',
                  input: 'I',
                  after: 'after'
               }, 'before'.length, 1);
            });

            it('in the end', function () {
               test('afteri', 'afterI', {
                  before: 'after',
                  input: 'I',
                  after: ''
               }, 'after'.length, 1);
            });

         });

         describe('replace string', function () {

            it('at the beginning', function () {
               test('inputbefore', 'INPUTbefore', {
                  before: '',
                  input: 'INPUT',
                  after: 'before'
               }, 0, 'input'.length);
            });

            it('in the middle', function () {
               test('beforeinputafter', 'beforeINPUTafter', {
                  before: 'before',
                  input: 'INPUT',
                  after: 'after'
               }, 'before'.length, 'input'.length);
            });

            it('in the end', function () {
               test('afterinput', 'afterINPUT', {
                  before: 'after',
                  input: 'INPUT',
                  after: ''
               }, 'after'.length, 'input'.length);
            });

         });

      });
   })
});