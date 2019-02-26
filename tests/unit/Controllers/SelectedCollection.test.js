define([
   'Controls/Selector/SelectedCollection/Controller',
   'Types/entity',
   'Types/collection',
   'Types/source'
], function(SelectedCollection, entity, collection, sourceLib) {

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

   describe('Controls/Selector/SelectedCollection/Controller', function() {
      // Убираем работу с вертской
      if (typeof window === 'undefined') {
         SelectedCollection._private.getCounterWidth = function() {};
      }

      it('setSelectedKeys', function() {
         var self = getBaseSelectedCollection();

         SelectedCollection._private.setSelectedKeys(self, [1]);

         assert.deepEqual(self._selectedKeys, [1]);
      });

      it('LoadItems', function(done) {
         var self = {
            _notify: function() {},
            _options : {
               selectedKeys : [1,2],
               source: new sourceLib.Memory({
                  data: [
                     {id: 1, title: 'Alex', text: 'Alex'},
                     {id: 2, title: 'Ilya', text: 'Ilya'},
                     {id: 3, title: 'Mike', text: 'Mike'}
                  ],
                  idProperty: 'id'
               }),
               keyProperty: 'id'
            }
         };
         SelectedCollection._private.loadItems(self, null, self._options.keyProperty, self._options.selectedKeys, self._options.source).addCallback(function(result) {
            assert.equal(result.at(0).getId(), 1);
            assert.equal(result.at(1).getId(), 2);
            assert.equal(result.getCount(), 2);
            done()
         });
      });

      it('getItems', function() {
         var self = {};

         var items = SelectedCollection._private.getItems(self);

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

         SelectedCollection._private.addItem(self, item);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.at(0), item);
         assert.equal(textValue, 'Roman');

         keysChanged = false;
         SelectedCollection._private.addItem(self, item);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);
         assert.equal(self._items.at(0), item);

         selectedItems = self._items;
         self._options.multiSelect = true;
         SelectedCollection._private.addItem(self, item2);
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

         SelectedCollection._private.addItem(self, item);

         assert.deepEqual(self._selectedKeys, [1]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.getCount(), 1);

         keysChanged = false;
         SelectedCollection._private.removeItem(self, fakeItem);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);
         assert.equal(self._items.getCount(), 1);
         assert.equal(textValue, 'Roman');


         selectedItems = self._items;
         SelectedCollection._private.removeItem(self, item.clone());
         assert.deepEqual(self._selectedKeys, []);
         assert.isTrue(keysChanged);
         assert.notEqual(selectedItems, self._items);
         assert.equal(self._items.getCount(), 0);
         assert.equal(textValue, '');
      });

      it('_beforeMount', function() {
         var selectedCollection = new SelectedCollection();
         var selectedKeys = [1];

         selectedCollection._beforeMount({
            selectedKeys: selectedKeys,
            source: new sourceLib.Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
            })
         });

         assert.deepEqual(selectedCollection._selectedKeys, selectedKeys);
         assert.notEqual(selectedCollection._selectedKeys, selectedKeys);

         var collectionWithReceivedState = new SelectedCollection();
         collectionWithReceivedState._beforeMount({
            selectedKeys: selectedKeys,
            source: new sourceLib.Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
            })
         }, null, new collection.List({
            items: [new entity.Model({
               rawData: {id: 1},
               idProperty: 'id'
            })]
         }));
         assert.deepEqual(collectionWithReceivedState._selectedKeys, selectedKeys);
         assert.notEqual(collectionWithReceivedState._selectedKeys, selectedKeys);
      });

      it('_beforeUpdate', function(done) {
         var selectedCollection = new SelectedCollection();
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
            idProperty: 'id'
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
               idProperty: 'id'
            })
         });
         assert.equal(result, undefined);

         result = selectedCollection._beforeMount({
            selectedKeys: [1],
            source: new sourceLib.Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
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
               idProperty: 'id'
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
            selectedCollection = new SelectedCollection(),
            items = [
               new entity.Model({
                  rawData: {id: 1}
               }), new entity.Model({
                  rawData: {id: 2}
               })
            ];

         selectedCollection._options.keyProperty = 'id';

         selectedCollection._setItems(
            new collection.List({
               items: items
            })
         );

         assert.deepEqual(selectedCollection._selectedKeys, [1, 2]);
         assert.equal(selectedCollection._items.getCount(), items.length);

         selectedItems = selectedCollection._items;
         selectedCollection._setItems([]);
         assert.deepEqual(selectedCollection._selectedKeys, []);
         assert.equal(selectedCollection._items.getCount(), 0);
         assert.notEqual(selectedItems, selectedCollection._items);
      });

      it('showSelector', function() {
         var
            templateOptions,
            isShowSelector = false,
            selectedCollection = new SelectedCollection(),
            items = new collection.List(),
            selectedItems,
            opener;

         selectedCollection._options.selectorTemplate = {};
         selectedCollection._items = items;
         selectedCollection._children.selectorOpener = {
            open: function(config) {
               isShowSelector = true;
               templateOptions = config.templateOptions;
               opener = config.opener;
               selectedItems = config.selectedItem;
            }
         };

         selectedCollection.showSelector({
            selectedTab: 'Employees'
         });

         assert.isTrue(isShowSelector);
         assert.isTrue(items !== selectedItems);
         assert.equal(templateOptions.selectedTab, 'Employees');
         assert.equal(opener, selectedCollection);
      });
   });
});
