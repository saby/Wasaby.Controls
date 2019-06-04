define(['Controls/toggle', 'Types/source',], function(toggles, sourceLib) {
   'use strict';

   var btn;

   describe('Controls.toggle:CheckboxGroup', function() {
      describe('methods', function() {
         it('prepare items', function() {
            var source = new sourceLib.Memory({
               idProperty: 'id',
               data: [
                  {
                     id: '1',
                     tittle: 'test1',
                     node: true
                  },
                  {
                     id: '2',
                     tittle: 'test2',
                     parent: '1',
                     node: false
                  }
               ]
            });
            var fakeSelf = {},
               result = false;
            toggles.CheckboxGroup.prototype._initItems.call(fakeSelf, source).addCallback(function() {
               assert.equal(fakeSelf._items.at(0).get('id'), 1, '_initItems wrong item id');
               assert.equal(fakeSelf._items.at(1).get('id'), 2, '_initItems wrong item id');
               toggles.CheckboxGroup.prototype.sortGroup.call(fakeSelf, fakeSelf._items);
               assert.equal(fakeSelf._groups[2].get('id'), 1, 'sortGroup set uncorrect items in _group');
               fakeSelf._setItemsSelection = function(item) {
                  assert.equal(this._items.indexOf(item) !== -1, false, '_prepareSelected uncorrect');
               };
               toggles.CheckboxGroup.prototype._prepareSelected.call(fakeSelf, {selectedKeys: [1]});
               done();
            });
         });
         it('operations with key', function() {
            var fakeSelf = {};
            fakeSelf._triStateKeys = ['4'];
            toggles.CheckboxGroup.prototype._addTriStateKey.call(fakeSelf, '4');
            assert.equal(fakeSelf._triStateKeys.length, 1, '_addTriStateKey wrong result');
            toggles.CheckboxGroup.prototype._addTriStateKey.call(fakeSelf, '5');
            assert.equal(fakeSelf._triStateKeys.length, 2, '_addTriStateKey wrong result');

            toggles.CheckboxGroup.prototype._removeTriStateKey.call(fakeSelf, '4');
            assert.equal(fakeSelf._triStateKeys.length, 1, '_removeTriStateKey wrong result');
            toggles.CheckboxGroup.prototype._removeTriStateKey.call(fakeSelf, '5');
            assert.equal(fakeSelf._triStateKeys.length, 0, '_removeTriStateKey wrong result');

            fakeSelf._removeTriStateKey = function() {
               return true;
            };
            fakeSelf._updateItemChildSelection = function() {
               return true;
            };
            fakeSelf._selectedKeys = ['4', '3'];
            toggles.CheckboxGroup.prototype._addKey.call(fakeSelf, '5');
            assert.equal(fakeSelf._selectedKeys.length, 3, '_addKey wrong result');
            toggles.CheckboxGroup.prototype._removeKey.call(fakeSelf, '5');
            assert.equal(fakeSelf._selectedKeys.length, 2, '_addTriStateKey wrong result');
         });

         it('_isSelected', function() {
            var fakeSelf = {};
            fakeSelf._selectedKeys = ['1', '2'];
            fakeSelf._triStateKeys = ['3', '4'];
            fakeSelf._getItemKey = function(key) {
               return key;
            };
            assert.equal(toggles.CheckboxGroup.prototype._isSelected.call(fakeSelf, '5'), false, '_isSelected, unselected item has uncorrect result');
            assert.equal(toggles.CheckboxGroup.prototype._isSelected.call(fakeSelf, '2'), true, '_isSelected, selected item has uncorrect result');
            assert.equal(toggles.CheckboxGroup.prototype._isSelected.call(fakeSelf, '3'), null, '_isSelected, tristate item has uncorrect result');
         });

         it('_getItemKey', function() {
            var fakeSelf = {},
               item = {};
            item.get = function(key) {
               return '5';
            };
            fakeSelf._options = {
               keyProperty: 'key'
            };
            assert.equal(toggles.CheckboxGroup.prototype._getItemKey.call(fakeSelf, item), '5', '_getItemKey, unselected item has uncorrect result');
         });

         it('_valueChangedHandler', function() {
            var fakeSelf = {},
               result = '';
            fakeSelf._addKey = function() {
               result += '_addKey';
            };
            fakeSelf._removeKey = function() {
               result += '_removeKey';
            };
            fakeSelf._updateItemChildSelection = function() {
               result += '_updateItemChildSelection';
            };
            fakeSelf._notifySelectedKeys = function() {
               result += '_notifySelectedKeys';
            };
            fakeSelf._getItemKey = function() {
               return true;
            };
            toggles.CheckboxGroup.prototype._valueChangedHandler.call(fakeSelf, null, null, true);
            assert.equal(result, '_addKey_notifySelectedKeys', '_valueChangedHandler, unselected item has uncorrect result');
            result = '';
            toggles.CheckboxGroup.prototype._valueChangedHandler.call(fakeSelf, null, null, null);
            assert.equal(result, '_removeKey_updateItemChildSelection_notifySelectedKeys', '_valueChangedHandler, unselected item has uncorrect result');
            result = '';
            toggles.CheckboxGroup.prototype._valueChangedHandler.call(fakeSelf, null, null, false);
            assert.equal(result, '_removeKey_updateItemChildSelection_notifySelectedKeys', '_valueChangedHandler, unselected item has uncorrect result');
         });


         it('Selection', function() {
            var fakeSelf = {},
               result = '',
               fakeItem = {};
            fakeItem.get = function(arg) {
               if (arg !== 1) {
                  return true;
               } else {
                  return false;
               }
            };
            fakeSelf._addKey = function() {
               result += '_addKey';
            };
            fakeSelf._removeKey = function() {
               result += '_removeKey';
            };
            fakeSelf._updateItemChildSelection = function() {
               result += '_updateItemChildSelection';
            };
            fakeSelf._notifySelectedKeys = function() {
               result += '_notifySelectedKeys';
            };
            fakeSelf._setItemsSelection = function() {
               result += '_setItemsSelection';
            };
            fakeSelf._getItemKey = function() {
               return '3';
            };
            fakeSelf._groups = {
               '3': [fakeItem]
            };
            fakeSelf.keyProperty = 'key';
            fakeSelf.parentProperty = 'parent';
            fakeSelf._items = {
               getRecordById: function() {
                  return fakeItem;
               }
            };
            fakeSelf._options = {keyProperty: true};
            toggles.CheckboxGroup.prototype._updateItemChildSelection.call(fakeSelf, '3', true);
            assert.equal(result, '_addKey_removeKey_setItemsSelection', '_updateItemChildSelection, unselected item has uncorrect result');
            result = '';
            toggles.CheckboxGroup.prototype._updateItemChildSelection.call(fakeSelf, '2', false);
            assert.equal(result, '_removeKey_setItemsSelection', '_updateItemChildSelection, selected item has uncorrect result');

            fakeSelf._items = {
               getRecordById: function() {
                  return 2;
               }
            };
            fakeSelf._selectedKeys = ['8', '4'];
            fakeSelf._nodeProperty = true;
            result = '';
            toggles.CheckboxGroup.prototype._setItemsSelection.call(fakeSelf, fakeItem);
            assert.equal(result, '_setItemsSelection', '_updateItemChildSelection, item has uncorrect result');
            fakeSelf._nodeProperty = 2;
            fakeSelf._options = {parentProperty: 1};
            toggles.CheckboxGroup.prototype._setItemsSelection.call(fakeSelf, fakeItem);
            assert.equal(result, '_setItemsSelection_setItemsSelection', '_updateItemChildSelection, item has uncorrect result');
         });
      });
   });
});
