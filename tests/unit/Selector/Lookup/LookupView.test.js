/**
 * Created by am.gerasimov on 31.05.2018.
 */
define([
   'Controls/_lookup/Lookup/LookupView',
   'Types/entity',
   'Types/collection'
], function(Lookup, entity, collection) {

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

   describe('Controls/_lookup/Lookup/LookupView', function() {
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

      it('_isNeedCalculatingSizes', function() {
         var lookup = new Lookup();

         assert.isFalse(lookup._isNeedCalculatingSizes({
            items: getItems(0),
            multiSelect: true,
            readOnly: false
         }));
         assert.isFalse(lookup._isNeedCalculatingSizes({
            items: getItems(1),
            multiSelect: false,
            readOnly: false
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

         assert.isFalse(lookup._isInputVisible({
            multiSelect: false,
            items: getItems(1)
         }));

         assert.isTrue(lookup._isInputVisible({
            multiSelect: true,
            items: getItems(1)
         }));

         assert.isFalse(lookup._isInputVisible({
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
   });
});