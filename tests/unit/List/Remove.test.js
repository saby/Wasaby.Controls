define([
   'Controls/List/Remover',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Core/Deferred',
   'Core/core-clone'
], function(Remove, MemorySource, RecordSet, Deferred, cClone) {
   describe('Controls.List.Remover', function() {
      var remover;

      beforeEach(function() {
         var
            data = [{
               id: 1,
               title: 'Первый'
            }, {
               id: 2,
               title: 'Второй'
            }, {
               id: 3,
               title: 'Третий'
            }],
            rs = new RecordSet({
               idProperty: 'id',
               rawData: cClone(data)
            }),
            source = new MemorySource({
               idProperty: 'id',
               data: cClone(data)
            });

         remover = new Remove();
         remover._source = source;
         remover._items = rs;
      });

      afterEach(function() {
         remover.destroy();
      });

      it('beforeItemsRemove notify event with params', function(done) {
         var items = [1];
         remover._notify = function(event, args) {
            if (event === 'beforeItemsRemove') {
               assert.equal(args[0], items);
               done();
            }
         };
         remover.removeItems(items);
      });

      it('afterItemsRemove notify event with params', function(done) {
         var
            items = [2, 3],
            result = 'custom_result';
         remover._source.destroy = function() {
            return Deferred.success(result);
         };
         remover._notify = function(event, args) {
            if (event === 'afterItemsRemove') {
               assert.equal(args[0], items);
               assert.equal(args[1], result);
               done();
            }
         };

         remover.removeItems(items);
      });

      it('beforeItemsRemove return false', function() {
         remover._notify = function(event) {
            if (event === 'beforeItemsRemove') {
               return false;
            }
         };

         remover.removeItems([2, 3]);
         assert.equal(remover._items.getCount(), 3);
      });

      it('beforeItemsRemove return Deferred', function() {
         remover._notify = function(event) {
            if (event === 'beforeItemsRemove') {
               return Deferred.success();
            }
         };

         remover.removeItems([1, 2, 3]);
         assert.equal(remover._items.getCount(), 0);
      });

      it('removeItems from source', function(done) {
         remover.removeItems([1, 2]);
         remover._source.query().addCallback(function(dataSet) {
            assert.equal(dataSet.getAll().getCount(), 1);
            done();
         });
      });

      it('removeItems from items', function() {
         remover.removeItems([1, 2]);
         assert.equal(remover._items.getCount(), 1);
      });
   });
});
