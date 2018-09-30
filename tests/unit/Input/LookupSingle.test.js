/**
 * Created by am.gerasimov on 31.05.2018.
 */
define([
   'Controls/Input/Lookup',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/List',
   'WS.Data/Source/Memory'
], function(Lookup, Model, List, Memory) {

   function getBaseLookup() {
      return {
         _selectedKeys: [],
         _suggestState: true,
         _notify: function(){},
         _forceUpdate: function(){
            this.isUpdate = true;
         },
         _children: {
            sticky: getBaseSticky()
         },
         _options: {
            keyProperty: 'id'
         }
      }
   }

   function getBaseSticky() {
      return {
         open: function() {
            this.isOpen = true;
         },
         close: function() {
            this.isOpen = false;
         }
      };
   }
   
   describe('Controls/Input/Lookup', function() {
      /* Заглушка, дабы избежать работы с вертской */
      var setStateForDrawCollection = Lookup._private.setStateForDrawCollection;
      Lookup._private.setStateForDrawCollection = function(){};

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
            }),
            item2 = new Model({
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
         assert.equal(self._items.at(0), item);
         
         keysChanged = false;
         Lookup._private.addItem(self, item);
         assert.deepEqual(self._selectedKeys, [1]);
         assert.isFalse(keysChanged);
         assert.equal(self._items.at(0), item);

         self._options.multiSelect = true;
         Lookup._private.addItem(self, item2);
         assert.deepEqual(self._selectedKeys, [1, 2]);
         assert.isTrue(keysChanged);
         assert.equal(self._items.at(0), item);
         assert.equal(self._items.at(1), item2);
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

      it('getAdditionalCollectionWidth', function() {
         var fieldWrapper = {
            offsetWidth: 100
         };

         assert.equal(Lookup._private.getAdditionalCollectionWidth(fieldWrapper, false, false), 0);
         assert.equal(Lookup._private.getAdditionalCollectionWidth(fieldWrapper, false, true), 33);
      });

      it('getInputMinWidth', function() {
         assert.equal(Lookup._private.getInputMinWidth(330, 30), 99);
         assert.equal(Lookup._private.getInputMinWidth(530, 30), 100);
      });

      it('getVisibleItems', function() {
         var
            items = [1, 2, 3, 4, 5],
            itemsSizes = [5, 10, 25, 40, 15];

         assert.deepEqual(Lookup._private.getVisibleItems(items, itemsSizes, 80), [3, 4, 5]);
         assert.deepEqual(Lookup._private.getVisibleItems(items, itemsSizes, 10), [5]);
         assert.deepEqual(Lookup._private.getVisibleItems(items, itemsSizes, 999), items);
      });

      it('getCollectionOptions', function() {
         var items = [1, 2, 3];
         assert.deepEqual(Lookup._private.getCollectionOptions(items, {}).items, items);
      });

      it('getLastSelectedItems', function() {
         var
            lookup = new Lookup(),
            item = new Model({
               rawData: {id: 1},
               idProperty: 'id'
            }),
            item2 = new Model({
               rawData: {id: 2},
               idProperty: 'id'
            })

         lookup._items = new List({
            items: [item, item2]
         });

         assert.deepEqual(Lookup._private.getLastSelectedItems(lookup, 1), [item2]);
         assert.deepEqual(Lookup._private.getLastSelectedItems(lookup, 10), [item, item2]);
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

         var lookupWithReceivedState = new Lookup();
         lookupWithReceivedState._beforeMount({
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
         assert.deepEqual(lookupWithReceivedState._selectedKeys, selectedKeys);
         assert.notEqual(lookupWithReceivedState._selectedKeys, selectedKeys);
         assert.isFalse(lookupWithReceivedState._isEmpty);
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

         lookup._beforeUpdate({
            source: new Memory({
               data: [
                  {id: 1, title: 'Alex', text: 'Alex'}
               ],
               idProperty: 'id'
            })
         });
         assert.isTrue(lookup._isEmpty);
         assert.deepEqual(lookup._selectedKeys, []);

         lookup._beforeUpdate({
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
         }).addCallback(function() {
            lookup._beforeUpdate({
               keyProperty: 'title'
            });
            assert.isFalse(lookup._isEmpty);
            assert.deepEqual(lookup._selectedKeys, ['Alex', 'Ilya']);
         });
         assert.isFalse(lookup._isEmpty);
         assert.deepEqual(lookup._selectedKeys, [1, 2]);
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

      it('_togglePicker', function() {
         if (typeof window !== 'undefined') {
            var lookup = new Lookup();

            lookup._children.sticky = getBaseSticky();
            lookup._isPickerVisible = false;
            lookup._suggestState = true;
            lookup._togglePicker(null, true);

            assert.isTrue(lookup._isPickerVisible);
            assert.isFalse(lookup._suggestState);
            assert.isTrue(lookup._children.sticky.isOpen);
         }
      });

      it('_onClosePicker', function() {
         var lookup = new Lookup();

         lookup._isPickerVisible = true;
         lookup._forceUpdate = function() {
            this.isUpdate = true;
         };
         lookup._onClosePicker();

         assert.isFalse(lookup._isPickerVisible);
         assert.isTrue(lookup.isUpdate);
      });

      it('_changeValueHandler', function() {
         var
            newValue = [],
            lookup = new Lookup();

         lookup._children.sticky = getBaseSticky();
         lookup._notify = function(event, value) {
            if (event === 'valueChanged') {
               newValue = value;
            }
         };
         lookup._changeValueHandler(null, 1);
         assert.deepEqual(newValue, [1]);
         assert.isFalse(lookup._children.sticky.isOpen);
      });
   
      it('_crossClick', function() {
         var
            lookup = new Lookup(),
            idProperty = 'id';

         lookup._children.sticky = getBaseSticky();
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
         assert.equal(lookup._children.sticky.isOpen, false);
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

         lookup._children.sticky = getBaseSticky();
         lookup._suggestState = true;
         lookup._deactivated();
         assert.isFalse(lookup._suggestState);
         assert.equal(lookup._children.sticky.isOpen, false);
      });

      it('_suggestStateChanged', function() {
         var lookup = new Lookup();

         lookup._suggestState = true;
         lookup._isPickerVisible = false;
         lookup._suggestStateChanged();
         assert.isTrue(lookup._suggestState);

         lookup._isPickerVisible = true;
         lookup._suggestStateChanged();
         assert.isFalse(lookup._suggestState);
      });

      it('_determineAutoDropDown', function() {
         var lookup = new Lookup();

         lookup._options.autoDropDown = true;
         lookup._selectedKeys = [];
         lookup._options.multiSelect = false;
         assert.isTrue(lookup._determineAutoDropDown());

         lookup._selectedKeys = [1];
         assert.isFalse(lookup._determineAutoDropDown());

         lookup._options.multiSelect = true;
         assert.isTrue(lookup._determineAutoDropDown());
      });

      it('_onClickShowSelector', function() {
         var
            result,
            isShowSelector = false,
            lookup = new Lookup();

         lookup.showSelector = function(templateOptions) {
            isShowSelector = true;
            result = templateOptions
         };

         lookup._onClickShowSelector();

         assert.isTrue(isShowSelector);
         assert.equal(result, undefined);
      });

      it('showSelector', function() {
         var
            templateOptions,
            isShowSelector = false,
            lookup = new Lookup();

         lookup._options.lookupTemplate = {};
         lookup._children.selectorOpener = {
            open: function(config) {
               isShowSelector = true;
               templateOptions = config.templateOptions;
            }
         };

         lookup.showSelector({
            selectedTab: 'Employees'
         });

         assert.isTrue(isShowSelector);
         assert.equal(templateOptions.selectedTab, 'Employees');
      });
   });
});