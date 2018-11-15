define([
   'Controls/Container/Async'
], function(
   Async
) {
   describe('Controls.Container.Async', function() {
      var bc, data;

      it('Only required', function(done, test) {
         var async = new Async();
         async._beforeMount({
            templateName: 'wml!Controls/Button/Button'
         }, {});
         setTimeout(function() {
            assert.equal(async.optionsForComponent.resolvedTemplate, require('wml!Controls/Button/Button'));
            async._beforeUpdate({
               templateName: 'noSuchTemplate'
            });
            setTimeout(function() {
               assert.equal(async.optionsForComponent.resolvedTemplate, require('wml!Controls/Button/Button'));
               done();
            }, 30);
         }, 30);
      });
   });
});
