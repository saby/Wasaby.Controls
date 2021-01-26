define("ControlsUnit/Selector/Controller.test", ["require", "exports", "Types/entity", "Types/collection", "chai", "Controls/lookupPopup"], function (require, exports, entity_1, collection_1, chai_1, lookupPopup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getSelectedItems = function (itemsCount) {
        var items = new collection_1.List();
        itemsCount = isNaN(itemsCount) ? 5 : itemsCount;
        for (var i = 0; i < itemsCount; i++) {
            items.add(new entity_1.Model({
                rawData: {
                    id: i,
                    otherId: 'otherId-' + i,
                    title: 'title-' + i
                },
                keyProperty: 'id'
            }));
        }
        return items;
    };
    describe('Controls/_lookupPopup/Controller', function () {
        it('prepareItems', function () {
            var itemList = new collection_1.List({ items: [1, 2] });
            chai_1.assert.equal(lookupPopup_1.Controller._prepareItems()._moduleName, 'Types/collection:List');
        });
        it('addItemToSelected', function () {
            var itemNew = new entity_1.Model({
                rawData: {
                    id: 'test',
                    title: 'test'
                }
            });
            var itemToReplace = new entity_1.Model({
                rawData: {
                    id: 0,
                    title: 'test'
                }
            });
            var selectedItems = getSelectedItems();
            lookupPopup_1.Controller._addItemToSelected(itemNew, selectedItems, 'id');
            chai_1.assert.equal(selectedItems.getCount(), 6);
            chai_1.assert.equal(selectedItems.at(5).get('title'), 'test');
            lookupPopup_1.Controller._addItemToSelected(itemToReplace, selectedItems, 'id');
            chai_1.assert.equal(selectedItems.getCount(), 6);
            chai_1.assert.equal(selectedItems.at(0).get('title'), 'test');
        });
        it('removeFromSelected', function () {
            var selectedItems = getSelectedItems();
            var itemToRemove = new entity_1.Model({
                rawData: {
                    id: 0,
                    title: 'test'
                }
            });
            lookupPopup_1.Controller._removeFromSelected(itemToRemove, selectedItems, 'id');
            chai_1.assert.equal(selectedItems.getCount(), 4);
            chai_1.assert.equal(selectedItems.at(0).get('id'), 1);
        });
        describe('processSelectionResult', function () {
            it('multiSelect is not "false"', function () {
                var selectedItems = getSelectedItems();
                var newSelected = getSelectedItems();
                var result = {
                    initialSelection: getSelectedItems().clone(),
                    resultSelection: newSelected,
                    keyProperty: 'id'
                };
                newSelected.removeAt(0);
                newSelected.removeAt(0);
                newSelected.removeAt(2);
                lookupPopup_1.Controller._processSelectionResult([result], selectedItems);
                chai_1.assert.equal(selectedItems.getCount(), 2);
                chai_1.assert.equal(selectedItems.at(0).get('id'), 2);
                chai_1.assert.equal(selectedItems.at(1).get('id'), 3);
                selectedItems.clear();
                lookupPopup_1.Controller._processSelectionResult([result], selectedItems, true, 'otherId');
                chai_1.assert.equal(selectedItems.getCount(), 2);
                chai_1.assert.equal(selectedItems.at(0).get('otherId'), 'otherId-2');
                chai_1.assert.equal(selectedItems.at(1).get('otherId'), 'otherId-3');
            });
            describe('multiSelect is "false"', function () {
                var selectedItems = getSelectedItems(0);
                var newSelectedItems = getSelectedItems(1);
                var result = {
                    initialSelection: [],
                    resultSelection: newSelectedItems,
                    keyProperty: 'id',
                    selectCompleteInitiator: false
                };
                it('selectCompleteInitiator is "false"', function () {
                    lookupPopup_1.Controller._processSelectionResult([result], selectedItems, false);
                    chai_1.assert.equal(selectedItems.getCount(), 0);
                });
                it('selectCompleteInitiator is "true"', function () {
                    result.selectCompleteInitiator = true;
                    lookupPopup_1.Controller._processSelectionResult([result], selectedItems, false);
                    chai_1.assert.equal(selectedItems.getCount(), 1);
                });
            });
        });
    });
});
