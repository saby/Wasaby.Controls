define(['wml!Controls/Search/MissSpell'], function(missSpellTpl) {
   
   describe('Controls.Search.MissSpell', function() {
      
      it('checkTpl', function() {
         var options = {
            caption: 'testCaption'
         };
         var wmlString = '<div class="controlsV-MissSpell"><span class="controlsV-MissSpell__text">Возможно, вы имели в виду&nbsp;</span><span class="controlsV-MissSpell__caption">testCaption</span></div>'
         assert.equal(wmlString, missSpellTpl({_options: options}));
      });
      
   });
   
});