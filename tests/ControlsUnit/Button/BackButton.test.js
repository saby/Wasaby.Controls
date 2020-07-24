define(['Controls/heading', 'UI/Utils'], function(heading, {Logger}) {
   var separator;
   describe('Controls/_heading/BackButton', function() {
      var sandbox;
      beforeEach(() => {
         sandbox = sinon.createSandbox();
         sandbox.stub(Logger, 'error');
      });

      afterEach(() => {
         sandbox.restore();
      });
   });
});
