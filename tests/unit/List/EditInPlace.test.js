/**
 * Created by kraynovdo on 17.11.2017.
 */
define([
   'Controls/List/EditInPlace',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Entity/Model',
   'Core/Deferred',
   'WS.Data/Source/Memory',
   'Controls/List/SimpleList/ListViewModel'
], function(EditInPlace, RecordSet, Model, Deferred, Memory, ListViewModel){
   describe('Controls.List.EditInPlace', function () {
      var eip, items, existingItem, newItem;
      beforeEach(function() {
         items = new RecordSet({
            rawData: [
               {
                  id: 1,
                  title: 'Первый'
               },
               {
                  id: 2,
                  title: 'Второй'
               },
               {
                  id: 3,
                  title: 'Третий'
               }
            ],
            idProperty: 'id'
         });
         existingItem = new Model({
            rawData: {
               id: 1,
               title: 'Первый'
            }
         });
         newItem = new Model({
            rawData: {
               id: 4,
               title: 'Четвёртый'
            }
         });
         eip = new EditInPlace();
      });

      afterEach(function() {
         eip.destroy();
         eip = undefined;
         existingItem = undefined;
         newItem = undefined;
         items = undefined;
      });

      describe('_private.beginEdit', function() {
         it('Cancel', function() {
            eip._notify = function(e) {
               return 'Cancel';
            };

            var result = EditInPlace._private.beginEdit(eip, existingItem);
            assert.isFalse(result.isSuccessful());
         });

         it('Record', function() {
            eip._notify = function(e) {
               return existingItem;
            };

            var result = EditInPlace._private.beginEdit(eip, existingItem);
            assert.equal(existingItem, result.getResult());
            assert.equal(existingItem, eip._oldItem);
         });

         it('Deferred', function() {
            eip._notify = function(e) {
               return Deferred.success(newItem);
            };

            var result = EditInPlace._private.beginEdit(eip, existingItem);
            assert.equal(newItem, result.getResult());
            assert.equal(existingItem, eip._oldItem);
         });
      });

      describe('_private.beginAdd', function() {
         it('Cancel', function() {
            eip._notify = function(e) {
               return 'Cancel';
            };

            var result = EditInPlace._private.beginAdd(eip);
            assert.isFalse(result.isSuccessful());
         });

         it('Without handler', function() {
            var options = {
               item: newItem
            };

            var result = EditInPlace._private.beginAdd(eip, options);
            assert.equal(options, result.getResult());
         });

         it('Object without item', function (done) {
            var source = new Memory({
               idProperty: 'id',
               data: items
            });
            eip.saveOptions({
               source: source
            });
            eip._notify = function(e) {
               return {};
            };

            var result = EditInPlace._private.beginAdd(eip);
            result.addCallback(function(options) {
               assert.instanceOf(options.item, Model);
               done();
            });
         });

         it('Object with item', function () {
            var options = {
               item: newItem
            };
            eip._notify = function(e) {
               return options;
            };

            var result = EditInPlace._private.beginAdd(eip);
            assert.equal(options.item, result.getResult().item);
         });

         it('Deferred', function() {
            var options = {
               item: newItem
            };
            eip._notify = function(e) {
               return Deferred.success(options);
            };

            var result = EditInPlace._private.beginAdd(eip);
            assert.equal(options.item, result.getResult().item);
         });
      });

      describe('_private.endEdit', function() {
         it('Cancel', function() {
            eip._notify = function() {
               return 'Cancel';
            };

            eip._editingItem = newItem;
            var result = EditInPlace._private.endEdit(eip);
            assert.isFalse(result.isSuccessful());
         });

         it('isAdd = false, commit = true', function(done) {
            var
               listModel = new ListViewModel({
                  items: items,
                  idProperty: 'id',
                  displayProperty: 'title'
               }),
               newEditingItem = existingItem.clone();
            newEditingItem.set('title', 'Второй');
            eip.saveOptions({
               listModel: listModel
            });
            eip._oldItem = eip._options.listModel.getItems().at(0);
            eip._editingItem = newEditingItem;
            var result = EditInPlace._private.endEdit(eip, true);
            result.addCallback(function() {
               assert.equal(eip._options.listModel.getItems().at(0).get('title'), newEditingItem.get('title'));
               done();
            });
         });

         it('isAdd = false, commit = false', function(done) {
            var listModel = new ListViewModel({
               items: items,
               idProperty: 'id',
               displayProperty: 'title'
            });
            eip.saveOptions({
               listModel: listModel
            });
            eip._oldItem = eip._options.listModel.getItems().at(0);
            eip._editingItem = newItem;
            var result = EditInPlace._private.endEdit(eip, false);
            result.addCallback(function() {
               assert.equal(eip._options.listModel.getItems().at(0).get('title'), existingItem.get('title'));
               done();
            });
         });

         it('isAdd = true, commit = true', function(done) {
            var listModel = new ListViewModel({
               items: items,
               idProperty: 'id',
               displayProperty: 'title'
            });
            eip.saveOptions({
               listModel: listModel
            });
            eip._isAdd = true;
            eip._editingItem = newItem;
            var result = EditInPlace._private.endEdit(eip, true);
            result.addCallback(function() {
               assert.equal(eip._options.listModel.getCount(), 4);
               assert.equal(eip._options.listModel.getItems().at(3).get('title'), newItem.get('title'));
               done();
            });
         });

         it('isAdd = true, commit = false', function(done) {
            var listModel = new ListViewModel({
               items: items,
               idProperty: 'id',
               displayProperty: 'title'
            });
            eip.saveOptions({
               listModel: listModel
            });
            eip._isAdd = true;
            eip._editingItem = newItem;
            var result = EditInPlace._private.endEdit(eip, false);
            result.addCallback(function() {
               assert.equal(eip._options.listModel.getCount(), 3);
               done();
            });
         });

         it('commit = true, with source', function(done) {
            var listModel = new ListViewModel({
               items: items,
               idProperty: 'id',
               displayProperty: 'title'
            });
            var source = new Memory({
               idProperty: 'id',
               data: items
            });
            var newEditingItem = existingItem.clone();
            newEditingItem.set('title', 'отредактировал');
            eip.saveOptions({
               listModel: listModel,
               source: source
            });
            eip._oldItem = eip._options.listModel.getItems().at(0);
            eip._editingItem = newEditingItem;
            var result = EditInPlace._private.endEdit(eip, true);
            result.addCallback(function() {
               assert.equal(eip._options.listModel.getItems().at(0).get('title'), 'отредактировал');
               eip._options.source.read(1).addCallback(function(record) {
                  assert.equal(record.get('title'), 'отредактировал');
                  done();
               });
            });
         });
      });

      it('_private.afterBeginEdit', function() {
         var listModel = new ListViewModel({
            items: items,
            idProperty: 'id',
            displayProperty: 'title'
         });
         eip.saveOptions({
            listModel: listModel
         });
         eip._notify = function(event, args) {
            if (event === 'afterBeginEdit') {
               assert.isTrue(existingItem.isEqual(args[0]));
            }
         };
         var result = EditInPlace._private.afterBeginEdit(eip, existingItem);
         assert.isTrue(existingItem.isEqual(eip._options.listModel.getEditingItem()));
         assert.isTrue(existingItem.isEqual(result));
      });

      it('_private.afterBeginAdd', function() {
         var listModel = new ListViewModel({
            items: items,
            idProperty: 'id',
            displayProperty: 'title'
         });
         eip.saveOptions({
            listModel: listModel
         });
         eip._notify = function(event, args) {
            if (event === 'afterBeginAdd') {
               assert.isTrue(newItem.isEqual(args[0]));
            }
         };
         var result = EditInPlace._private.afterBeginAdd(eip, {item: newItem});
         assert.isTrue(newItem.isEqual(eip._options.listModel.getEditingItem()));
         assert.isTrue(newItem.isEqual(result));
         assert.isTrue(eip._isAdd);
      });

      it('_private.afterEndEdit', function() {
         var listModel = new ListViewModel({
            items: items,
            idProperty: 'id',
            displayProperty: 'title'
         });
         eip.saveOptions({
            listModel: listModel
         });
         eip._notify = function(event, args) {
            if (event === 'afterEndEdit') {
               assert.isTrue(existingItem.isEqual(args[0]));
            }
         };
         eip._oldItem = existingItem;
         EditInPlace._private.afterEndEdit(eip);
         assert.isNull(eip._options.listModel.getEditingItem());
      });
   });
});