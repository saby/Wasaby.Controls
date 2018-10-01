/**
 * Created by am.gerasimov on 31.05.2018.
 */
define([
   'Controls/Input/Lookup',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/List',
   'WS.Data/Source/Memory',
   'Controls/Popup/Opener/Sticky',
   'Controls/Input/Lookup/_Collection'
], function(Lookup, Model, List, Memory, Sticky, Collection) {

   function getBaseLookup() {
      return {
         _selectedKeys: [],
         _suggestState: true,
         _notify: function(){},
         _forceUpdate: function(){},
         _options: {
            keyProperty: 'id'
         }
      }
   }
   
   describe('Controls/Input/Lookup', function() {
      it('keysChanged', function() {
         var self = getBaseLookup();

         Lookup._private.keysChanged(self);
         
         assert.isTrue(self._isEmpty);
         
         self._selectedKeys = [1];
         Lookup._private.keysChanged(self);
         assert.isFalse(self._isEmpty);
         assert.isFalse(self._suggestState);
      });
      
      it('setSelectedKeys', function() {
         var self = getBaseLookup();
         
         Lookup._private.setSelectedKeys(self, [1]);
         
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(self._isEmpty);
         assert.isFalse(self._suggestState);
      });

      it('LoadItems', function(done) {
         var self = {
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
         Lookup._private.loadItems(self, null, self._options.keyProperty, self._options.selectedKeys, self._options.source).addCallback(function(result) {
            assert.equal(result.at(0).getId(), 1);
            assert.equal(result.at(1).getId(), 2);
            assert.equal(result.getCount(), 2);
            done()
         });
      });

      it('getItems', function() {
         var self = {};
         
         var items = Lookup._private.getItems(self);
         
         assert.isTrue(items['[WS.Data/Collection/List]']);
         assert.isTrue(self._items['[WS.Data/Collection/List]']);
      });
      
      it('addItem', function() {
         var
            keysChanged = false,
            self = getBaseLookup(),
            item = new Model({
               rawData: {
                  id: 1
               }
            });

         self._notify = function(eventName) {
            if (eventName === 'selectedKeysChanged') {
               keysChanged = true;
            }
         };
         
         Lookup._private.addItem(self, item);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.at(0), item);
         
         keysChanged = false;
         Lookup._private.addItem(self, item);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);
         assert.equal(self._items.at(0), item);
      });
      
      it('removeItem', function() {
         var
            keysChanged = false,
            self = getBaseLookup(),
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
         
         Lookup._private.addItem(self, item);
   
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isTrue(keysChanged);
         
         keysChanged = false;
         Lookup._private.removeItem(self, fakeItem);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);
   
         Lookup._private.removeItem(self, item);
         assert.deepEqual(self._selectedKeys, []);
         assert.isTrue(keysChanged);
      });

      it('getCollectionSlice', function() {
         var
            startIndex = 3,
            initialCollection = [7, 2, 4, 11, 4 ,5],
            self = {
               _items: new List({
                  items: initialCollection
               })
            },
            newCollection = Lookup._private.getCollectionSlice(self, startIndex);

         assert.equal(newCollection.getCount(), initialCollection.length - startIndex);
      });

      it('getItemWidth', function() {
         var lookup = new Lookup();

         lookup._children.collection = {
            _options: Collection.getDefaultOptions()
         };

         lookup._items = new List({
            items: [new Model({
               rawData: {
                  id: 1,
                  title: 'Тестовый текст'
               }
            })]
         });

         assert.isTrue(Lookup._private.getItemWidth(lookup, 0) > 100);
      });

      it('getInputMinWidth', function() {
         assert.equal(Lookup._private.getInputMinWidth(330, 30), 99);
         assert.equal(Lookup._private.getInputMinWidth(530, 30), 100);
      });
   
      it('_beforeMount', function() {
         var lookup = new Lookup();
         var selectedKeys = [1];
         var emptySelectedKeys = [];
         var beforeMountResult = lookup._beforeMount({
            selectedKeys: selectedKeys,
            source: new Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
            })
         });
      
         assert.deepEqual(lookup._selectedKeys, selectedKeys);
         assert.notEqual(lookup._selectedKeys, selectedKeys);
         assert.isFalse(lookup._isEmpty);
         
         var emptyLookup = new Lookup();
         lookup._beforeMount({
            selectedKeys: emptySelectedKeys,
            source: new Memory({
               data: [ {id: 1} ],
               idProperty: 'id',
               model: 'testmodel'
            })
         });
         assert.isTrue(emptyLookup._isEmpty);
      });
      it('_beforeUpdate', function() {
         var lookup = new Lookup();
         var selectedKeys = [1];
         lookup._beforeMount({
            selectedKeys: selectedKeys,
            source: new Memory({
               data: [ {id: 1} ],
               idProperty: 'id'
            })
         });
         lookup._beforeUpdate({
            selectedKeys: []
         });
         
         assert.isTrue(lookup._isEmpty);
         assert.deepEqual(lookup._selectedKeys, []);
   
         lookup._beforeUpdate({
            selectedKeys: [1]
         });
         assert.isFalse(lookup._isEmpty);
         assert.deepEqual(lookup._selectedKeys, [1]);
      });
   
      it('_beforeUnmount', function() {
         var lookup = new Lookup();
         lookup._simpleViewModel = true;
         lookup._selectedKeys = [];
         
         lookup._beforeUnmount();
         
         assert.isNull(lookup._simpleViewModel);
         assert.isNull(lookup._selectedKeys);
      });
   
      it('_afterUpdate', function() {
         var lookup = new Lookup();
         lookup._needSetFocusInInput = true;
         lookup._active = true;
         lookup._selectedKeys = [];
         
         var activated = false;
         lookup.activate = function() {
            activated = true;
         };
      
         lookup._afterUpdate();
         assert.isTrue(activated);
      });
   
      it('_crossClick', function() {
         var
            lookup = new Lookup(),
            idProperty = 'id';

         lookup._children.sticky = new Sticky();
         lookup._children.sticky._popupIds = [];
         lookup._selectedKeys = [1];
         lookup._items = new List({
            items: [new Model({
               rawData: {id: 1},
               idProperty: idProperty
            })]
         });
         lookup._options = {
            keyProperty: idProperty
         };

         var keysChangedResult;
         lookup._notify = function(event, value) {
            if (event === 'selectedKeysChanged') {
               keysChangedResult = value;
            }
         };
      
         lookup._crossClick(null, lookup._items.at(0));
         assert.deepEqual(lookup._selectedKeys, []);
         assert.equal(lookup._items.getCount(), 0);
      });

      it('_setItems', function() {
         var
            lookup = new Lookup(),
            items = [
               new Model({
                  rawData: {id: 1}
               }), new Model({
                  rawData: {id: 2}
               })
            ];

         lookup._options.keyProperty = 'id';

         lookup._setItems(
            new List({
               items: items
            })
         );

         assert.deepEqual(lookup._selectedKeys, [1, 2]);
         assert.equal(lookup._items.getCount(), items.length);
      });
      
   
      it('_choose', function() {
         var lookup = new Lookup();
         var activated = false;
      
         lookup._selectedKeys = [];
         lookup._options = {
            keyProperty: 'id'
         };
      
         var keysChangedResult;
         lookup._notify = function(event, value) {
            if (event === 'selectedKeysChanged') {
               keysChangedResult = value[0];
            }
         };

         lookup.activate = function() {
            activated = true;
         };
      
         lookup._choose(null, new Model({rawData: {id: 1}}));
         assert.deepEqual(lookup._selectedKeys, [1]);
         assert.deepEqual(keysChangedResult, [1]);
         assert.equal(lookup._items.at(0).get('id'), 1);
         assert.isTrue(activated);
      });
   
      it('_deactivated', function() {
         var lookup = new Lookup();
         lookup._children.sticky = new Sticky();
         lookup._children.sticky._popupIds = [];
         lookup._suggestState = true;
         
         lookup._deactivated();
         assert.isFalse(lookup._suggestState);
      });
   });
});