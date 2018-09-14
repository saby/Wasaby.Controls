define(
   [
      'Controls/Input/resources/InputRender/InputRender',
      'Controls/Input/resources/InputRender/InputRenderStyles'
   ],
   function(InputRender) {
   
      describe('Controls.Input.resources.InputRender.InputRender', function() {
         
         it('getInputValueForTooltip', function() {
            assert.equal(InputRender._private.getInputValueForTooltip('password', 'test'), '');
            assert.equal(InputRender._private.getInputValueForTooltip('text', 'test'), 'test');
         });
         
      });
      
   }
);
