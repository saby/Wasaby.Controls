/**
 * Created by am.gerasimov on 31.05.2018.
 */
define(['Controls/Input/Lookup', 'WS.Data/Entity/Model', 'WS.Data/Collection/List', 'WS.Data/Source/Memory'], function(Lookup, Model, List, Memory) {
   
   describe('Controls/Input/Lookup', function() {
      
      it('keysChanged', function() {
         var self = {};
         self._selectedKeys = [];
         self._suggestState = true;
         
         Lookup._private.keysChanged(self);
         
         assert.isTrue(self._isEmpty);
         
         self._selectedKeys = [1];
         Lookup._private.keysChanged(self);
         assert.isFalse(self._isEmpty);
         assert.isFalse(self._suggestState);
      });
      
      it('setSelectedKeys', function() {
         var self = {};
         self._suggestState = true;
         self._selectedKeys = {};
         
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
         Lookup._private.loadItems(self,self._options).addCallback(function(result) {
            assert.equal(result.at(0).getId(), 1);
            assert.equal(result.at(1).getId(), 2);
            assert.equal(result.getCount(), 2);
            done()
         });
      });


      it('removeItem', function() {
         var self = {};
         self._selectedKeys = [1];
         self._notify = function(){};
         
         Lookup._private.setSelectedKeys(self, [1]);
         
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(self._isEmpty);
         assert.isFalse(self._suggestState);
      });
      
      it('getItems', function() {
         var self = {};
         
         var items = Lookup._private.getItems(self);
         
         assert.isTrue(items['[WS.Data/Collection/List]']);
         assert.isTrue(self._items['[WS.Data/Collection/List]']);
      });
      
      it('addItem', function() {
         var self = {
            _selectedKeys: [],
            _options: {
               keyProperty: 'id'
            }
         };
         var item = new Model({
            rawData: {
               id: 1
            }
         });
         var keysChanged = false;
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
         var self = {
            _selectedKeys: [],
            _options: {
               keyProperty: 'id'
            }
         };
         var item = new Model({
            rawData: {
               id: 1
            }
         });
         var fakeItem = new Model({
            rawData: {
               id: 2
            }
         });
         
         var keysChanged = false;
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
   
      it('_beforeMount', function() {
         var lookup = new Lookup();
         var selectedKeys = [1];
         var emptySelectedKeys = [];
         var beforeMountResult = lookup._beforeMount({
            selectedKeys: selectedKeys,
            source: new Memory({
               data: [ {id: 1} ],
               idProperty: 'id',
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
         
         var activated = false;
         lookup.activate = function() {
            activated = true;
         };
      
         lookup._afterUpdate();
         assert.isTrue(activated);
      });
   
      it('_crossClick', function() {
         var lookup = new Lookup();
         var activated = false;
         
         lookup._selectedKeys = [1];
         lookup._items = new List({items: ['test']});
         lookup._options = {
            keyProperty: 'id'
         };
      
         var keysChangedResult;
         lookup._notify = function(event, value) {
            if (event === 'selectedKeysChanged') {
               keysChangedResult = value;
            }
         };
      
         lookup._crossClick(null, new Model({rawData: {id: 1}}));
         assert.deepEqual(lookup._selectedKeys, []);
         assert.equal(lookup._items.getCount(), 0);
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
         
         var activated = false;
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
         lookup._suggestState = true;
         
         lookup._deactivated();
         assert.isFalse(lookup._suggestState);
      });

   });
   
});