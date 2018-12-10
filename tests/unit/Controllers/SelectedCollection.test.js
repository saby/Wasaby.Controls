define([
   'Controls/Selector/SelectedCollection/Controller',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/List',
   'WS.Data/Source/Memory'
], function(SelectedCollection, Model, List, Memory) {

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
               source: new Memory({
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

         assert.isTrue(items['[WS.Data/Collection/List]']);
         assert.isTrue(self._items['[WS.Data/Collection/List]']);
      });

      it('addItem', function() {
         var
            textValue = '',
            keysChanged = false,
            self = getBaseSelectedCollection(),
            item = new Model({
               rawData: {
                  id: 1,
                  title: 'Roman'
               }
            }),
            item2 = new Model({
               rawData: {
                  id: 2,
                  title: 'Aleksey'
               }
            });

         self._notify = function(eventName, data) {
            if (eventName === 'selectedKeysChanged') {
               keysChanged = true;
            } else if (eventName === 'textValueChanged') {
               textValue = data;
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

         self._options.multiSelect = true;
         SelectedCollection._private.addItem(self, item2);
         assert.deepEqual(self._selectedKeys, [1, 2]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.at(0), item);
         assert.equal(self._items.at(1), item2);
         assert.equal(textValue, 'Roman, Aleksey');
      });

      it('removeItem', function() {
         var
            keysChanged = false,
            self = getBaseSelectedCollection(),
            item = new Model({
               rawData: {
                  id: 1
               }
            }),
            fakeItem = new Model({
               rawData: {
                  id: 2
               }
            });

         self._notify = function(eventName) {
            if (eventName === 'selectedKeysChanged') {
               keysChanged = true;
            }
         };

         SelectedCollection._private.addItem(self, item);

         assert.deepEqual(self._selectedKeys, [1]);
         assert.isTrue(keysChanged);

         keysChanged = false;
         SelectedCollection._private.removeItem(self, fakeItem);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);

         SelectedCollection._private.removeItem(self, item);
         assert.deepEqual(self._selectedKeys, []);
         assert.isTrue(keysChanged);
      });

      it('_beforeMount', function() {
         var selectedCollection = new SelectedCollection();
         var selectedKeys = [1];
         var emptySelectedKeys = [];
         var beforeMountResult = selectedCollection._beforeMount({
            selectedKeys: selectedKeys,
            source: new Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
            })
         });

         assert.deepEqual(selectedCollection._selectedKeys, selectedKeys);
         assert.notEqual(selectedCollection._selectedKeys, selectedKeys);

         var collectionWithReceivedState = new SelectedCollection();
         collectionWithReceivedState._beforeMount({
            selectedKeys: selectedKeys,
            source: new Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
            })
         }, null, new List({
            items: [new Model({
               rawData: {id: 1},
               idProperty: 'id'
            })]
         }));
         assert.deepEqual(collectionWithReceivedState._selectedKeys, selectedKeys);
         assert.notEqual(collectionWithReceivedState._selectedKeys, selectedKeys);
      });

      it('_beforeUpdate', function() {
         var selectedCollection = new SelectedCollection();
         var selectedKeys = [1];
         var textValue = '';

         selectedCollection._options.displayProperty = 'title';
         selectedCollection._notify = function(eventName, data) {
            if (eventName === 'textValueChanged') {
               textValue = data;
            }
         };

         selectedCollection._beforeMount({
            selectedKeys: selectedKeys,
            source: new Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
            })
         });

         selectedCollection._beforeUpdate({
            selectedKeys: []
         });
         assert.deepEqual(selectedCollection._selectedKeys, []);

         selectedCollection._beforeUpdate({
            selectedKeys: [1]
         });
         assert.deepEqual(selectedCollection._selectedKeys, [1]);

         selectedCollection._beforeUpdate({
            selectedKeys: [1],
            source: new Memory({
               data: [
                  {id: 1, title: 'Alex', text: 'Alex'}
               ],
               idProperty: 'id'
            })
         });
         assert.deepEqual(selectedCollection._selectedKeys, [1]);

         selectedCollection._beforeUpdate({
            multiSelect: true,
            selectedKeys: [1, 2],
            source: new Memory({
               data: [
                  {id: 1, title: 'Alex', text: 'Alex'},
                  {id: 2, title: 'Ilya', text: 'Ilya'},
                  {id: 3, title: 'Mike', text: 'Mike'}
               ],
               idProperty: 'id'
            }),
            keyProperty: 'id'
         });
         assert.deepEqual(selectedCollection._selectedKeys, [1, 2]);

         selectedCollection._beforeUpdate({
            keyProperty: 'title'
         });
         // т.к items еще не загрузились.
         assert.deepEqual(selectedCollection._selectedKeys, []);
      });

      it('_setItems', function() {
         var
            selectedCollection = new SelectedCollection(),
            items = [
               new Model({
                  rawData: {id: 1}
               }), new Model({
                  rawData: {id: 2}
               })
            ];

         selectedCollection._options.keyProperty = 'id';

         selectedCollection._setItems(
            new List({
               items: items
            })
         );

         assert.deepEqual(selectedCollection._selectedKeys, [1, 2]);
         assert.equal(selectedCollection._items.getCount(), items.length);
      });

      it('showSelector', function() {
         var
            templateOptions,
            isShowSelector = false,
            selectedCollection = new SelectedCollection(),
            opener;

         selectedCollection._options.selectorTemplate = {};
         selectedCollection._children.selectorOpener = {
            open: function(config) {
               isShowSelector = true;
               templateOptions = config.templateOptions;
               opener = config.opener;
            }
         };

         selectedCollection.showSelector({
            selectedTab: 'Employees'
         });

         assert.isTrue(isShowSelector);
         assert.equal(templateOptions.selectedTab, 'Employees');
         assert.equal(opener, selectedCollection);
      });
   });
});