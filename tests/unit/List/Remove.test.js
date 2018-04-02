define([
   'Controls/List/Remove',
   'Core/Deferred'
], function(Remove, Deferred){
   describe('Controls.List.Remove', function () {
      var
         result,
         items = [1, 2, 3];

      it('itemsRemove return Deferred', function () {
         var remove = new Remove();
         result = remove.itemsRemove(items);

         assert.isTrue(result instanceof Deferred);
      });

      it('itemsRemove notify event with params', function (done) {
         var remove = new Remove();
         remove._notify = function(event, args) {
            assert.equal(event, 'itemsRemove');
            assert.equal(args[0], items);
            done();
         };
         remove.itemsRemove(items);
      });

      it('itemsRemove return notify result', function (done) {
         var remove = new Remove();
         remove._notify = function() {
            return false;
         };

         remove.itemsRemove(items).addCallback(function(itemsRemoveResult) {
            assert.equal(itemsRemoveResult, false);
            done();
         });
      });

      it('itemsRemove return notify deferred result', function (done) {
         var remove = new Remove();
         remove._notify = function() {
            return Deferred.success(false);
         };

         remove.itemsRemove(items).addCallback(function(itemsRemoveResult) {
            assert.equal(itemsRemoveResult, false);
            done();
         });
      });

      it('afterItemsRemove notify event with params', function (done) {
         var remove = new Remove();
         remove._notify = function(event, args) {
            assert.equal(event, 'afterItemsRemove');
            assert.equal(args[0], items);
            assert.equal(args[1], false);
            done();
         };

         remove.afterItemsRemove(items, false);
      });
   });
});