define(['wml!Controls/Search/Misspell'], function(missSpellTpl) {
   
   describe('Controls.Search.Misspell', function() {
      
      it('checkTpl', function() {
         var options = {
            caption: 'testCaption'
         };
         var wmlString = '<div class="controls-Misspell"><span class="controls-Misspell__text">Возможно, вы имели в виду&nbsp;</span><span class="controls-Misspell__caption">testCaption</span></div>'
         assert.equal(wmlString, missSpellTpl({_options: options}));
      });
      
   });
   
});