define(
   [
      'Controls/Input/Text/ViewModel'
   ],
   function(TextViewModel) {

      'use strict';

      describe('Controls.Input.Text.ViewModel', function() {
         describe('constraint', function(){

            it('[0-9]', function () {

               assert.equal(TextViewModel._private.constraint('', '[0-9]'), '');
               assert.equal(TextViewModel._private.constraint('123', '[0-9]'), '123');
               assert.equal(TextViewModel._private.constraint('a123b', '[0-9]'), '123');

            });

            it('[a-z]', function () {

               assert.equal(TextViewModel._private.constraint('123', '[a-z]'), '');
               assert.equal(TextViewModel._private.constraint('a123b', '[a-z]'), 'ab');

            });

         });

         describe('maxLength', function(){

            it('0', function () {

               assert.equal(TextViewModel._private.maxLength('123', { before: '', after: '' }, 0), '');
               assert.equal(TextViewModel._private.constraint('123', '[0-9]'), '123');
               assert.equal(TextViewModel._private.constraint('a123b', '[0-9]'), '123');

            });

            it('10', function () {

               assert.equal(TextViewModel._private.constraint('123', '[a-z]'), '');
               assert.equal(TextViewModel._private.constraint('a123b', '[a-z]'), 'ab');

            });

         });
      });
   }
);