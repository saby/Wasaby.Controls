define([
   'Controls/List/Mover',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Core/Deferred',
   'Core/core-clone'
], function(Mover, MemorySource, RecordSet, Deferred, cClone) {
   describe('Controls.List.Mover', function() {
      var
         items,
         mover;

      beforeEach(function() {
         var
            data = [{
               id: 1,
               title: 'Первый',
               folder: null,
               'folder@': true
            }, {
               id: 2,
               title: 'Второй',
               folder: null,
               'folder@': null
            }, {
               id: 3,
               title: 'Третий',
               folder: null,
               'folder@': null
            }, {
               id: 4,
               title: 'Третий',
               folder: 1,
               'folder@': true
            }, {
               id: 5,
               title: 'Третий',
               folder: 1,
               'folder@': null
            }];

         items = new RecordSet({
            idProperty: 'id',
            rawData: cClone(data)
         });
         mover = new Mover({});
         mover._options.parentProperty = 'folder';
         mover._options.nodeProperty = 'folder@';
         mover._items = items;
         mover._source = new MemorySource({
            idProperty: 'id',
            data: cClone(data)
         });
         mover._keyProperty = 'id';

      });

      afterEach(function() {
         mover.destroy();
      });

      it('moveItemsWithDialog', function(done) {
         var items = [1, 2, 3];

         mover._children = {
            dialogOpener: {
               open: function(openArgs) {
                  assert.equal(openArgs.templateOptions.movedItems, items);
                  assert.equal(openArgs.templateOptions.source, mover._source);
                  assert.equal(openArgs.templateOptions.keyProperty, mover._keyProperty);
                  done();
               }
            }
         };

         mover.moveItemsWithDialog(items);
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

         mover._source.move = function() {
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

      it('moveItemUp by item', function(done) {
         var item = items.at(2);

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(1).getId(), item.getId());
               done();
            }
         };
         mover.moveItemUp(item);
      });

      it('moveItemUp by id', function(done) {
         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(1).getId(), 3);
               done();
            }
         };
         mover.moveItemUp(3);
      });

      it('moveItemUp first item', function() {
         var item = items.at(0);

         mover.moveItemUp(item);
         assert.equal(items.at(0).getId(), item.getId());
      });

      it('moveItemDown by item', function(done) {
         var item = items.at(0);

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(1).getId(), item.getId());
               done();
            }
         };
         mover.moveItemDown(item);
      });

      it('moveItemDown by id', function(done) {
         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(1).getId(), 1);
               done();
            }
         };
         mover.moveItemDown(1);
      });

      it('moveItemDown last item', function() {
         var item = items.at(4);

         mover.moveItemDown(item);
         assert.equal(items.at(4).getId(), item.getId());
      });

      it('moveItems by item', function(done) {
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

      it('moveItems by id', function(done) {
         var target = items.at(2);

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.at(0).getId(), target.getId());
               done();
            }
         };

         mover.moveItems([1, 2], target, 'after');
      });

      it('moveItems in folder', function(done) {
         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.getRecordById(4).get('folder'), 1);
               assert.equal(items.getRecordById(5).get('folder'), 1);
               done();
            }
         };

         mover.moveItems([4, 5], 1, 'on');
      });

      it('moveItems in folder with change order', function(done) {
         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.getRecordById(3).get('folder'), 1);
               done();
            }
         };

         mover.moveItems([3], 4, 'after');
      });

      it('moveItems in root', function(done) {
         var movedItems = [];
         movedItems.push(items.getRecordById(4));
         movedItems.push(items.getRecordById(5));

         mover._notify = function(event) {
            if (event === 'afterItemsMove') {
               assert.equal(items.getRecordById(4).get('folder'), null);
               assert.equal(items.getRecordById(5).get('folder'), null);
               done();
            }
         };

         mover.moveItems(movedItems, null, 'on');
      });

      it('moveItems in list', function() {
         mover.moveItems([4], 5, 'on');
         assert.equal(items.getRecordById(4).get('folder'), 1);
      });

      it('moveItems folder in child folder', function() {
         mover.moveItems([1], 4, 'on');
         assert.equal(items.getRecordById(1).get('folder'), null);
      });

      it('moveItems in himself', function() {
         mover.moveItems([1], 1, 'on');
         assert.equal(items.getRecordById(1).get('folder'), null);
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
         mover._source.query().addCallback(function(dataSet) {
            assert.equal(dataSet.getAll().at(0).getId(), item.getId());
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
         mover._source.query().addCallback(function(dataSet) {
            assert.equal(dataSet.getAll().at(0).getId(), item.getId());
            done();
         });
      });

   });
});
