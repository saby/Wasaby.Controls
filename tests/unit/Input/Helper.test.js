define([
   'Controls/Input/resources/Helper'
], function(Helper){
   describe('Controls.Input.Helper', function () {

      describe('constraint', function(){

         it('[0-9]', function () {

            assert.equal(Helper.constraint('', '[0-9]'), '');
            assert.equal(Helper.constraint('123', '[0-9]'), '123');
            assert.equal(Helper.constraint('a123b', '[0-9]'), '123');

         });

         it('[a-z]', function () {

            assert.equal(Helper.constraint('123', '[a-z]'), '');
            assert.equal(Helper.constraint('a123b', '[a-z]'), 'ab');

         });

      });

      describe.skip('maxLength', function(){

         it('0', function () {

            assert.equal(Helper.maxLength('123', { before: '', after: '' }, 0), '');
            assert.equal(Helper.constraint('123', '[0-9]'), '123');
            assert.equal(Helper.constraint('a123b', '[0-9]'), '123');

         });

         it('10', function () {

            assert.equal(Helper.constraint('123', '[a-z]'), '');
            assert.equal(Helper.constraint('a123b', '[a-z]'), 'ab');

         });

      });

   })
});