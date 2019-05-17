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
         var afterFieldWrapperWidth = 20;
         var self = {
            _fieldWrapperWidth: 100,
            _fieldWrapperMinHeight: 24,
            _fieldWrapper: {
               offsetWidth: 110
            }
         };

         assert.equal(Lookup._private.getAvailableCollectionWidth(self, afterFieldWrapperWidth, false, false), 80);
         assert.equal(Lookup._private.getAvailableCollectionWidth(self, afterFieldWrapperWidth, false, true), 50);

         self._fieldWrapperMinHeight = 5;
         assert.equal(Lookup._private.getAvailableCollectionWidth(self, afterFieldWrapperWidth, false, true), 60);
      });

      it('getInputMinWidth', function() {
         assert.equal(Lookup._private.getInputMinWidth(330, 30, 24), 96);
         assert.equal(Lookup._private.getInputMinWidth(330, 30, 30), 100);
         assert.equal(Lookup._private.getInputMinWidth(150, 30, 24), 40);
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

      it('calculatingSizes', function() {
         var
         // min width const 4 * FIELD_WRAPPER_MIN_HEIGHT = 100;
            FIELD_WRAPPER_MIN_HEIGHT = 25,
            FIELD_WRAPPER_WIDTH = 300,
            ITEM_WIDTH = 50,
            COUNTER_WIDTH = 20,
            MAX_ITEMS_IN_ONE_ROW = FIELD_WRAPPER_WIDTH / ITEM_WIDTH;

         var
            lookup = new Lookup(),
            getItemsSizesLastRow = Lookup._private.getItemsSizesLastRow,
            getCounterWidth = Lookup._private.getCounterWidth,
            newOptions = {
               maxVisibleItems: 7,
               items: getItems(6),
               multiSelect: true,
               multiLine: false,
               readOnly: false
            };

         lookup._fieldWrapper = {
            offsetWidth: FIELD_WRAPPER_WIDTH
         };
         lookup._fieldWrapperWidth = FIELD_WRAPPER_WIDTH;
         lookup._fieldWrapperMinHeight = FIELD_WRAPPER_MIN_HEIGHT;

         Lookup._private.getItemsSizesLastRow = function() {
            var numberItems = newOptions.items.getCount();

            if (newOptions.multiLine) {

               // Счетчик сместит запись
               if (newOptions.items.getCount() > newOptions.maxVisibleItems) {
                  numberItems++;
               }

               numberItems = numberItems % MAX_ITEMS_IN_ONE_ROW || MAX_ITEMS_IN_ONE_ROW;
            }

            return new Array(numberItems).fill(ITEM_WIDTH);
         };

         Lookup._private.getCounterWidth = function() {
            return COUNTER_WIDTH;
         };

         newOptions.multiSelect = true;
         Lookup._private.calculatingSizes(lookup, newOptions);
         assert.isFalse(lookup._multiLineState);
         assert.equal(lookup._counterWidth, 20);

         // из 300 px, 100 для input, 20 для счетчика, для коллекции остается 180, в которую влезут 3 по 50.
         assert.equal(lookup._maxVisibleItems, 3);

         // Если айтема 4, то влезут все, т.к не нужно показывать счетчик
         newOptions.items = getItems(4);
         Lookup._private.calculatingSizes(lookup, newOptions);
         assert.equal(lookup._maxVisibleItems, 4);

         newOptions.multiLine = true;
         Lookup._private.calculatingSizes(lookup, newOptions);
         assert.isFalse(lookup._multiLineState);
         assert.equal(lookup._inputWidth, 100);
         assert.equal(lookup._maxVisibleItems, 7);
         assert.equal(lookup._counterWidth, undefined);

         // Инпут на уровне с последними элементами коллекции(расположение по строкам 3-4-4-1 и input)
         newOptions.items = getItems(12);
         Lookup._private.calculatingSizes(lookup, newOptions);
         assert.isTrue(lookup._multiLineState);
         assert.equal(lookup._inputWidth, 250);

         // Инпут с новой строки(расположение 3-4-4-input)
         newOptions.items = getItems(11);
         Lookup._private.calculatingSizes(lookup, newOptions);
         assert.equal(lookup._inputWidth, undefined);

         // Режим readOnly
         newOptions.readOnly = true;
         newOptions.multiSelect = false;
         Lookup._private.calculatingSizes(lookup, newOptions);
         assert.equal(lookup._inputWidth, undefined);
         assert.equal(lookup._maxVisibleItems, newOptions.items.getCount());

         Lookup._private.getItemsSizesLastRow = getItemsSizesLastRow;
         Lookup._private.getCounterWidth = getCounterWidth;
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
            isNotifyShowSelector= false,
            isNotifyRemoveItems = false,
            lookup = new Lookup(),
            eventBackspace = {
               nativeEvent: {
                  keyCode: Env.constants.key.backspace
               }
            },
            eventNotBackspace = {
               nativeEvent: {}
            },
            eventF2 = {
               nativeEvent: {
                  keyCode: 113
               }
            };

         lookup._notify = function(eventName, result) {
            if (eventName === 'removeItem') {
               isNotifyRemoveItems = true;
               assert.equal(lookup._options.items.at(lookup._options.items.getCount() - 1), result[0]);
            } else if (eventName === 'showSelector') {
               isNotifyShowSelector = true;
            }
         };

         lookup._beforeMount({
            value: ''
         });
         lookup._options.items = getItems(0);
         lookup._keyDown(null, eventBackspace);
         assert.isFalse(isNotifyRemoveItems);

         lookup._options.items = getItems(5);
         lookup._keyDown(null, eventNotBackspace);
         assert.isFalse(isNotifyRemoveItems);

         lookup._keyDown(null, eventBackspace);
         assert.isTrue(isNotifyRemoveItems);
         isNotifyRemoveItems = false;

         lookup._beforeMount({
            value: 'not empty valeue'
         });
         lookup._keyDown(null, eventBackspace);
         assert.isFalse(isNotifyRemoveItems);
         assert.isFalse(isNotifyShowSelector);

         lookup._keyDown(null, eventF2);
         assert.isTrue(isNotifyShowSelector);
      });
   });
});