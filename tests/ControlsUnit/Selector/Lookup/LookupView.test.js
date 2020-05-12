/**
 * Created by am.gerasimov on 31.05.2018.
 */
define([
   'Controls/_lookup/Lookup/LookupView',
   'Types/entity',
   'Types/collection'
], function(Lookup, entity, collection) {
   'use strict';

   function getItems(countItems) {
      for (var items = []; countItems; countItems--) {
         items.push(new entity.Model({
            rawData: {id: countItems},
            keyProperty: 'id'
         }));
      }

      return new collection.List({
         items: items
      });
   }

   describe('Controls/_lookup/Lookup/LookupView', function() {
      it('getAvailableCollectionWidth', function() {
         var afterFieldWrapperWidth = 20;
         var self = new Lookup();

         self._fieldWrapperWidth = 100;
         self._fieldWrapperMinHeight = 24;
         self._fieldWrapper = {
            offsetWidth: 110
         };

         assert.equal(Lookup._private.getAvailableCollectionWidth(self, afterFieldWrapperWidth, false, false), 80);
         assert.equal(Lookup._private.getAvailableCollectionWidth(self, afterFieldWrapperWidth, false, true), 50);
         assert.equal(Lookup._private.getAvailableCollectionWidth(self, afterFieldWrapperWidth, false, false, true), 50);

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
               keyProperty: 'id'
            }),
            item2 = new entity.Model({
               rawData: {id: 2},
               keyProperty: 'id'
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

      it('getInputWidth', function() {
         assert.equal(Lookup._private.getInputWidth(400, 200, 100), undefined);
         assert.equal(Lookup._private.getInputWidth(400, 200, 300), 200);
      });

      it('getMultiLineState', function() {
         assert.isTrue(Lookup._private.getMultiLineState(200, 100, true));
         assert.isFalse(Lookup._private.getMultiLineState(200, 300, true));
         assert.isTrue(Lookup._private.getMultiLineState(200, 300, false));
      });

      it('_isNeedCalculatingSizes', function() {
         var lookup = new Lookup();

         assert.isFalse(lookup._isNeedCalculatingSizes({
            items: getItems(0),
            multiSelect: true,
            readOnly: false
         }));
         assert.isFalse(!!lookup._isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: false,
            readOnly: false
         }));
         assert.isTrue(lookup._isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: false,
            readOnly: false,
            comment: 'notEmpty'
         }));
         assert.isFalse(lookup._isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: true,
            readOnly: true
         }));

         assert.isTrue(lookup._isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: true,
            readOnly: false
         }));
         assert.isTrue(lookup._isNeedCalculatingSizes({
            items: getItems(2),
            multiSelect: true,
            readOnly: true
         }));
      });

      it('_isInputVisible', function() {
         var lookup = new Lookup();

         assert.isTrue(lookup._isInputVisible({
               multiSelect: false,
               items: getItems(0)
            }
         ));

         assert.isFalse(!!lookup._isInputVisible({
            multiSelect: false,
            items: getItems(1)
         }));

         assert.isTrue(!!lookup._isInputVisible({
            multiSelect: false,
            comment: 'notEmpty',
            items: getItems(1)
         }));

         assert.isTrue(lookup._isInputVisible({
            multiSelect: true,
            items: getItems(1)
         }));

         assert.isFalse(!!lookup._isInputVisible({
            multiSelect: true,
            items: getItems(1),
            readOnly: true
         }));

         lookup._inputValue = 'notEmpty';
         assert.isFalse(lookup._isInputVisible({
            multiSelect: true,
            items: getItems(0),
            readOnly: true
         }));

         assert.isTrue(lookup._isInputVisible({
            multiSelect: false,
            items: getItems(0),
            readOnly: true
         }));
      });

      it('_isInputActive', function() {
         let lookup = new Lookup();

         assert.isTrue(lookup._isInputActive({
               multiSelect: false,
               items: getItems(0)
            }
         ));

         assert.isFalse(lookup._isInputActive({
            multiSelect: false,
            items: getItems(1)
         }));

         assert.isTrue(lookup._isInputActive({
            multiSelect: true,
            items: getItems(1)
         }));

         assert.isFalse(lookup._isInputActive({
            multiSelect: true,
            items: getItems(1),
            readOnly: true
         }));
      });

      it('_calculatingSizes', function() {
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
         lookup._calculatingSizes(newOptions);
         assert.isFalse(lookup._multiLineState);
         assert.equal(lookup._counterWidth, 20);

         // из 300 px, 100 для input, 20 для счетчика, для коллекции остается 180, в которую влезут 3 по 50.
         assert.equal(lookup._maxVisibleItems, 3);

         // Если айтема 4, то влезут все, т.к не нужно показывать счетчик
         newOptions.items = getItems(4);
         lookup._calculatingSizes(newOptions);
         assert.equal(lookup._maxVisibleItems, 4);

         newOptions.multiLine = true;
         lookup._calculatingSizes(newOptions);
         assert.isFalse(lookup._multiLineState);
         assert.equal(lookup._inputWidth, 100);
         assert.equal(lookup._maxVisibleItems, 7);
         assert.equal(lookup._counterWidth, undefined);

         // Инпут на уровне с последними элементами коллекции(расположение по строкам 3-4-4-1 и input)
         newOptions.items = getItems(12);
         lookup._calculatingSizes(newOptions);
         assert.isTrue(lookup._multiLineState);
         assert.equal(lookup._inputWidth, 250);

         // Инпут с новой строки(расположение 3-4-4-input)
         newOptions.items = getItems(11);
         lookup._calculatingSizes(newOptions);
         assert.equal(lookup._inputWidth, undefined);

         // Режим readOnly
         newOptions.readOnly = true;
         newOptions.multiSelect = false;
         lookup._calculatingSizes(newOptions);
         assert.equal(lookup._inputWidth, undefined);
         assert.equal(lookup._maxVisibleItems, newOptions.items.getCount());

         Lookup._private.getItemsSizesLastRow = getItemsSizesLastRow;
         Lookup._private.getCounterWidth = getCounterWidth;
      });

      it('_openInfoBox', function() {
         const sandbox = sinon.createSandbox();

         let
            config = {},
            lookup = new Lookup();

         lookup._getContainer = function() {
            return {};
         };

         if (window) {
            try {
               let stubGetComputedStyle = sinon.stub(window, 'getComputedStyle').returns({paddingLeft: '4px', borderLeftWidth: '1px'});
               Lookup._private.initializeConstants(lookup);
               lookup._openInfoBox(null, config);

               assert.equal(config.offset.horizontal, -5);
            } finally {
               stubGetComputedStyle.restore();
            }
         } else {
            lookup._openInfoBox(null, config);

            assert.equal(config.offset.horizontal, 0);
         }
      });

      it('_private.getCollectionOptions', function() {
         var standardOptions = {
            itemTemplate: 'testItemTemplate',
            readOnly: 'testReadOnly',
            displayProperty: 'testReadOnly',
            itemsLayout: 'oneRow',
            maxVisibleItems: 10,
            _counterWidth: '10px',
            theme: 'default'
         };

         var controlOptions = {
            itemTemplate: 'testItemTemplate',
            readOnly: 'testReadOnly',
            displayProperty: 'testReadOnly',
            multiLine: false,
            theme: 'default'
         };

         assert.deepEqual(Lookup._private.getCollectionOptions(controlOptions, 10, '10px'), standardOptions);

         delete controlOptions.itemTemplate;
         assert.isFalse(Lookup._private.getCollectionOptions(controlOptions, 10, '10px').hasOwnProperty('itemTemplate'));
      });
   });
});
