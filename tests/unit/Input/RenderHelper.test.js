define(
   [
      'Controls/Input/resources/RenderHelper'
   ],
   function(RenderHelper) {
      
      'use strict';
      
      describe('Controls.Input.RenderHelper', function() {
         var
            value = '0123456789',
            inputWord = 'qwerty',
            inputChar = 'a',
            positionCenter = 4,
            emptySelection = {
               selectionStart: 0,
               selectionEnd: 0
            },
            testSelection = {
               selectionStart: 0,
               selectionEnd: 1
            },
            inputType, splitInputValue;

         it('getAdaptiveInputType', function() {
            
            //Ввод с клавиатуры.
            inputType = RenderHelper.getAdaptiveInputType('insertText', emptySelection);
            assert.equal(inputType, 'insert');
            
            //Вставка из буфера.
            inputType = RenderHelper.getAdaptiveInputType('insertFromPaste', emptySelection);
            assert.equal(inputType, 'insert');
            
            //Перемещение.
            inputType = RenderHelper.getAdaptiveInputType('insertFromDrop', emptySelection);
            assert.equal(inputType, 'insertFromDrop');
            
            //Удаление с помощью клавиши backspace.
            inputType = RenderHelper.getAdaptiveInputType('deleteContentBackward', emptySelection);
            assert.equal(inputType, 'deleteBackward');
            
            //Удаление с помощью клавиши delete.
            inputType = RenderHelper.getAdaptiveInputType('deleteContentForward', emptySelection);
            assert.equal(inputType, 'deleteForward');
            
            //Удаление с помощью сочетания клавиш ctrl + backspace.
            inputType = RenderHelper.getAdaptiveInputType('deleteWordBackward', emptySelection);
            assert.equal(inputType, 'deleteBackward');
            
            //Удаление с помощью сочетания клавиш ctrl + delete.
            inputType = RenderHelper.getAdaptiveInputType('deleteWordForward', emptySelection);
            assert.equal(inputType, 'deleteForward');
            
            //Удаление с помощью клавиши backspace c выделением.
            inputType = RenderHelper.getAdaptiveInputType('deleteContentBackward', testSelection);
            assert.equal(inputType, 'delete');
            
            //Удаление с помощью клавиши delete c выделением.
            inputType = RenderHelper.getAdaptiveInputType('deleteContentForward', testSelection);
            assert.equal(inputType, 'delete');
            
            //Удаление с помощью сочетания клавиш ctrl + backspace c выделением.
            inputType = RenderHelper.getAdaptiveInputType('deleteWordBackward', testSelection);
            assert.equal(inputType, 'delete');
            
            //Удаление с помощью сочетания клавиш ctrl + delete c выделением.
            inputType = RenderHelper.getAdaptiveInputType('deleteWordForward', testSelection);
            assert.equal(inputType, 'delete');
            
         });

         it('getInputType', function() {

            //Ввод символа в начало.
            inputType = RenderHelper.getInputType(value, inputChar + value, 1, {
               selectionStart: 0,
               selectionEnd: 0
            });
            assert.equal(inputType, 'insert');

            //Ввод символа в середину.
            inputType = RenderHelper.getInputType(value, value.substring(0, positionCenter) + inputChar + value.substring(positionCenter), positionCenter + 1, {
               selectionStart: positionCenter,
               selectionEnd: positionCenter
            });
            assert.equal(inputType, 'insert');

            //Ввод символа в конец.
            inputType = RenderHelper.getInputType(value, value + inputChar, value.length + 1, {
               selectionStart: value.length,
               selectionEnd: value.length
            });
            assert.equal(inputType, 'insert');

            //Вставка слова в начало.
            inputType = RenderHelper.getInputType(value, inputWord + value, inputWord.length, {
               selectionStart: 0,
               selectionEnd: 0
            });
            assert.equal(inputType, 'insert');

            //Вставка слова в середину.
            inputType = RenderHelper.getInputType(value, value.substring(0, positionCenter) + inputWord + value.substring(positionCenter), positionCenter + inputWord.length, {
               selectionStart: positionCenter,
               selectionEnd: positionCenter
            });
            assert.equal(inputType, 'insert');

            //Вставка слова в конец.
            inputType = RenderHelper.getInputType(value, value + inputWord, value.length + inputWord.length, {
               selectionStart: value.length,
               selectionEnd: value.length
            });
            assert.equal(inputType, 'insert');

            //Удаление первого символа с помощью backspace.
            inputType = RenderHelper.getInputType(value, value.substring(1), 0, {
               selectionStart: 1,
               selectionEnd: 1
            });
            assert.equal(inputType, 'deleteBackward');

            //Удаление символа середины с помощью backspace.
            inputType = RenderHelper.getInputType(value, value.substring(0, positionCenter - 1) + value.substring(positionCenter), positionCenter - 1, {
               selectionStart: positionCenter,
               selectionEnd: positionCenter
            });
            assert.equal(inputType, 'deleteBackward');

            //Удаление последнего символа с помощью backspace.
            inputType = RenderHelper.getInputType(value, value.substring(0, value.length - 1), value.length - 1, {
               selectionStart: value.length,
               selectionEnd: value.length
            });
            assert.equal(inputType, 'deleteBackward');

            //Удаление первого символа с помощью delete.
            inputType = RenderHelper.getInputType(value, value.substring(1), 0, {
               selectionStart: 0,
               selectionEnd: 0
            });
            assert.equal(inputType, 'deleteForward');

            //Удаление символа середины с помощью delete.
            inputType = RenderHelper.getInputType(value, value.substring(0, positionCenter - 1) + value.substring(positionCenter), positionCenter, {
               selectionStart: positionCenter,
               selectionEnd: positionCenter
            });
            assert.equal(inputType, 'deleteForward');

            //Удаление последнего символа с помощью delete.
            inputType = RenderHelper.getInputType(value, value.substring(0, value.length - 1), value.length, {
               selectionStart: value.length,
               selectionEnd: value.length
            });
            assert.equal(inputType, 'deleteForward');

            //Удаление слова с помощью его выделения и backspace(delete).
            inputType = RenderHelper.getInputType(value, '', 0, {
               selectionStart: 0,
               selectionEnd: value.length
            });
            assert.equal(inputType, 'delete');

         });

         describe('getSplitInputValue', function() {
            it('auto-complete', function() {
               splitInputValue = RenderHelper.getSplitInputValue('test test', 'test', 9, {
                  selectionStart: 0,
                  selectionEnd: 0
               }, 'insert');

               assert.deepEqual(splitInputValue, {
                  before: '',
                  insert: 'test',
                  delete: 'test test',
                  after: ''
               });
            });

            it('Ввод 0. Состояние текста |', function() {
               splitInputValue = RenderHelper.getSplitInputValue('', '0', 1, {
                  selectionStart: 0,
                  selectionEnd: 0
               }, 'insert');

               assert.deepEqual(splitInputValue, {
                  before: '',
                  insert: '0',
                  delete: '',
                  after: ''
               });
            });

            it('Ввод 3. Состояние текста 0|', function() {
               splitInputValue = RenderHelper.getSplitInputValue('0', '03', 2, {
                  selectionStart: 1,
                  selectionEnd: 1
               }, 'insert');

               assert.deepEqual(splitInputValue, {
                  before: '0',
                  insert: '3',
                  delete: '',
                  after: ''
               });
            });

            it('Ввод 2. Состояние текста 0|3', function() {
               splitInputValue = RenderHelper.getSplitInputValue('03', '023', 2, {
                  selectionStart: 1,
                  selectionEnd: 1
               }, 'insert');

               assert.deepEqual(splitInputValue, {
                  before: '0',
                  insert: '2',
                  delete: '',
                  after: '3'
               });
            });

            it('Вставка -2-1. Состояние текста |023', function() {
               splitInputValue = RenderHelper.getSplitInputValue('023', '-2-1023', 4, {
                  selectionStart: 0,
                  selectionEnd: 0
               }, 'insert');

               assert.deepEqual(splitInputValue, {
                  before: '',
                  insert: '-2-1',
                  delete: '',
                  after: '023'
               });
            });

            it('Вставка -1012. Состояние текста -2|-102|3', function() {
               splitInputValue = RenderHelper.getSplitInputValue('-2-1023', '-2-10123', 7, {
                  selectionStart: 2,
                  selectionEnd: 6
               }, 'insert');

               assert.deepEqual(splitInputValue, {
                  before: '-2',
                  insert: '-1012',
                  delete: '-102',
                  after: '3'
               });
            });

            it('Удаление текста ctrl + delete. Состояние текста |-2-10123', function() {
               splitInputValue = RenderHelper.getSplitInputValue('-2-10123', '-10123', 0, {
                  selectionStart: 0,
                  selectionEnd: 0
               }, 'deleteForward');

               assert.deepEqual(splitInputValue, {
                  before: '',
                  insert: '',
                  delete: '-2',
                  after: '-10123'
               });
            });

            it('Удаление текста ctrl + backspace. Состояние текста -2-10123|', function() {
               splitInputValue = RenderHelper.getSplitInputValue('-2-10123', '-2-', 3, {
                  selectionStart: 8,
                  selectionEnd: 8
               }, 'deleteBackward');

               assert.deepEqual(splitInputValue, {
                  before: '-2-',
                  insert: '',
                  delete: '10123',
                  after: ''
               });
            });

            it('Удаление текста. Состояние текста -2|-101|23', function() {
               splitInputValue = RenderHelper.getSplitInputValue('-2-10123', '-223', 2, {
                  selectionStart: 2,
                  selectionEnd: 6
               }, 'delete');

               assert.deepEqual(splitInputValue, {
                  before: '-2',
                  insert: '',
                  delete: '-101',
                  after: '23'
               });
            });

            it('Проверка перемещения текста перетаскиванием. Тип insertFromDrop', function() {
               splitInputValue = RenderHelper.getSplitInputValue('12345', '51234', 1, {
                  selectionStart: 4,
                  selectionEnd: 4
               }, 'insertFromDrop');

               assert.deepEqual(splitInputValue, {
                  before: '5',
                  insert: '',
                  delete: '',
                  after: '1234'
               });
            });

            it('autocomplete insert', function() {
               splitInputValue = RenderHelper.getSplitInputValue('123', '456789', 6, {
                  selectionStart: 3,
                  selectionEnd: 3
               }, 'insert');

               assert.deepEqual(splitInputValue, {
                  before: '',
                  insert: '456789',
                  delete: '123',
                  after: ''
               });
            });
         });
      });
   }
);