define(
   [
      'Controls/_input/resources/InputRender/InputRender',
      'Controls/_input/resources/InputRender/InputRenderStyles'
   ],
   function(InputRender) {

      describe('Controls/_input/resources/InputRender/InputRender', function() {

         it('getInputValueForTooltip', function() {
            assert.equal(InputRender._private.getInputValueForTooltip('password', 'test'), '');
            assert.equal(InputRender._private.getInputValueForTooltip('text', 'test'), 'test');
         });

      });

   }
);
