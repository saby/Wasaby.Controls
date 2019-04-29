define(
   [
      'Core/core-merge',
      'Env/Env',
      'Controls/input',
      'unit/Calendar/Utils'
   ],
   function(coreMerge, Env, input, testUtils) {

      'use strict';

      let createComponent = function(Component, cfg) {
         let cmp;
         if (Component.getDefaultOptions) {
            cfg = coreMerge(cfg, Component.getDefaultOptions(), {preferSource: true});
         }
         cmp = new Component(cfg);
         cmp.saveOptions(cfg);
         cmp._beforeMount(cfg);
         return cmp;
      };

      describe('Controls.Input.Mask', function() {
         it('findLastUserEnteredCharPosition', function() {
            var findLastUserEnteredCharPosition = input.Mask._private.findLastUserEnteredCharPosition;

            assert.equal(findLastUserEnteredCharPosition('12.34.56', ' '), 8);
            assert.equal(findLastUserEnteredCharPosition('12.34.  ', ' '), 6);
            assert.equal(findLastUserEnteredCharPosition('12.34.56', ''), 8);
            assert.equal(findLastUserEnteredCharPosition('12.34.', ''), 6);
         });

         it('validateReplacer', function() {
            var message = '';
            var error = Env.IoC.resolve('ILogger').error;
            var validateReplacer = input.Mask._private.validateReplacer;

            Env.IoC.resolve('ILogger').error = function(arg1, arg2) {
               message = arg1 + ': ' + arg2;
            };

            assert.equal(validateReplacer('', 'dd.dd'), true);
            assert.equal(message, '');
            assert.equal(validateReplacer(' ', 'dd.dd'), true);
            assert.equal(message, '');
            assert.equal(validateReplacer('', 'd\\*'), true);
            assert.equal(message, '');
            assert.equal(validateReplacer(' ', 'd\\*'), false);
            assert.equal(message, 'Mask: Used not empty replacer and mask with quantifiers. More on https://wi.sbis.ru/docs/js/Controls/_input/Mask/options/replacer/');

            Env.IoC.resolve('ILogger').error = error;
         });

         it('calcReplacer', function() {
            var calcReplacer = input.Mask._private.calcReplacer;

            assert.equal(calcReplacer(' ', 'dd.dd'), ' ');
            assert.equal(calcReplacer(' ', 'd\\*'), '');
         });

         describe('_focusInHandler', function() {
            it('should set default selection position', function(done) {
               var component = createComponent(input.Mask, {mask: 'dd.dd', replacer: ' '});
               component._viewModel.selection = {
                    start: 3,
                    end: 3
               }
               component._getField = function() {
                  return {
                     setSelectionRange: function(start, end) {
                        assert.equal(start, 0);
                        assert.equal(end, 0);
                        done();
                     }
                  }
               }
               component._focusInHandler();
               assert.deepEqual(
                  component._viewModel.selection,
                  {
                    start: 0,
                    end: 0
                  }
               );
            });
         });
      });
   }
);
