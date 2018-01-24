define(
   [
      'Core/Control',
      'Controls/Input/Number',
      'Core/helpers/Function/runDelayed',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function (Control, NumberControl, runDelayed, SyntheticEvent) {

      'use strict';

      //Скипнем тесты до выполнения задачи: https://online.sbis.ru/opendoc.html?guid=d74685f2-a152-4e4a-8b77-040bee5e4c27
      describe.skip('Controls.Input.Number', function () {
         var
            testCases = [
               //Проверим что нельзя вставить букву в целую часть
               {
                  testName: 'Only numbers in integers check',
                  controlConfig: {
                  },
                  initialInputRenderState: {
                     _value: '12',
                     _selection: {
                        selectionStart: 2,
                        selectionEnd: 2
                     }
                  },
                  targetConfig: {
                     value: '12a',
                     selectionEnd: 3
                  },
                  finalValue: '12'
               },

               //Проверим что нельзя вставить букву в дробную часть
               {
                  testName: 'Only numbers in decimals check',
                  controlConfig: {
                  },
                  initialInputRenderState: {
                     _value: '12.3',
                     _selection: {
                        selectionStart: 4,
                        selectionEnd: 4
                     }
                  },
                  targetConfig: {
                     value: '12.3a',
                     selectionEnd: 5
                  },
                  finalValue: '12.3'
               },

               //Проверим что в начало стоки нельзя вставить минус при onlyPositive: true
               {
                  testName: 'Only positive values check',
                  controlConfig: {
                     onlyPositive: true
                  },
                  initialInputRenderState: {
                     _value: '123',
                     _selection: {
                        selectionStart: 0,
                        selectionEnd: 0
                     }
                  },
                  targetConfig: {
                     value: '-123',
                     selectionEnd: 1
                  },
                  finalValue: '123'
               },

               //Проверим что нельзя ввести больше указанного числа символов целой части
               {
                  testName: 'Max integers length check',
                  controlConfig: {
                     integersLength: 5
                  },
                  initialInputRenderState: {
                     _value: '12 345',
                     _selection: {
                        selectionStart: 7,
                        selectionEnd: 7
                     }
                  },
                  targetConfig: {
                     value: '12 3456',
                     selectionEnd: 8
                  },
                  finalValue: '12 345'
               },

               //Проверим что нельзя ввести больше указанного числа символов дробной части
               {
                  testName: 'Max decimals length check',
                  controlConfig: {
                     precision: 5
                  },
                  initialInputRenderState: {
                     _value: '0.12345',
                     _selection: {
                        selectionStart: 7,
                        selectionEnd: 7
                     }
                  },
                  targetConfig: {
                     value: '0.123456',
                     selectionEnd: 8
                  },
                  finalValue: '0.12345'
               },

               //Проверим что нельзя ввести точку, если precision: 0
               {
                  testName: 'Forbid dot if zero precision',
                  controlConfig: {
                     precision: 0
                  },
                  initialInputRenderState: {
                     _value: '12',
                     _selection: {
                        selectionStart: 2,
                        selectionEnd: 2
                     }
                  },
                  targetConfig: {
                     value: '12.',
                     selectionEnd: 3
                  },
                  finalValue: '12'
               },

               //Проверим что при вводе точки в начало строки будет '0.'
               {
                  testName: 'Inserting a dot at the beginning of a line results in \'0.\'',
                  controlConfig: {
                  },
                  initialInputRenderState: {
                     _value: '',
                     _selection: {
                        selectionStart: 0,
                        selectionEnd: 0
                     }
                  },
                  targetConfig: {
                     value: '.',
                     selectionEnd: 1
                  },
                  finalValue: '0.'
               },

               //При попытке удалить пробел происходит удаление символа левее него и сдвиг курсора влево
               {
                  testName: 'Delete space operation removes symbol before space and moves cursor left',
                  controlConfig: {
                  },
                  initialInputRenderState: {
                     _value: '123 456',
                     _selection: {
                        selectionStart: 4,
                        selectionEnd: 4
                     }
                  },
                  targetConfig: {
                     value: '123456',
                     selectionEnd: 3
                  },
                  finalValue: '12 456'
               },

               //Проверим что при вводе вместо точки запятой или буквы "б" или буквы "ю" - они будут заменены
               //Достаточно проверить что один символ из набора заменяется на точку. Проверка остальных символов будет излишней
               {
                  testName: 'Symbols ",", "б", "ю", "Б", "Ю" are replacing by dot',
                  controlConfig: {
                  },
                  initialInputRenderState: {
                     _value: '123',
                     _selection: {
                        selectionStart: 3,
                        selectionEnd: 3
                     }
                  },
                  targetConfig: {
                     value: '123б',
                     selectionEnd: 4
                  },
                  finalValue: '123.'
               }
            ];

         testCases.forEach(function(item) {
            it(item.testName, function (done) {
               if (typeof document === 'undefined') {
                  this.skip();
               }

               var
                  container = document.createElement('div'),
                  numberControl = Control.createControl(NumberControl, item.controlConfig, container),
                  stateItem;

               document.getElementById('mocha').append(container);

               //Используем runDelayed, т.к. без него мы не сможем добраться до дочернего inputRender
               runDelayed(function () {
                  var
                     inputRender = numberControl._children['inputRender'];

                  //Выставляем начальное состояние inputRender
                  for (stateItem in item.initialInputRenderState) {
                     if (item.initialInputRenderState.hasOwnProperty(stateItem)) {
                        inputRender[stateItem] = item.initialInputRenderState[stateItem];
                     }
                  }

                  //Добавляем в target метод setSelectionRange для того чтобы не было exeption
                  item.targetConfig.setSelectionRange = function() {};

                  inputRender._inputHandler(new SyntheticEvent({
                     inputType: 'insertText',
                     target: item.targetConfig
                  }));

                  try {
                     assert.equal(inputRender._value, item.finalValue);
                     done();
                  } catch(err) {
                     done(err);
                  } finally {
                     numberControl.destroy();
                  }
               });
            });
         });

         //Тест вставки значекния методом paste
         it('Insert with paste method', function (done) {
            //Пока так. Нужно переписать тесты без работы с DOM
            if (typeof $ === 'undefined') {
               this.skip();
            }

            var
               numberControl = Control.createControl(NumberControl, {}, $('<div></div>').appendTo('#mocha'));

            runDelayed(function () {
               var
                  inputRender = numberControl._children['inputRender'];

               inputRender._value = '123';
               inputRender._selection = {
                  selectionStart: 3,
                  selectionEnd: 3
               };

               inputRender.paste('4');

               try {
                  assert.equal(inputRender._value, '1 234');
                  done();
               } catch (err) {
                  done(err);
               } finally {
                  numberControl.destroy();
               }
            });
         });
      });
   }
);