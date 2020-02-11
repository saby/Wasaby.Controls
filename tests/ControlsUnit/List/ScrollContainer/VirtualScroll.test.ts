import controller from 'Controls/_list/ScrollContainer/VirtualScroll';
import {assert} from 'chai';

function generateContainer(itemsHeights: number[]): { children: object[] } {
    return {
        children: itemsHeights.map((item) => {
            return {
                getBoundingClientRect(): Partial<DOMRect> {
                    return {
                        height: item
                    };
                },
                className: ''
            };
        })
    };
}

describe('Controls/_list/ScrollContainer/VirtualScroll', () => {
    describe('.resetRange', () => {
        const resetPlaceholdersValue = {top: 0, bottom: 0};

        describe('by index', () => {
            let instance: controller;
            beforeEach(() => {
                instance = new controller({pageSize: 5}, {});
            });
            it('from start', () => {
                assert.deepEqual({range: {start: 0, stop: 5}, placeholders: resetPlaceholdersValue},
                    instance.resetRange(0, 10));
            });
            it('from middle', () => {
                assert.deepEqual({range: {start: 3, stop: 8}, placeholders: resetPlaceholdersValue},
                    instance.resetRange(3, 10));
            });
            it('from ending', () => {
                assert.deepEqual({range: {start: 5, stop: 10}, placeholders: resetPlaceholdersValue},
                    instance.resetRange(8, 10));
            });
            it('page size is more than items count', () => {
                assert.deepEqual({range: {start: 0, stop: 3}, placeholders: resetPlaceholdersValue},
                    instance.resetRange(0, 3));
            });
            it('page size not specified', () => {
                instance = new controller({}, {});
                assert.deepEqual({range: {start: 0, stop: 10}, placeholders: resetPlaceholdersValue},
                    instance.resetRange(0, 10));
            });
        });
        describe('by item height property', () => {
            let instance: controller;
            const itemsHeights = {itemsHeights: [20, 30, 40, 50, 60, 70, 80, 90]};
            beforeEach(() => {
                instance = new controller({}, {viewport: 200});
            });
            it('from start', () => {
                assert.deepEqual({range: {start: 0, stop: 6}, placeholders: {top: 0, bottom: 170}},
                    instance.resetRange(0, 8, itemsHeights));
            });
            it('from middle', () => {
                assert.deepEqual({range: {start: 2, stop: 6}, placeholders: {top: 50, bottom: 170}},
                    instance.resetRange(2, 8, itemsHeights));
            });
            it('from ending', () => {
                assert.deepEqual({range: {start: 5, stop: 8}, placeholders: {top: 200, bottom: 0}},
                    instance.resetRange(6, 8, itemsHeights));
            });
        });
    });
    describe('.shiftRangeToScrollPosition', () => {
        let instance: controller;
        beforeEach(() => {
            instance = new controller({pageSize: 5}, {trigger: 10});
            instance.resetRange(0, 8, {itemsHeights: [20, 20, 20, 20, 20, 20, 20, 20]});
        });

        it('top position', () => {
            assert.deepEqual({range: {start: 0, stop: 5}, placeholders: {top: 0, bottom: 60}},
                instance.shiftRangeToScrollPosition(0));
        });
        it('middle position', () => {
            assert.deepEqual({range: {start: 2, stop: 7}, placeholders: {top: 40, bottom: 20}},
                instance.shiftRangeToScrollPosition(100));
        });
        it('end position', () => {
            assert.deepEqual({range: {start: 3, stop: 8}, placeholders: {top: 60, bottom: 0}},
                instance.shiftRangeToScrollPosition(160));
        });
    });
    describe('.insertItems', () => {
        let instance: controller;

        beforeEach(() => {
            instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            // @ts-ignore
            instance.resetRange(0, 10, {itemsHeights: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60]});
        });

        it('at begining', () => {
            instance.updateItemsCount(12);
            assert.deepEqual({range: {start: 2, stop: 7}, placeholders: {top: 60, bottom: 300}},
                instance.insertItems(0, 2));
        });
        it('at middle', () => {
            instance.updateItemsCount(12);
            assert.deepEqual({range: {start: 0, stop: 5}, placeholders: {top: 0, bottom: 300}},
                instance.insertItems(5, 2));
        });
        it('at ending', () => {
            instance.updateItemsCount(11);
            assert.deepEqual({range: {start: 0, stop: 5}, placeholders: {top: 0, bottom: 360}},
                instance.insertItems(3, 1));
        });
    });
    describe('.removeItems', () => {
        let instance: controller;

        beforeEach(() => {
            instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            instance.resetRange(0, 10, {itemsHeights: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60]});
        });

        it('at begining', () => {
            instance.updateItemsCount(9);

            assert.deepEqual({range: {start: 0, stop: 5}, placeholders: {top: 0, bottom: 240}},
                instance.removeItems(0, 1));
        });
        it('at middle', () => {
            instance.updateItemsCount(9);

            assert.deepEqual({range: {start: 0, stop: 5}, placeholders: {top: 0, bottom: 240}},
                instance.removeItems(3, 1));
        });
        it('at ending', () => {
            instance.updateItemsCount(9);

            assert.deepEqual({range: {start: 0, stop: 5}, placeholders: {top: 0, bottom: 240}},
                instance.removeItems(5, 1));
        });
    });
    describe('.shiftRange', () => {
        const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});

        it('to up', () => {
            instance.resetRange(2, 10, {itemsHeights: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60]});

            assert.deepEqual({
                range: {start: 1, stop: 6},
                placeholders: {top: 60, bottom: 240}
            }, instance.shiftRange('up'));
        });
        it('to down', () => {
            instance.resetRange(0, 10, {itemsHeights: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60]});

            assert.deepEqual({
                range: {start: 3, stop: 5},
                placeholders: {top: 180, bottom: 300}
            }, instance.shiftRange('down'));
        });
    });
    describe('.isNeedToRestorePosition', () => {
        it('after reset range', () => {
            const instance = new controller({pageSize: 5}, {});
            instance.resetRange(0, 10);

            assert.isTrue(instance.isNeedToRestorePosition);
        });
        it('after shift range', () => {
            const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            instance.resetRange(0, 10, {itemsHeights: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60]});
            instance.shiftRange('down');

            assert.isTrue(instance.isNeedToRestorePosition);
        });
    });
    describe('.canScrollToItem', () => {
        const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
        instance.resetRange(0, 10);
        // @ts-ignore
        instance.updateItemsHeights(generateContainer([60, 60, 60, 60, 60, 60, 60, 60, 60, 60]));


        it('can`t scroll', () => {
            assert.isFalse(instance.canScrollToItem(6), 'Item is out of range');
            assert.isFalse(instance.canScrollToItem(5), 'Item offset > viewport offset');
        });
        it('can scroll', () => {
            assert.isTrue(instance.canScrollToItem(0));
            instance.resetRange(0, 5);
            assert.isTrue(instance.canScrollToItem(5));
        });
    });
    describe('.getActiveElementIndex()', () => {
        it('no items', () => {
            const instance = new controller({}, {});

            assert.isUndefined(instance.getActiveElementIndex(0));
        });
        it('scrolled to bottom', () => {
            const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            instance.resetRange(0, 5);
            // @ts-ignore
            instance.updateItemsHeights(generateContainer([60, 60, 60, 60, 60]));

            assert.equal(4, instance.getActiveElementIndex(400));
        });
        it('scrolled to top', () => {
            const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            instance.resetRange(0, 5);
            // @ts-ignore
            instance.updateItemsHeights(generateContainer([60, 60, 60, 60, 60]));

            assert.equal(0, instance.getActiveElementIndex(0));
        });
        it('middle case', () => {
            const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            instance.resetRange(0, 5);
            // @ts-ignore
            instance.updateItemsHeights(generateContainer([60, 60, 60, 60, 60]));

            assert.equal(1, instance.getActiveElementIndex(2));
        });
    });
    describe('.getPositionToRestore()', () => {
        it('after reset', () => {
            const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            instance.resetRange(0, 5);
            // @ts-ignore
            instance.updateItemsHeights(generateContainer([60, 60, 60, 60, 60]));

            assert.equal(0, instance.getPositionToRestore(0));
        });
        it('after shift', () => {
            const instance = new controller({pageSize: 5, segmentSize: 1}, {viewport: 200, trigger: 10, scroll: 600});
            instance.resetRange(0, 10, {itemsHeights: [60, 60, 60, 60, 60, 60, 60, 60, 60, 60]});
            instance.shiftRange('down');

            assert.equal(60, instance.getPositionToRestore(240));

            instance.shiftRange('up');

            assert.equal(300, instance.getPositionToRestore(240));
        });
    });
});