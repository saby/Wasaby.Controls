define(
   [
      'Core/Control',
      'js!WSControls/Input/Text',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function(Control, Text, SyntheticEvent) {

      'use strict';

      let text, isChangeText;

      describe.skip('WSControls.Input.Text', function() {
         describe('Events', function() {
            beforeEach(() => {
               text = Control.createControl(Text, {
                  text: '0123456789',
                  inputRegExp: '[0-9]',
                  tooltip: 'Поле ввода чисел'
               }, $('<div id="Text__test"></div>').appendTo('#mocha')).subscribe('onChangeValue', () => {
                  isChangeText = true;
               });
            });
            afterEach(() => {
               text.destroy();
            });

            describe('input', function() {
               beforeEach(() => {
                  text._text = '0123456789';
                  isChangeText = false;
               });
               it('Ввод 0 в начало', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 0,
                        selectionEnd: 0
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 1,
                        value: '00123456789'
                     }
                  }));
                  assert.equal(text._text, '00123456789');
                  assert.isTrue(isChangeText);
               });
               it('Ввод 0 в середину', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 5,
                        selectionEnd: 5
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 6,
                        value: '01234056789'
                     }
                  }));
                  assert.equal(text._text, '01234056789');
                  assert.isTrue(isChangeText);
               });
               it('Ввод 0 в конец', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 10,
                        selectionEnd: 10
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 11,
                        value: '01234567890'
                     }
                  }));
                  assert.equal(text._text, '01234567890');
                  assert.isTrue(isChangeText);
               });
               it('Ввод A в начало', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 0,
                        selectionEnd: 0
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 1,
                        value: 'A0123456789'
                     }
                  }));
                  assert.equal(text._text, '0123456789');
                  assert.isTrue(!isChangeText);
               });
               it('Ввод A в середину', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 5,
                        selectionEnd: 5
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 6,
                        value: '01234A56789'
                     }
                  }));
                  assert.equal(text._text, '0123456789');
                  assert.isTrue(!isChangeText);
               });
               it('Ввод A в конец', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 10,
                        selectionEnd: 10
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 11,
                        value: '0123456789A'
                     }
                  }));
                  assert.equal(text._text, '0123456789');
                  assert.isTrue(!isChangeText);
               });
               it('Вставка(перемещение) A0B1C2D3E4F5 в начало', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 0,
                        selectionEnd: 0
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 12,
                        value: 'A0B1C2D3E4F50123456789'
                     }
                  }));
                  assert.equal(text._text, '0123450123456789');
                  assert.isTrue(isChangeText);
               });
               it('Вставка(перемещение) A0B1C2D3E4F5 в середину', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 5,
                        selectionEnd: 5
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 17,
                        value: '01234A0B1C2D3E4F556789'
                     }
                  }));
                  assert.equal(text._text, '0123401234556789');
                  assert.isTrue(isChangeText);
               });
               it('Вставка(перемещение) A0B1C2D3E4F5 в конец', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 10,
                        selectionEnd: 10
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 22,
                        value: '0123456789A0B1C2D3E4F5'
                     }
                  }));
                  assert.equal(text._text, '0123456789012345');
                  assert.isTrue(isChangeText);
               });
               it('Вставка A0B1C2D3E4F5 с выделением 3 символов в начало', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 0,
                        selectionEnd: 3
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 12,
                        value: 'A0B1C2D3E4F53456789'
                     }
                  }));
                  assert.equal(text._text, '0123453456789');
                  assert.isTrue(isChangeText);
               });
               it('Вставка A0B1C2D3E4F5 с выделением 3 символов в середину', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 4,
                        selectionEnd: 7
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 16,
                        value: '0123A0B1C2D3E4F5789'
                     }
                  }));
                  assert.equal(text._text, '0123012345789');
                  assert.isTrue(isChangeText);
               });
               it('Вставка A0B1C2D3E4F5 с выделением 3 символов в конец', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 7,
                        selectionEnd: 10
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 19,
                        value: '0123456A0B1C2D3E4F5'
                     }
                  }));
                  assert.equal(text._text, '0123456012345');
                  assert.isTrue(isChangeText);
               });
               it('Удаление 3 символов в начале', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 0,
                        selectionEnd: 3
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 0,
                        value: '3456789'
                     },
                     inputType: 'deleteContentBackward'
                  }));
                  assert.equal(text._text, '3456789');
                  assert.isTrue(isChangeText);
               });
               it('Удаление символа в начале, при помощи backspace', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 1,
                        selectionEnd: 1
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 0,
                        value: '123456789'
                     },
                     inputType: 'deleteContentBackward'
                  }));
                  assert.equal(text._text, '123456789');
                  assert.isTrue(isChangeText);
               });
               it('Удаление символа в середине, при помощи backspace', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 6,
                        selectionEnd: 6
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 5,
                        value: '012346789'
                     },
                     inputType: 'deleteContentBackward'
                  }));
                  assert.equal(text._text, '012346789');
                  assert.isTrue(isChangeText);
               });
               it('Удаление символа в конце, при помощи backspace', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 10,
                        selectionEnd: 10
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 9,
                        value: '012345678'
                     },
                     inputType: 'deleteContentBackward'
                  }));
                  assert.equal(text._text, '012345678');
                  assert.isTrue(isChangeText);
               });
               it('Удаление символа в начале, при помощи delete', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 0,
                        selectionEnd: 0
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 0,
                        value: '123456789'
                     },
                     inputType: 'deleteContentBackward'
                  }));
                  assert.equal(text._text, '123456789');
                  assert.isTrue(isChangeText);
               });
               it('Удаление символа в середине, при помощи delete', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 5,
                        selectionEnd: 5
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 5,
                        value: '012346789'
                     },
                     inputType: 'deleteContentBackward'
                  }));
                  assert.equal(text._text, '012346789');
                  assert.isTrue(isChangeText);
               });
               it('Удаление символа в конце, при помощи delete', () => {
                  text._clickHandler(new SyntheticEvent('onclick', {
                     target: {
                        selectionStart: 9,
                        selectionEnd: 9
                     }
                  }));
                  text._inputHandler(new SyntheticEvent('oninput', {
                     target: {
                        selectionEnd: 9,
                        value: '012345678'
                     },
                     inputType: 'deleteContentBackward'
                  }));
                  assert.equal(text._text, '012345678');
                  assert.isTrue(isChangeText);
               });
            });
         });
         describe('CalcMethod', () => {
            let text = new Text({});
            it('_calcText', () => {
               assert.equal(text._calcText('TWF4aW0gWmh1cmF2bGV2', {
                  inputRegExp: '[0-9]'
               }), '40122');
               assert.equal(text._calcText('TWF4aW0gWmh1cmF2bGV2', {
                  inputRegExp: '[^0-9]'
               }), 'TWFaWgWmhcmFbGV');
               assert.equal(text._calcText(' TWF4aW0gWmh1cmF2bGV2' , {
                  inputRegExp: '[0-9 ]',
                  trim: true
               }), '40122');
               assert.equal(text._calcText(' TWF4aW0gWmh1cmF2bGV2' , {
                  trim: true
               }), 'TWF4aW0gWmh1cmF2bGV2');
            });
         });
      });
   }
);