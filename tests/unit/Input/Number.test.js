define(
   [
      'Core/Control',
      'js!Controls/Input/Number'
   ],
   function(Control, NumberTextBox) {

      'use strict';

      var
         numberTextBox;

      //Создание NumberTextBox с переданными опциями и добавление его в вёрстку
      function createNumberTextBox(options) {
         return Control.createControl(NumberTextBox, {
            onlyPositive: options.onlyPositive,
            integersLength: options.integersLength,
            precision: options.precision
         }, $('<div id="NumberTextBox__test"></div>').appendTo('#mocha'));
      }

      describe('WSControls.Input.Number', function() {
         describe('Restrictions check', function() {
            beforeEach(function () {
               numberTextBox = createNumberTextBox({
                  onlyPositive: true,
                  integersLength: 5,
                  precision: 5
               });
            });
            afterEach(function () {
               numberTextBox.destroy();
            });

            //Проверим что в начало стоки нельзя вставить минус при onlyPositive: true
            it('Only positive values check', function () {
               var
                  inputResult;
               inputResult = numberTextBox._getInputData({
                  beforeInputValue: '',
                  inputValue: '-',
                  afterInputValue: '123'
               });
               assert.equal(inputResult.value, '123');
               assert.equal(inputResult.position, 0);
            });

            //Проверим что нельзя ввести больше указанного числа символов целой части
            it('Max integers length check', function () {
               var
                  inputResult;
               inputResult = numberTextBox._getInputData({
                  beforeInputValue: '12 345',
                  inputValue: '6',
                  afterInputValue: ''
               });
               assert.equal(inputResult.value, '12 345');
               assert.equal(inputResult.position, 6);
            });

            //Проверим что нельзя ввести больше указанного числа символов дробной части
            it('Max decimals length check', function () {
               var
                  inputResult;
               inputResult = numberTextBox._getInputData({
                  beforeInputValue: '0.12345',
                  inputValue: '6',
                  afterInputValue: ''
               });
               assert.equal(inputResult.value, '0.12345');
               assert.equal(inputResult.position, 7);
            });

            //Проверим что нельзя ввести точку, если precision: 0
            it('Forbid dot if zero precision', function () {
               var
                  inputResult;

               //В отдельную группу выносить не логично, но нужно чтобы numberTextBox создался с precision: 0
               numberTextBox.destroy();
               numberTextBox = createNumberTextBox({
                  precision: 0
               });

               inputResult = numberTextBox._getInputData({
                  beforeInputValue: '12',
                  inputValue: '.',
                  afterInputValue: ''
               });
               assert.equal(inputResult.value, '12');
               assert.equal(inputResult.position, 2);
            });

            //Проверим что при вводе точки в начало строки будет '0.'
            it('Inserting a dot at the beginning of a line results in \'0.\'', function () {
               var
                  inputResult;
               inputResult = numberTextBox._getInputData({
                  beforeInputValue: '',
                  inputValue: '.',
                  afterInputValue: ''
               });
               assert.equal(inputResult.value, '0.');
               assert.equal(inputResult.position, 2);
            });
         });
      });
   }
);