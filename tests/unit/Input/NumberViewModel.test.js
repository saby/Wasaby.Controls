define(
   [
      'Core/Control',
      'Controls/Input/Number/ViewModel'
   ],
   function(Control, NumberViewModel) {

      'use strict';

      describe('WSControls.Input.Number', function() {
         describe('Restrictions check', function() {
            //Проверим что нельзя вставить букву в целую часть
            it('Only numbers in integers check', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
               }).prepareData(
                  {
                     before: '12',
                     insert: 'a',
                     after: '',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '12');
               assert.equal(inputResult.position, 2);
            });

            //Проверим что нельзя вставить букву в дробную часть
            it('Only numbers in decimals check', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
               }).prepareData(
                  {
                     before: '12.3',
                     insert: 'a',
                     after: '',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '12.3');
               assert.equal(inputResult.position, 4);
            });

            //Проверим что в начало стоки нельзя вставить минус при onlyPositive: true
            it('Only positive values check', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
                  onlyPositive: true
               }).prepareData(
                  {
                     before: '',
                     insert: '-',
                     after: '123',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '123');
               assert.equal(inputResult.position, 0);
            });

            //Проверим что нельзя ввести больше указанного числа символов целой части
            it('Max integers length check', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
                  integersLength: 5
               }).prepareData(
                  {
                     before: '12 345',
                     insert: '6',
                     after: '',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '12 345');
               assert.equal(inputResult.position, 6);
            });

            //Проверим что нельзя ввести больше указанного числа символов дробной части
            it('Max decimals length check', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
                  precision: 5
               }).prepareData(
                  {
                     before: '0.12345',
                     insert: '6',
                     after: '',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '0.12345');
               assert.equal(inputResult.position, 7);
            });

            //Проверим что нельзя ввести точку, если precision: 0
            it('Forbid dot if zero precision', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
                  precision: 0
               }).prepareData(
                  {
                     before: '12',
                     insert: '.',
                     after: '',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '12');
               assert.equal(inputResult.position, 2);
            });

            //Проверим что при вводе точки в начало строки будет '0.'
            it('Inserting a dot at the beginning of a line results in \'0.\'', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
               }).prepareData(
                  {
                     before: '',
                     insert: '.',
                     after: '',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '0.');
               assert.equal(inputResult.position, 2);
            });

            //Проверим что при вводе вместо точки запятой или буквы "б" или буквы "ю" - они будут заменены
            it('Symbols ",", "б", "ю", "Б", "Ю" are replacing by dot', function () {
               var
                  inputResult,
                  possibleInsertValuesArr = [',', 'б', 'ю', 'Б', 'Ю'];

               possibleInsertValuesArr.forEach(function(item) {
                  inputResult = new NumberViewModel({
                  }).prepareData(
                     {
                        before: '123',
                        insert: item,
                        after: '',
                        delete: ''
                     }
                  );
                  assert.equal(inputResult.value, '123.');
                  assert.equal(inputResult.position, 4);
               });
            });

            //При попытке удалить пробел происходит удаление символа левее него и сдвиг курсора влево
            it('Delete space operation removes symbol before space and moves cursor left', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
               }).prepareData(
                  {
                     before: '123',
                     insert: '',
                     after: '456',
                     delete: ' '
                  }
               );
               assert.equal(inputResult.value, '12 456');
               assert.equal(inputResult.position, 2);
            });

            //Удаление чилса перед пробелом с помощью клавиши "delete" приводит еще и к удалению пробела
            it('Deleting number before space using "delete" button', function () {
               var
                  inputResult;
               inputResult = new NumberViewModel({
               }).prepareData(
                  {
                     before: '',
                     insert: '',
                     after: ' 456',
                     delete: ''
                  }
               );
               assert.equal(inputResult.value, '456');
               assert.equal(inputResult.position, 0);
            });
         });
      });
   }
);