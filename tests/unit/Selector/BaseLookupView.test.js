/**
 * Created by am.gerasimov on 31.05.2018.
 */
define([
   'Controls/_lookup/BaseLookupView',
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

   describe('Controls/_lookup/BaseLookupView', function() {
      it('_beforeMount', function() {
         var lookup = new Lookup();
         lookup._beforeMount({multiLine: true, maxVisibleItems: 10, readOnly: true, multiSelect: true});
         assert.equal(lookup._maxVisibleItems, 10);

         lookup._beforeMount({items: getItems(5), readOnly: true, multiSelect: true});
         assert.equal(lookup._maxVisibleItems, 5);

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
            isCalculatingSizes = false,
            items = new collection.List(),
            lookup = new Lookup();

         lookup._calculatingSizes = function() {
            isCalculatingSizes = true;
         };

         lookup._listOfDependentOptions = ['items', 'readOnly'];
         lookup._inputValue = lookup._options.value = '';
         lookup._beforeUpdate({value: 'test'});
         assert.equal(lookup._inputValue, 'test');
         assert.isFalse(isCalculatingSizes);

         lookup._beforeUpdate({
            items: new collection.List(),
            multiLine: true,
            value: ''
         });

         assert.equal(lookup._inputValue, 'test');
         assert.isTrue(isCalculatingSizes);

         isCalculatingSizes = false;
         lookup._options.value = 'diff with new value';
         lookup._beforeUpdate({
            readOnly: !lookup._options.readOnly,
            value: ''
         });

         assert.equal(lookup._inputValue, '');
         assert.isTrue(isCalculatingSizes);
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
         var itemAdded = false;
         var isActivate = false;
         var lookup = new Lookup();

         lookup._notify = function() {
            itemAdded = true;
         };

         lookup.activate = function() {
            isActivate = true;
         };

         lookup._beforeMount({multiLine: true});

         lookup._choose();
         assert.isTrue(itemAdded);
         assert.isFalse(isActivate);

         isActivate = false;
         itemAdded = false;
         lookup._isInputVisible = function() {
            return true;
         };
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
         lookup._suggestStateChanged();
         assert.isFalse(lookup._suggestState);

         lookup._suggestState = true;
         lookup._isInputVisible = function() {
            return true;
         };
         lookup._suggestStateChanged();
         assert.isTrue(lookup._suggestState);

         lookup._infoboxOpened = true;
         lookup._suggestStateChanged();
         assert.isFalse(lookup._suggestState);
      });

      it('_determineAutoDropDown', function() {
         var lookup = new Lookup();

         lookup._isInputVisible = function() {
            return false;
         };
         lookup._options.autoDropDown = true;
         assert.isFalse(lookup._determineAutoDropDown());

         lookup._isInputVisible = function() {
            return true;
         };
         assert.isTrue(lookup._determineAutoDropDown());

         lookup._options.autoDropDown = false;
         assert.isFalse(lookup._determineAutoDropDown());
      });

      it('_onClickShowSelector', function() {
         var
            lookup = new Lookup(),
            stopPropagation = false;

         lookup._suggestState = true;
         lookup._onClickShowSelector({
            stopPropagation: function() {
               stopPropagation = true;
            }
         });

         assert.isFalse(lookup._suggestState);
         assert.isTrue(stopPropagation);
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

      it('_openInfoBox', function() {
         var
            config = {},
            isNotifyOpenPopup = false,
            lookup = new Lookup();

         lookup._suggestState = true;
         lookup._container = {offsetWidth: 100};
         lookup._notify = function(eventName) {
            if (eventName === 'openInfoBox') {
               isNotifyOpenPopup = true;
            }
         };

         lookup._openInfoBox(null, config);
         assert.deepEqual(config, {
            maxWidth: 100
         });
         assert.isFalse(lookup._suggestState);
         assert.isTrue(lookup._infoboxOpened);
         assert.isTrue(isNotifyOpenPopup);
      });

      it('_closeInfoBox', function() {
         var
            isNotifyClosePopup = false,
            lookup = new Lookup();

         lookup._infoboxOpened = true;
         lookup._notify = function(eventName) {
            if (eventName === 'closeInfoBox') {
               isNotifyClosePopup = true;
            }
         };

         lookup._closeInfoBox();
         assert.isFalse(lookup._infoboxOpened);
         assert.isTrue(isNotifyClosePopup);
      });
   });
});