define([
   'Controls/List/Remove',
   'Core/Deferred'
], function(Remove, Deferred){
   describe('Controls.List.Remove', function () {
      var
         result,
         items = [1, 2, 3];

      it('beginRemove return Deferred', function () {
         var remove = new Remove();
         result = remove.beginRemove(items);

         assert.isTrue(result instanceof Deferred);
      });

      it('beginRemove notify event with params', function (done) {
         var remove = new Remove();
         remove._notify = function(event, args, opts) {
            assert.equal(event, 'beginRemove');
            assert.equal(args[0], items);
            assert.equal(opts.bubbling, true);
            done();
         };
         remove.beginRemove(items);
      });

      it('beginRemove return notify result', function (done) {
         var remove = new Remove();
         remove._notify = function() {
            return false;
         };

         remove.beginRemove(items).addCallback(function(beginRemoveResult) {
            assert.equal(beginRemoveResult, false);
            done();
         });
      });

      it('beginRemove return notify deferred result', function (done) {
         var remove = new Remove();
         remove._notify = function() {
            return Deferred.success(false);
         };

         remove.beginRemove(items).addCallback(function(beginRemoveResult) {
            assert.equal(beginRemoveResult, false);
            done();
         });
      });

      it('endRemove notify event with params', function (done) {
         var remove = new Remove();
         remove._notify = function(event, args, opts) {
            assert.equal(event, 'endRemove');
            assert.equal(opts.bubbling, true);
            assert.equal(args[0], items);
            assert.equal(args[1], false);
            done();
         };

         remove.endRemove(items, false);
      });
   });
});