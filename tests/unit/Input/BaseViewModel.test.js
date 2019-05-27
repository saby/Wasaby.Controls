define(
   [
      'Controls/_input/resources/InputRender/BaseViewModel'
   ],
   function(BaseViewModel) {

      'use strict';

      describe('Controls.Input.BaseViewModel', function() {
         it('handleInput', function () {
            var
               inputResult;
            inputResult = new BaseViewModel().handleInput(
               {
                  before: '12',
                  insert: 'a',
                  after: '',
                  delete: ''
               }
            );
            assert.equal(inputResult.value, '12a');
            assert.equal(inputResult.position, 3);
         });

         it('getDisplayValue', function () {
            var
               res;
            res = new BaseViewModel({
               value: 'qwe'
            }).getDisplayValue();
            assert.equal(res, 'qwe');
         });

         it('getValue', function () {
            var
               res;
            res = new BaseViewModel({
               value: 'qwe'
            }).getValue();
            assert.equal(res, 'qwe');
         });

         //Проверим что всё корректно работает, если не передавать в конструктор объект опций
         it('getDisplayValue (no options object)', function () {
            var
               res;
            res = new BaseViewModel().getDisplayValue();
            assert.equal(res, '');
         });

         it('getValue (no options object)', function () {
            var
               res;
            res = new BaseViewModel().getValue();
            assert.equal(res, '');
         });

         //Проверим что всё корректно работает, если не передавать в опциях value
         it('getDisplayValue (no value in options)', function () {
            var
               res;
            res = new BaseViewModel({}).getDisplayValue();
            assert.equal(res, '');
         });

         it('getValue (no value in options)', function () {
            var
               res;
            res = new BaseViewModel({}).getValue();
            assert.equal(res, '');
         });
      });
   }
);
