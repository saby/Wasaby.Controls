define(
   [
      'Controls/Input/Number/SplitValueHelper'
   ],
   function(SplitValueHelper) {

      'use strict';

      describe('Controls.Input.Number.SplitValueHelper', function() {
         it('isInDecimalsPart', function() {
            var
               splitValueHelper = new SplitValueHelper({
                  before: '123.45',
                  insert: '',
                  after: '67',
                  delete: ''
               }),
               res = splitValueHelper.isInDecimalsPart();

            assert.isTrue(res);
         });

         it('isInIntegersPart', function() {
            var
               splitValueHelper = new SplitValueHelper({
                  before: '12',
                  insert: '',
                  after: '3.45',
                  delete: ''
               }),
               res = splitValueHelper.isInIntegersPart();

            assert.isTrue(res);
         });

         it('isAtLineStart', function() {
            var
               splitValueHelper = new SplitValueHelper({
                  before: '',
                  insert: '',
                  after: '123.45',
                  delete: ''
               }),
               res = splitValueHelper.isAtLineStart();

            assert.isTrue(res);
         });

         it('isAtLineEnd', function() {
            var
               splitValueHelper = new SplitValueHelper({
                  before: '123.45',
                  insert: '',
                  after: '',
                  delete: ''
               }),
               res = splitValueHelper.isAtLineEnd();

            assert.isTrue(res);
         });

         it('isEmptyField', function() {
            var
               splitValueHelper = new SplitValueHelper({
                  before: '',
                  insert: '',
                  after: '',
                  delete: ''
               }),
               res = splitValueHelper.isEmptyField();

            assert.isTrue(res);
         });

         it('hasDot', function() {
            var
               splitValueHelper = new SplitValueHelper({
                  before: '123.45',
                  insert: '',
                  after: '67',
                  delete: ''
               }),
               res = splitValueHelper.hasDot();

            assert.isTrue(res);
         });
      });
   }
);
