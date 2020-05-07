define([
   'Controls/lookup',
   'Types/entity',
   'Types/collection',
   'Types/source'
], function(lookup, entity, collection, sourceLib) {

   function getBaseSelectedCollection() {
      return {
         _selectedKeys: [],
         _notify: function() {},
         _forceUpdate: function() {
            this.isUpdate = true;
         },
         _children: {},
         _options: {
            keyProperty: 'id',
            displayProperty: 'title'
         }
      }
   }

   describe('Controls/_lookup/BaseController', function() {
      var dataHistory;

      // Убираем работу с вертской
      if (typeof window === 'undefined') {
         lookup._CollectionController._private.getCounterWidth = function() {};
      }

      lookup._CollectionController._private.getHistoryService = function() {
         return {
            addCallback: function(func) {
               func({
                  update: function(data) {
                     dataHistory = data;
                  }
               });
            }
         }
      };

      it('setSelectedKeys', function() {
         var self = getBaseSelectedCollection();

         lookup._CollectionController._private.setSelectedKeys(self, [1]);

         assert.deepEqual(self._selectedKeys, [1]);
      });

      it('LoadItems', function(done) {
         var
            selectedItems,
            self = {
            _notify: function() {},
            _options : {
               dataLoadCallback: function(result) {
                  selectedItems = result;
               },
               selectedKeys : [1,2],
               source: new sourceLib.Memory({
                  data: [
                     {id: 1, title: 'Alex', text: 'Alex'},
                     {id: 2, title: 'Ilya', text: 'Ilya'},
                     {id: 3, title: 'Mike', text: 'Mike'}
                  ],
                  keyProperty: 'id'
               }),
               keyProperty: 'id'
            }
         };
         lookup._CollectionController._private.loadItems(self, self._options, self._options.selectedKeys).addCallback(function(result) {
            assert.equal(selectedItems, result);
            assert.equal(result.at(0).getId(), 1);
            assert.equal(result.at(1).getId(), 2);
            assert.equal(result.getCount(), 2);
            done()
         });
      });

      it('getItems', function() {
         var self = {};

         var items = lookup._CollectionController._private.getItems(self);

         assert.isTrue(items['[Types/_collection/List]']);
         assert.isTrue(self._items['[Types/_collection/List]']);
      });

      it('addItem', function() {
         var
            selectedItems,
            textValue = '',
            keysChanged = false,
            self = getBaseSelectedCollection(),
            item = new entity.Model({
               rawData: {
                  id: 1,
                  title: 'Roman'
               }
            }),
            item2 = new entity.Model({
               rawData: {
                  id: 2,
                  title: 'Aleksey'
               }
            });

         self._notify = function(eventName, data) {
            if (eventName === 'selectedKeysChanged') {
               keysChanged = true;
            } else if (eventName === 'textValueChanged') {
               textValue = data[0];
            }
         };

         lookup._CollectionController._private.addItem(self, item);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.at(0), item);
         assert.equal(textValue, 'Roman');

         keysChanged = false;
         lookup._CollectionController._private.addItem(self, item);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);
         assert.equal(self._items.at(0), item);

         selectedItems = self._items;
         self._options.multiSelect = true;
         lookup._CollectionController._private.addItem(self, item2);
         assert.deepEqual(self._selectedKeys, [1, 2]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.at(0), item);
         assert.equal(self._items.at(1), item2);
         assert.equal(textValue, 'Roman, Aleksey');
         assert.notEqual(selectedItems, self._items);
         assert.equal(self._items.getCount(), 2);

      });

      it('removeItem', function() {
         var
            textValue,
            selectedItems,
            keysChanged = false,
            self = getBaseSelectedCollection(),
            item = new entity.Model({
               rawData: {
                  id: 1,
                  title: 'Roman'
               }
            }),
            fakeItem = new entity.Model({
               rawData: {
                  id: 2
               }
            });

         self._notify = function(eventName, data) {
            if (eventName === 'selectedKeysChanged') {
               keysChanged = true;
            }  else if (eventName === 'textValueChanged') {
               textValue = data[0];
            }
         };

         lookup._CollectionController._private.addItem(self, item);

         assert.deepEqual(self._selectedKeys, [1]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.getCount(), 1);

         keysChanged = false;
         lookup._CollectionController._private.removeItem(self, fakeItem);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);
         assert.equal(self._items.getCount(), 1);
         assert.equal(textValue, 'Roman');


         selectedItems = self._items;
         lookup._CollectionController._private.removeItem(self, item.clone());
         assert.deepEqual(self._selectedKeys, []);
         assert.isTrue(keysChanged);
         assert.notEqual(selectedItems, self._items);
         assert.equal(self._items.getCount(), 0);
         assert.equal(textValue, '');
      });

      it('_beforeMount', function() {
         var selectedCollection = new lookup._CollectionController();
         var selectedKeys = [1];

         selectedCollection._beforeMount({
            selectedKeys: selectedKeys,
            source: new sourceLib.Memory({
               data: [ {id: 1} ],
               keyProperty: 'id'
            })
         });

         assert.deepEqual(selectedCollection._selectedKeys, selectedKeys);
         assert.notEqual(selectedCollection._selectedKeys, selectedKeys);

         var collectionWithReceivedState = new lookup._CollectionController();
         collectionWithReceivedState._beforeMount({
            selectedKeys: selectedKeys,
            source: new sourceLib.Memory({
               data: [ {id: 1} ],
               keyProperty: 'id'
            })
         }, null, new collection.List({
            items: [new entity.Model({
               rawData: {id: 1},
               keyProperty: 'id'
            })]
         }));
         assert.deepEqual(collectionWithReceivedState._selectedKeys, selectedKeys);
         assert.notEqual(collectionWithReceivedState._selectedKeys, selectedKeys);
      });

      it('_beforeUpdate', function(done) {
         var selectedCollection = new lookup._CollectionController();
         var selectedKeysLink;
         var selectedKeys = [];
         var textValue = '';
         var result;
         var source = new sourceLib.Memory({
            data: [
               {id: 1, title: 'Alex', text: 'Alex'},
               {id: 2, title: 'Ilya', text: 'Ilya'},
               {id: 3, title: 'Mike', text: 'Mike'}
            ],
            keyProperty: 'id'
         });

         selectedCollection._options.selectedKeys = selectedKeys;
         selectedCollection._options.displayProperty = 'title';
         selectedCollection._notify = function(eventName, data) {
            if (eventName === 'textValueChanged') {
               textValue = data;
            }
         };


         result = selectedCollection._beforeMount({
            selectedKeys: [],
            source: new sourceLib.Memory({
               data: [ {id: 1} ],
               keyProperty: 'id'
            })
         });
         assert.equal(result, undefined);

         result = selectedCollection._beforeMount({
            selectedKeys: [1],
            source: new sourceLib.Memory({
               data: [ {id: 1} ],
               keyProperty: 'id'
            })
         });
         assert.notEqual(result, undefined);

         selectedCollection._beforeUpdate({
            selectedKeys: []
         });
         assert.deepEqual(selectedCollection._selectedKeys, []);

         selectedKeysLink = selectedCollection._selectedKeys = [1];
         selectedCollection._beforeUpdate({
            selectedKeys: selectedKeys,
            source: selectedCollection._options.source
         });
         assert.equal(selectedKeysLink, selectedCollection._selectedKeys);

         selectedKeysLink = selectedCollection._selectedKeys = [1];
         selectedCollection._beforeUpdate({
            selectedKeys: selectedKeys.slice(),
            source: selectedCollection._options.source
         });
         assert.notEqual(selectedKeysLink, selectedCollection._selectedKeys);

         selectedCollection._beforeUpdate({
            selectedKeys: [1]
         });
         assert.deepEqual(selectedCollection._selectedKeys, [1]);

         selectedCollection._beforeUpdate({
            selectedKeys: [1],
            source: new sourceLib.Memory({
               data: [
                  {id: 1, title: 'Alex', text: 'Alex'}
               ],
               keyProperty: 'id'
            })
         });
         assert.deepEqual(selectedCollection._selectedKeys, [1]);

         selectedCollection._beforeUpdate({
            selectedKeys: [1, 2],
            source: source,
            keyProperty: 'id'
         });
         assert.deepEqual(selectedCollection._selectedKeys, []);

         selectedCollection._beforeUpdate({
            multiSelect: true,
            selectedKeys: [1, 2],
            source: source,
            keyProperty: 'id'
         }).addCallback(function() {
            assert.deepEqual(selectedCollection._selectedKeys, [1, 2]);
            assert.equal(selectedCollection._items.getCount(), 2);

            selectedCollection._beforeUpdate({
               selectedKeys: []
            });
            assert.deepEqual(selectedCollection._selectedKeys, []);
            assert.equal(selectedCollection._items.getCount(), 0);
            done();
         });
      });

      it('_setItems', function() {
         var
            selectedItems,
            selectedCollection = new lookup._CollectionController(),
            items = [
               new entity.Model({
                  rawData: {id: 1}
               }), new entity.Model({
                  rawData: {id: 2}
               })
            ];

         selectedCollection._options.keyProperty = 'id';
         selectedCollection._items = new collection.RecordSet({
            rawData: [],
            keyProperty: 'id'
         });

         selectedCollection._setItems(
            new collection.List({
               items: items
            })
         );

         assert.deepEqual(selectedCollection._selectedKeys, [1, 2]);
         assert.equal(selectedCollection._items.getCount(), items.length);
         assert.isFalse(selectedCollection._items instanceof collection.RecordSet);
         assert.notEqual(selectedCollection._items.at(0), items[0]);

         selectedItems = selectedCollection._items;
         selectedCollection._setItems(new collection.List());
         assert.deepEqual(selectedCollection._selectedKeys, []);
         assert.equal(selectedCollection._items.getCount(), 0);
         assert.notEqual(selectedItems, selectedCollection._items);
      });

      it('_selectCallback', function() {
         const selectedCollection = new lookup._CollectionController();
         const item = new entity.Model({
            rawData: {id: 1}
         });
         const recordSetFromSelector = new collection.List({
            items: [item]
         });
         let valueCleared = false;

         selectedCollection._notify = (event, value) => {
            if (event === 'valueChanged' && !value[0]) {
               valueCleared = true;
            }
         };

         selectedCollection._options.keyProperty = 'id';
         selectedCollection._options.historyId = 'historyField';
         selectedCollection._selectCallback(null, recordSetFromSelector);

         assert.deepEqual(dataHistory, {
            ids: [1]
         });
         assert.isFalse(valueCleared);

         selectedCollection._options.value = 'testValue';
         selectedCollection._selectCallback(null, recordSetFromSelector);
         assert.isTrue(valueCleared);
      });
   });
});
