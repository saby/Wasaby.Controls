define([
   'Controls/List/Mover',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Controls/Controllers/SourceController',
   'Controls/List/ListViewModel',
   'Core/Deferred',
   'Core/core-clone'
], function(Mover, MemorySource, RecordSet, SourceController, ListViewModel, Deferred, cClone) {
   describe('Controls.List.Mover', function() {
      var
         items,
         mover;

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
            cfg = {
               keyProperty: 'id',
               listModel: new ListViewModel({
                  keyProperty: 'id'
               }),
               sourceController: new SourceController({
                  source: new MemorySource({
                     idProperty: 'id',
                     data: cClone(data)
                  })
               })
            };

         items = new RecordSet({
            idProperty: 'id',
            rawData: cClone(data)
         });

         cfg.listModel.setItems(items);
         mover = new Mover(cfg);
         mover.saveOptions(cfg);

      });

      afterEach(function() {
         mover.destroy();
      });

      it('beforeItemsMove notify event with params', function(done) {
         var
            movedItems,
            item = items.at(0),
            target = items.at(1);
         mover._notify = function(event, args) {
            if (event === 'beforeItemsMove') {
               movedItems = args[0];
               assert.equal(movedItems[0].getId(), item.getId());
               assert.equal(args[1].getId(), target.getId());
               done();
            }
         };
         mover.moveItemDown(item);
      });

      it('afterItemsMove notify event with params', function(done) {
         var
            movedItems,
            item = items.at(2),
            target = items.at(1),
            result = 'custom_result';

         mover._options.sourceController.move = function() {
            return Deferred.success(result);
         };
         mover._notify = function(event, args) {
            if (event === 'afterItemsMove') {
               movedItems = args[0];
               assert.equal(movedItems[0].getId(), item.getId());
               assert.equal(args[1].getId(), target.getId());
               assert.equal(args[3], 'custom_result');
               done();
            }
         };
         mover.moveItemUp(item);
      });

      it('moveItemUp', function(done) {
         var item = items.at(2);

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(1).getId(), item.getId());
               done();
            }
         };
         mover.moveItemUp(item);
      });

      it('moveItemUp first item', function() {
         var item = items.at(0);

         mover.moveItemUp(item);
         assert.equal(items.at(0).getId(), item.getId());
      });

      it('moveItemDown', function(done) {
         var item = items.at(0);

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(1).getId(), item.getId());
               done();
            }
         };
         mover.moveItemDown(item);
      });

      it('moveItemDown last item', function() {
         var item = items.at(2);

         mover.moveItemDown(item);
         assert.equal(items.at(2).getId(), item.getId());
      });

      it('moveItem', function(done) {
         var
            item = items.at(0),
            target = items.at(2);

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(2).getId(), item.getId());
               done();
            }
         };

         mover.moveItems([item], target, 'after');
      });

      it('moveItems', function(done) {
         var target = items.at(2);

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(0).getId(), target.getId());
               done();
            }
         };

         mover.moveItems([1, 2], target, 'after');
      });

      it('beforeItemsMove = MoveInItems', function(done) {
         var
            item = items.at(0),
            target = items.at(2);

         mover._notify = function(event) {
            if (event === 'beforeItemsMove') {
               return Deferred.success('MoveInItems');
            }
         };

         mover.moveItems([item], target, 'after');
         assert.equal(items.at(2).getId(), item.getId());
         mover._options.sourceController.load().addCallback(function(recordSet) {
            assert.equal(recordSet.at(0).getId(), item.getId());
            done();
         });
      });

      it('beforeItemsMove = Custom', function(done) {
         var
            item = items.at(0),
            target = items.at(2);

         mover._notify = function(event) {
            if (event === 'beforeItemsMove') {
               return 'Custom';
            }
         };

         mover.moveItems([item], target, 'after');
         assert.equal(items.at(0).getId(), item.getId());
         mover._options.sourceController.load().addCallback(function(recordSet) {
            assert.equal(recordSet.at(0).getId(), item.getId());
            done();
         });
      });

   });
});
