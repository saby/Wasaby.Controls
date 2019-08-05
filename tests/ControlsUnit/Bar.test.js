define([
   'Controls/progress'
], function(progress) {
   describe('Controls.progress:Bar', function() {
      it('getWidth', function() {
         var pb, width;
         pb = new progress.Bar({});

         width = pb._getWidth(0);
         assert.equal('0px', width, 'getWidth test case 1: WrongResult');

         width = pb._getWidth(-10);
         assert.equal('0px', width, 'getWidth test case 2: WrongResult');

         width = pb._getWidth(10);
         assert.equal('10%', width, 'getWidth test case 3: WrongResult');

         width = pb._getWidth(100);
         assert.equal('100%', width, 'getWidth test case 4: WrongResult');

         width = pb._getWidth(150);
         assert.equal('100%', width, 'getWidth test case 5: WrongResult');
      });
   })
});
