define(['Controls/Utils/FontLoadUtil'], function(FontLoadUtil) {

   describe('Controls/Utils/FontLoadUtil', function() {

      beforeEach(function() {
         if (typeof window === 'undefined') {
            this.skip();
         }
      });

      it('waitForFontLoad should load font once', function() {
         return new Promise(function(resolve) {
            FontLoadUtil.waitForFontLoad('test').addCallback(function() {
               assert.isTrue(FontLoadUtil.__loadedFonts.test);
               resolve();
            });
         });
      });

   });

});
