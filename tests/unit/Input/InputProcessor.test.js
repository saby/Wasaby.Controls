define(
   [
      'Controls/Input/Mask/Formatter',
      'Controls/Input/Mask/FormatBuilder',
      'Controls/Input/Mask/InputProcessor'
   ],
   function(Formatter, FormatBuilder, InputProcessor) {

      'use strict';

      describe('Controls.Input.Mask.InputProcessor', function() {
         var
            replacer = ' ',
            format = FormatBuilder.getFormat('dd.dd', {
               d: '[0-9]'
            }, replacer),
            clearData = Formatter.getClearData(format, '1 . 4'),
            result;

         describe('getClearSplitValue', function() {
            it('Test_01', function() {
               result = InputProcessor.getClearSplitValue({
                  before: '1',
                  after: '. 4',
                  delete: ' ',
                  insert: '2'
               }, clearData);
               assert.deepEqual(result, {
                  before: '1',
                  after: ' 4',
                  delete: ' ',
                  insert: '2'
               });
            });
         });
         describe('input', function() {
            describe('insert', function() {
               it('Test_01', function() {
                  result = InputProcessor.input({
                     before: '1',
                     after: '.3 ',
                     delete: ' ',
                     insert: '2'
                  }, 'insert', replacer, format, format);
                  assert.deepEqual(result, {
                     value: '12. 3',
                     position: 2
                  });
               });
               it('Test_02', function() {
                  result = InputProcessor.input({
                     before: '1 . ',
                     after: '4',
                     delete: '',
                     insert: 'g2'
                  }, 'insert', replacer, format, format);
                  assert.deepEqual(result, {
                     value: '1 . 2',
                     position: 5
                  });
               });
               it('Test_03', function() {
                  var format = FormatBuilder.getFormat('dd.dd', {
                     d: '[0-9]'
                  }, '');
                  result = InputProcessor.input({
                     before: '1',
                     after: '3',
                     delete: '',
                     insert: '2'
                  }, 'insert', '', format, format);
                  assert.deepEqual(result, {
                     value: '12.3',
                     position: 2
                  });
               });
            });
            describe('delete', function() {
               it('Test_01', function() {
                  result = InputProcessor.input({
                     before: '',
                     after: '',
                     delete: '1 . 4',
                     insert: ''
                  }, 'delete', replacer, format, format);
                  assert.deepEqual(result, {
                     value: '  .  ',
                     position: 0
                  });
               });
            });
            describe('deleteForward', function() {
               it('Test_01', function() {
                  result = InputProcessor.input({
                     before: '1',
                     after: '. 4',
                     delete: '2',
                     insert: ''
                  }, 'deleteForward', replacer, format, format);
                  assert.deepEqual(result, {
                     value: '1 . 4',
                     position: 2
                  });
               });
               it('Test_02', function() {
                  result = InputProcessor.input({
                     before: '12',
                     after: '34',
                     delete: '.',
                     insert: ''
                  }, 'deleteForward', replacer, format, format);
                  assert.deepEqual(result, {
                     value: '12. 4',
                     position: 4
                  });
               });
            });
            describe('deleteBackward', function() {
               it('Test_01', function() {
                  result = InputProcessor.input({
                     before: '1',
                     after: '.34',
                     delete: '2',
                     insert: ''
                  }, 'deleteBackward', replacer, format, format);
                  assert.deepEqual(result, {
                     value: '1 .34',
                     position: 1
                  });
               });
               it('Test_02', function() {
                  result = InputProcessor.input({
                     before: '12',
                     after: '34',
                     delete: '.',
                     insert: ''
                  }, 'deleteBackward', replacer, format, format);
                  assert.deepEqual(result, {
                     value: '1 .34',
                     position: 1
                  });
               });
            });
         });
      });
   }
);