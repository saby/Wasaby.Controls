/**
 * Created by am.gerasimov on 31.05.2018.
 */
define([
   'Controls/Selector/Lookup/_Lookup',
   'Types/entity',
   'Types/collection',
   'Env/Env'
], function(Lookup, entity, collection, Env) {

   function getItems(countItems) {
      for (var items = []; countItems; countItems--) {
         items.push(new entity.Model({
            rawData: {id: countItems},
            idProperty: 'id'
         }));
      }

      return new collection.List({
         items: items
      });
   }

   describe('Controls/Selector/Lookup/_Lookup', function() {
      it('getAvailableCollectionWidth', function() {

         var fieldWrapperWidth = 100;
         var afterFieldWrapperWidth = 20;
         var fieldWrapper = {
            offsetWidth: 110
         };

         assert.equal(Lookup._private.getAvailableCollectionWidth(fieldWrapper, fieldWrapperWidth, afterFieldWrapperWidth, false, false), 80);
         assert.equal(Lookup._private.getAvailableCollectionWidth(fieldWrapper, fieldWrapperWidth,  10, false, true), 57);
      });

      it('getInputMinWidth', function() {
         assert.equal(Lookup._private.getInputMinWidth(330, 30), 99);
         assert.equal(Lookup._private.getInputMinWidth(530, 30), 100);
      });

      it('getMaxVisibleItems', function() {
         var
            items = [1, 2, 3, 4, 5],
            itemsSizes = [5, 10, 25, 40, 15];

         assert.deepEqual(Lookup._private.getMaxVisibleItems(items, itemsSizes, 80), 3);
         assert.deepEqual(Lookup._private.getMaxVisibleItems(items, itemsSizes, 10), 1);
         assert.deepEqual(Lookup._private.getMaxVisibleItems(items, itemsSizes, 999), items.length);
      });

      it('getLastSelectedItems', function() {
         var
            item = new entity.Model({
               rawData: {id: 1},
               idProperty: 'id'
            }),
            item2 = new entity.Model({
               rawData: {id: 2},
               idProperty: 'id'
            }),
            items = new collection.List({
               items: [item, item2]
            });

         assert.deepEqual(Lookup._private.getLastSelectedItems(items, 1), [item2]);
         assert.deepEqual(Lookup._private.getLastSelectedItems(items, 10), [item, item2]);
      });

      it('isShowCounter', function() {
         assert.isTrue(Lookup._private.isShowCounter(true, 10, 5));
         assert.isFalse(Lookup._private.isShowCounter(true, 10, 20));
         assert.isTrue(Lookup._private.isShowCounter(false, 2));
         assert.isFalse(Lookup._private.isShowCounter(false, 1));
      });

      it('getLastRowCollectionWidth', function() {
         var itemsSizes = [10, 20, 30, 40];

         assert.equal(Lookup._private.getLastRowCollectionWidth(itemsSizes, false, false, 20), 100);
         assert.equal(Lookup._private.getLastRowCollectionWidth(itemsSizes, true, true, 20), 120);
      });

      it('getInputWidth', function() {
         assert.equal(Lookup._private.getInputWidth(400, 200, 100), undefined);
         assert.equal(Lookup._private.getInputWidth(400, 200, 300), 200);
      });

      it('getMultiLineState', function() {
         assert.isTrue(Lookup._private.getMultiLineState(200, 100, true));
         assert.isFalse(Lookup._private.getMultiLineState(200, 300, true));
         assert.isTrue(Lookup._private.getMultiLineState(200, 300, false));
      });

      it('isNeedUpdate', function() {
         assert.isFalse(Lookup._private.isNeedUpdate(true, 5, false, true, 10));
         assert.isTrue(Lookup._private.isNeedUpdate(true, 5, true, true, 10));
         assert.isTrue(Lookup._private.isNeedUpdate(true, 5, false, false, 10));
         assert.isTrue(Lookup._private.isNeedUpdate(true, 5, false, true, 3));
         assert.isFalse(Lookup._private.isNeedUpdate(false, 5, false, true, 3));
      });

      it('isNeedCalculatingSizes', function() {
         assert.isFalse(Lookup._private.isNeedCalculatingSizes({
            items: getItems(0),
            multiSelect: true,
            readOnly: false
         }));
         assert.isFalse(Lookup._private.isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: false,
            readOnly: false
         }));
         assert.isFalse(Lookup._private.isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: true,
            readOnly: true
         }));

         assert.isTrue(Lookup._private.isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: true,
            readOnly: false
         }));
         assert.isTrue(Lookup._private.isNeedCalculatingSizes({
            items: getItems(2),
            multiSelect: true,
            readOnly: true
         }));
      });

      it('_beforeMount', function() {
         var lookup = new Lookup();
         lookup._beforeMount({multiLine: true, maxVisibleItems: 10, readOnly: true, multiSelect: true});
         assert.isNotNull(lookup._simpleViewModel);
         assert.equal(lookup._maxVisibleItems, 10);

         lookup._beforeMount({items: getItems(5), readOnly: true, multiSelect: true});
         assert.equal(lookup._maxVisibleItems, 5);

         lookup._maxVisibleItems = null;
         lookup._beforeMount({items: getItems(5), multiSelect: true});
         assert.equal(lookup._maxVisibleItems, null);

         lookup._beforeMount({items: getItems(5), readOnly: true});
         assert.equal(lookup._maxVisibleItems, 1);

         lookup._beforeMount({items: getItems(5), value: 'test'});
         assert.equal(lookup._maxVisibleItems, 1);
         assert.equal(lookup._inputValue, 'test');
      });

      it('_beforeUnmount', function() {
         var lookup = new Lookup();
         lookup._simpleViewModel = true;
         lookup._beforeUnmount();

         assert.isNull(lookup._simpleViewModel);
      });

      it('_afterUpdate', function() {
         var activated = false;
         var lookup = new Lookup();

         lookup._needSetFocusInInput = true;
         lookup._active = true;
         lookup._options.items = getItems(0);
         lookup.activate = function() {
            activated = true;
         };

         lookup._afterUpdate();
         assert.isTrue(activated);
      });

      it('_beforeUpdate', function() {
         var
            items = new collection.List(),
            lookup = new Lookup();

         lookup._inputValue = lookup._options.value = '';
         lookup._beforeMount({multiLine: true});
         lookup._beforeUpdate({value: 'test'});
         assert.equal(lookup._multiLineState, undefined);
         assert.equal(lookup._counterWidth, undefined);
         assert.equal(lookup._inputValue, 'test');

         lookup._beforeUpdate({
            items: new collection.List(),
            multiLine: true,
            value: ''
         });
         assert.isFalse(lookup._multiLineState);
         assert.equal(lookup._maxVisibleItems, 0);
         assert.equal(lookup._inputValue, 'test');

         lookup._options.value = 'diff with new value';
         lookup._beforeUpdate({
            items: new collection.List(),
            maxVisibleItems: 10,
            value: ''
         });
         assert.equal(lookup._maxVisibleItems, 0);
         assert.equal(lookup._inputWidth, undefined);
         assert.equal(lookup._availableWidthCollection, undefined);
         assert.equal(lookup._inputValue, '');

         lookup._counterWidth = 30;
         lookup._options.items = items;
         lookup._beforeUpdate({
            items: items
         });
         assert.equal(lookup._counterWidth, 30);

         lookup._beforeUpdate({
            items: items,
            readOnly: true
         });
         assert.equal(lookup._counterWidth, undefined);
      });

      it('_changeValueHandler', function() {
         var
            newValue = [],
            lookup = new Lookup();

         lookup._notify = function(event, value) {
            if (event === 'valueChanged') {
               newValue = value;
            }
         };
         lookup._changeValueHandler(null, 1);
         assert.deepEqual(newValue, [1]);
      });

      it('_choose', function() {
         var isActivate = false;
         var itemAdded = false;
         var lookup = new Lookup();

         function resetTestVars() {
            isActivate = false;
            itemAdded = false;
         }

         lookup._notify = function() {
            itemAdded = true;
         };

         lookup.activate = function() {
            isActivate = true;
            assert.isFalse(itemAdded);
         };

         lookup._beforeMount({multiLine: true});

         lookup._choose();
         assert.isTrue(itemAdded);
         assert.isFalse(isActivate);
         resetTestVars();

         lookup._options.multiSelect = true;
         lookup._choose();
         assert.isTrue(itemAdded);
         assert.isTrue(isActivate);
      });

      it('_deactivated', function() {
         var lookup = new Lookup();
         lookup._suggestState = true;
         lookup._deactivated();
         assert.isFalse(lookup._suggestState);
      });

      it('_suggestStateChanged', function() {
         var lookup = new Lookup();

         lookup._suggestState = true;
         lookup._isPickerVisible = false;
         lookup._options.items = getItems(0);
         lookup._suggestStateChanged();
         assert.isTrue(lookup._suggestState);

         lookup._options.readOnly = true;
         lookup._suggestStateChanged();
         assert.isFalse(lookup._suggestState);

         lookup._suggestState = true;
         lookup._infoboxOpened = true;
         lookup._options.readOnly = false;
         lookup._suggestStateChanged();
         assert.isFalse(lookup._suggestState);

         lookup._suggestState = true;
         lookup._infoboxOpened = false;
         lookup._options.items = getItems(1);
         lookup._suggestStateChanged();
         assert.isFalse(lookup._suggestState);
      });

      it('_isInputVisible', function() {
         var lookup = new Lookup();

         lookup._options.multiSelect = false;
         lookup._options.items = getItems(0);
         assert.isTrue(lookup._isInputVisible());

         lookup._options.items = getItems(1);
         assert.isFalse(lookup._isInputVisible());

         lookup._options.multiSelect = true;
         assert.isTrue(lookup._isInputVisible());

         lookup._options.readOnly = true;
         assert.isFalse(lookup._isInputVisible());
      });

      it('_determineAutoDropDown', function() {
         var lookup = new Lookup();

         lookup._options.autoDropDown = true;
         lookup._options.items = getItems(0);
         lookup._options.multiSelect = false;
         assert.isTrue(lookup._determineAutoDropDown());

         lookup._options.items = getItems(1);
         assert.isFalse(lookup._determineAutoDropDown());

         lookup._options.multiSelect = true;
         assert.isTrue(lookup._determineAutoDropDown());
      });

      it('_onClickShowSelector', function() {
         var lookup = new Lookup();

         lookup._suggestState = true;
         lookup._onClickShowSelector();

         assert.isFalse(lookup._suggestState);
      });

      it('_onClickClearRecords', function() {
         var
            activated = false,
            lookup = new Lookup();

         lookup.activate = function() {
            activated = true;
         };

         lookup._onClickClearRecords();
         assert.isTrue(activated);
      });

      it('_keyDown', function() {
         var
            isNotifyRemoveItems = false,
            lookup = new Lookup(),
            eventBackspace = {
               nativeEvent: {
                  keyCode: Env.constants.key.backspace
               },
               stopImmediatePropagation: function() {}
            },
            eventNotBackspace = {
               nativeEvent: {},
               stopImmediatePropagation: function() {}
            };

         lookup._notify = function(eventName, result) {
            if (eventName === 'removeItem') {
               isNotifyRemoveItems = true;
               assert.equal(lookup._options.items.at(lookup._options.items.getCount() - 1), result[0]);
            }
         };

         lookup._beforeMount({
            value: ''
         });
         lookup._options.items = getItems(0);
         lookup._keyDown(eventBackspace);
         assert.isFalse(isNotifyRemoveItems);

         lookup._options.items = getItems(5);
         lookup._keyDown(eventNotBackspace);
         assert.isFalse(isNotifyRemoveItems);

         lookup._keyDown(eventBackspace);
         assert.isTrue(isNotifyRemoveItems);
         isNotifyRemoveItems = false;

         lookup._beforeMount({
            value: 'not empty valeue'
         });
         lookup._keyDown(eventBackspace);
         assert.isFalse(isNotifyRemoveItems);
      });
   });
});