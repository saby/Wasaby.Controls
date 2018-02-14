define(
   [
      'Core/Control',
      'Controls/Input/Number/ViewModel'
   ],
   function (Control, NumberViewModel) {

      'use strict';

      //Скипнем тесты до выполнения задачи: https://online.sbis.ru/opendoc.html?guid=d74685f2-a152-4e4a-8b77-040bee5e4c27
      describe('Controls.Input.Number', function () {
         var
            testCases = [
               //Проверим что нельзя вставить букву в целую часть
               {
                  testName: 'Only numbers in integers check',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '12',
                     insert: 'a',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '12',
                     position: 2
                  }
               },

               //Проверим что нельзя вставить букву в дробную часть
               {
                  testName: 'Only numbers in decimals check',
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
                  }
               },

               //Проверим что в начало стоки нельзя вставить минус при onlyPositive: true
               {
                  testName: 'Only positive values check',
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
                     value: '123',
                     position: 0
                  }
               },

               //Проверим что нельзя ввести больше указанного числа символов целой части
               {
                  testName: 'Max integers length check',
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
                     value: '12 345',
                     position: 7
                  }
               },

               //Проверим что нельзя ввести больше указанного числа символов дробной части
               {
                  testName: 'Max decimals length check',
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
                  }
               },

               //Проверим что нельзя ввести точку, если precision: 0
               {
                  testName: 'Forbid dot if zero precision',
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
                     value: '12',
                     position: 2
                  }
               },

               //Проверим что при вводе точки в начало строки будет '0.'
               {
                  testName: 'Inserting a dot at the beginning of a line results in \'0.\'',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '',
                     insert: '.',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '0.',
                     position: 2
                  }
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
                  }
               },

               //Проверим что при вводе вместо точки запятой или буквы "б" или буквы "ю" - они будут заменены
               //Достаточно проверить что один символ из набора заменяется на точку. Проверка остальных символов будет излишней
               {
                  testName: 'Symbols ",", "б", "ю", "Б", "Ю" are replacing by dot',
                  controlConfig: {
                  },
                  splitValue: {
                     before: '123',
                     insert: 'б',
                     after: '',
                     delete: ''
                  },
                  result: {
                     value: '123.',
                     position: 4
                  }
               }
            ];

         testCases.forEach(function(item) {
            it(item.testName, function () {
               var
                  numberViewModel = new NumberViewModel(item.controlConfig),
                  result = numberViewModel.prepareData(item.splitValue);

               assert.equal(result.value, item.result.value);
            });
         });
      });
   }
);