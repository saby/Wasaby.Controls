define(
   ['Core/helpers/Hcontrol/compatibleConstants'],
   function(compatibleConstants) {
      describe('compatible constants', function( ) {
         it('compatibleBlacklist', function(done) {
            var fixedBlackList = compatibleConstants.compatibleBlacklist.map(function(el) {
               return ~el.indexOf(':') ? el.split(':')[0] : el;
            });
            require(fixedBlackList, function(loaded) {
               assert.isTrue(loaded !== undefined);
               done();
            }, function(err) {
               assert.isTrue(err === undefined);
               done();
            });
         });
      });
});
