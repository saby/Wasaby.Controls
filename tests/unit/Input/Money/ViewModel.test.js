define(
   [
      'Controls/Input/Money/ViewModel'
   ],
   function(ViewModel) {

      'use strict';

      describe('Controls.Input.Money.ViewModel', function() {
         var model, result;

         describe('handleInput', function() {
            beforeEach(function() {
               model = new ViewModel({});
            });

            it('test 1', function() {
               model.handleInput({
                  before: '',
                  insert: '0.00',
                  after: '',
                  delete: ''
               }, 'insert');

               assert.deepEqual(model.value, '0.00');
            });
            it('test 2', function() {
               model.handleInput({
                  before: '',
                  insert: 'a0a.a0a0a',
                  after: '',
                  delete: ''
               }, 'insert');

               assert.deepEqual(model.value, '0.00');
            });
            it('test 3', function() {
               model.handleInput({
                  before: '',
                  insert: '-',
                  after: '',
                  delete: ''
               }, 'insert');

               assert.deepEqual(model.value, '-0.00');
            });
            it('test 4', function() {
               model.handleInput({
                  before: '0',
                  insert: '.',
                  after: '.00',
                  delete: ''
               }, 'insert');

               assert.deepEqual(model.value, '0.00');
            });
            it('test 4', function() {
               model.handleInput({
                  before: '0',
                  insert: '.',
                  after: '.00',
                  delete: ''
               }, 'insert');

               assert.deepEqual(model.value, '0.00');
            });
            it('test 5', function() {
               model.handleInput({
                  before: '10',
                  insert: '10',
                  after: '.00',
                  delete: ''
               }, 'insert');

               assert.deepEqual(model.value, '1010.00');
            });
            it('test 6', function() {
               model.handleInput({
                  before: '10.',
                  insert: '10',
                  after: '.00',
                  delete: ''
               }, 'insert');

               assert.deepEqual(model.value, '10.10');
            });
            it('test 7', function() {
               model.handleInput({
                  before: '0',
                  insert: '',
                  after: '00',
                  delete: '.'
               }, 'delete');

               assert.deepEqual(model.value, '0.00');
            });
            it('test 8', function() {
               model.handleInput({
                  before: '10.9',
                  insert: '',
                  after: '',
                  delete: '9'
               }, 'delete');

               assert.deepEqual(model.value, '10.90');
            });
         });
      });
   }
);
