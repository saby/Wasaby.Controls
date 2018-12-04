define(
   [
      'Controls/Input/Text/ViewModel'
   ],
   function(ViewModel) {
      'use strict';

      describe('Controls.Input.Text.ViewModel', function() {
         var ctrl;

         beforeEach(function() {
            ctrl = new ViewModel({}, '');
         });
         describe('handleInput', function() {
            it('Delete part of the value.', function() {
               ctrl.handleInput({
                  before: 'test',
                  insert: '',
                  after: ' value',
                  delete: 'delete'
               }, 'delete');

               assert.equal(ctrl.value, 'test value');
               assert.equal(ctrl.displayValue, 'test value');
               assert.deepEqual(ctrl.selection, {
                  start: 4,
                  end: 4
               });
            });
            it('Insert unresolved characters.', function() {
               ctrl.options = {
                  constraint: '[0-9]'
               };
               ctrl.handleInput({
                  before: '123',
                  insert: 'test 456',
                  after: '789',
                  delete: ''
               }, 'insert');

               assert.equal(ctrl.value, '123456789');
               assert.equal(ctrl.displayValue, '123456789');
               assert.deepEqual(ctrl.selection, {
                  start: 6,
                  end: 6
               });
            });
            it('Insert a value greater than the allowed length.', function() {
               ctrl.options = {
                  maxLength: 4
               };
               ctrl.handleInput({
                  before: 'test',
                  insert: ' value',
                  after: '',
                  delete: ''
               }, 'insert');

               assert.equal(ctrl.value, 'test');
               assert.equal(ctrl.displayValue, 'test');
               assert.deepEqual(ctrl.selection, {
                  start: 4,
                  end: 4
               });
            });
         });
      });
   }
);
