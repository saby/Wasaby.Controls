define(
   [
      'Core/Control',
      'Controls/Input/Number/ViewModel'
   ],
   function(Control, NumberViewModel) {

      'use strict';

      describe('Controls.Input.Number', function() {
         var
            testCases = [

               //Проверим что нельзя вставить букву в целую часть
               {
                  testName: 'Only digits allowed in integer part',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '12',
                     insert: 'a',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '12.0',
                     position: 2
                  },
                  inputType: 'insert'
               },

               //Проверим что нельзя вставить букву в дробную часть
               {
                  testName: 'Only numbers allowed in decimal part',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '12.3',
                     insert: 'a',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '12.3',
                     position: 4
                  },
                  inputType: 'insert'
               },

               //Проверим что в начало стоки нельзя вставить минус при onlyPositive: true
               {
                  testName: 'onlyPositive doesn\'t allow entering negative numbers',
                  controlConfig: {
                     onlyPositive: true
                  },
                  splitValue: {
                     before: '',
                     insert: '-',
                     after: '123',
                     delete: ''
                  },
                  result: {
                     value: '123.0',
                     position: 0
                  },
                  inputType: 'insert'
               },

               //Проверим что нельзя ввести больше указанного числа символов целой части
               {
                  testName: 'Max length integer part',
                  controlConfig: {
                     integersLength: 5
                  },
                  splitValue: {
                     before: '12 345',
                     insert: '6',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '12 345.6',
                     position: 7
                  },
                  inputType: 'insert'
               },

               //Проверим что нельзя ввести больше указанного числа символов дробной части
               {
                  testName: 'Max length decimal part',
                  controlConfig: {
                     precision: 5
                  },
                  splitValue: {
                     before: '0.12345',
                     insert: '6',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '0.12345',
                     position: 6
                  },
                  inputType: 'insert'
               },

               //Проверим что нельзя ввести точку, если precision: 0
               {
                  testName: 'No decimal part if precision is 0',
                  controlConfig: {
                     precision: 0
                  },
                  splitValue: {
                     before: '12',
                     insert: '.',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '12.0',
                     position: 2
                  },
                  inputType: 'insert'
               },

               //Проверим что при вводе точки в начало строки будет '0.'
               {
                  testName: 'Inserting a dot at the beginning of a line results in \'0.0\'',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '',
                     insert: '.',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '0.0',
                     position: 2
                  },
                  inputType: 'insert'
               },

               //При попытке удалить пробел происходит удаление символа левее него и сдвиг курсора влево
               {
                  testName: 'Delete space operation removes symbol before space and moves cursor left',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '123',
                     insert: '',
                     after: '456',
                     delete: ' '
                  },
                  result: {
                     value: '12 456',
                     position: 2
                  },
                  inputType: 'deleteBackward'
               },

               //Проверим что при вводе вместо точки запятой или буквы "б" или буквы "ю" - они будут заменены
               //Достаточно проверить что один символ из набора заменяется на точку. Проверка остальных символов будет излишней
               {
                  testName: 'Symbols ",", "б", "ю", "Б", "Ю" are replaced by dot',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '123',
                     insert: 'б',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '123.0',
                     position: 4
                  },
                  inputType: 'insert'
               },

               //Проверим что нельзя вставить вторую точку
               {
                  testName: 'Second dot is not allowed',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '123.456',
                     insert: '.',
                     after: '789',
                     delete: ''
                  },
                  result: {
                     value: '123.456789',
                     position: 7
                  },
                  inputType: 'insert'
               },

               //Проверка удаления пробела клавишей delete
               {
                  testName: 'Remove space using \'delete\' button',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '123',
                     insert: '',
                     after: '456',
                     delete: ' '
                  },
                  result: {
                     value: '12 356',
                     position: 4
                  },
                  inputType: 'deleteForward'
               }
            ];

         testCases.forEach(function(item) {
            it(item.testName, function () {
               var
                  numberViewModel = new NumberViewModel(item.controlConfig),
                  result = numberViewModel.handleInput(item.splitValue, item.inputType);

               assert.equal(result.value, item.result.value);
            });
         });

         it('getDisplayValue: only integers', function () {
            var
               numberViewModel = new NumberViewModel({
                  value: 123456
               }),
               result = numberViewModel.getDisplayValue();

            assert.equal(result, '123 456');
         });

         it('getDisplayValue: integers and decimals', function () {
            var
               numberViewModel = new NumberViewModel({
                  value: 123456.78
               }),
               result = numberViewModel.getDisplayValue();

            assert.equal(result, '123 456.78');
         });

         describe('getDisplayValue', function() {
            var getValueTests = [
               ['123456', '123 456'],
               ['-123456', '-123 456'],
               ['123.456', '123.456'],
               ['0', '0'],
               ['-', '-'],
               ['', '']
            ];

            getValueTests.forEach(function(test, i) {
               it('Test ' + i, function () {
                  var numberViewModel = new NumberViewModel({
                     value: test[0]
                  });
                  var result = numberViewModel.getDisplayValue();

                  assert.isTrue(result === test[1]);
               });
            });
         });

         it('\'0.\' wouldn\'t update if value is 0', function () {
            var
               numberViewModel = new NumberViewModel({}),
               result;

            numberViewModel.handleInput({
               before: '',
               insert: '.',
               after: '',
               delete: ' '
            });

            numberViewModel.updateOptions({
               value: 0
            });

            assert.equal(numberViewModel._options.value, '0.');
         });
      });
   }
);