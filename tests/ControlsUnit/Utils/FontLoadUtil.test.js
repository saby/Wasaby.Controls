define(['Controls/Utils/FontLoadUtil'], function(FontLoadUtil) {

   describe('Controls/Utils/FontLoadUtil', function() {

      it('waitForFontLoad should load font once', function() {
         const sandBox = sinon.createSandbox();

         return new Promise(function(resolve) {
            sandBox.replace(FontLoadUtil._private, 'isLoaded', () => true);
            FontLoadUtil.waitForFontLoad('test').addCallback(function() {
               assert.isTrue(FontLoadUtil.__loadedFonts.test);
               sandBox.restore();
               resolve();
            });
         });
      });

   });

});
