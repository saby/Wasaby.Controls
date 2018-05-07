define([
   'Controls/List/Remove',
   'WS.Data/Source/Memory',
   'WS.Data/Collection/RecordSet',
   'Controls/Controllers/SourceController',
   'Controls/List/ListViewModel',
   'Core/Deferred',
   'Core/core-clone'
], function(Remove, MemorySource, RecordSet, SourceController, ListViewModel, Deferred, cClone){
   describe('Controls.List.Remove', function () {
      var remove;

      beforeEach(function() {
         var
            data = [{
               id : 1,
               title : 'Первый'
            }, {
               id : 2,
               title : 'Второй'
            }, {
               id : 3,
               title : 'Третий'
            }],
            rs = new RecordSet({
               idProperty: 'id',
               rawData: cClone(data)
            }),
            cfg = {
               listModel: new ListViewModel({
                  keyProperty: 'id'
               }),
               sourceController: new SourceController({
                  source : new MemorySource({
                     idProperty: 'id',
                     data: cClone(data)
                  })
               })
            };

         cfg.listModel.setItems(rs);
         remove = new Remove(cfg);
         remove.saveOptions(cfg);

      });

      afterEach(function() {
         remove.destroy();
      });

      it('beforeItemsRemove notify event with params', function (done) {
         var items = [1];
         remove._notify = function(event, args) {
            if (event === 'beforeItemsRemove') {
               assert.equal(args[0], items);
               done();
            }
         };
         remove.removeItems(items);
      });

      it('afterItemsRemove notify event with params', function (done) {
         var
            items = [2, 3],
            result = 'custom_result';
         remove._options.sourceController.remove = function() {
            return Deferred.success(result);
         };
         remove._notify = function(event, args) {
            if (event === 'afterItemsRemove') {
               assert.equal(args[0], items);
               assert.equal(args[1], result);
               done();
            }
         };

         remove.removeItems(items);
      });

      it('beforeItemsRemove return false', function () {
         remove._notify = function(event) {
            if (event === 'beforeItemsRemove') {
               return false;
            }
         };

         remove.removeItems([2, 3]);
         assert.equal(remove._options.listModel.getCount(), 3);
      });

      it('beforeItemsRemove return Deferred', function () {
         remove._notify = function(event) {
            if (event === 'beforeItemsRemove') {
               return Deferred.success();
            }
         };

         remove.removeItems([1, 2, 3]);
         assert.equal(remove._options.listModel.getCount(), 0);
      });

      it('removeItems from source', function (done) {
         remove.removeItems([1, 2]);
         remove._options.sourceController.load({}).addCallback(function(recordSet) {
            assert.equal(recordSet.getCount(), 1);
            done();
         });
      });

      it('removeItems from model', function () {
         remove.removeItems([1, 2]);
         assert.equal(remove._options.listModel.getCount(), 1);
      });
   });
});