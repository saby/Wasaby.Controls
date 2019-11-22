import VirtualScroll from 'Controls/_list/ScrollContainer/VirtualScroll';

describe('Controls/_list/ScrollContainer/VirtualScroll', () => {
    const heights = [20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40];
    const children = heights.map((offsetHeight) => ({offsetHeight: offsetHeight, className: ''}));
    describe('common virtual scroll', () => {
        let vsInstance: VirtualScroll;
        let affectingInstance: object = {};

        beforeEach(() => {
            affectingInstance = {
                indexesChanged: false,
                loadMoreCalled: false,
                placeholderChanged: false
            };
            vsInstance = new VirtualScroll({
                pageSize: 20,
                segmentSize: 4,
                virtualScrollMode: 'hide',
                indexesChangedCallback() {
                    affectingInstance.indexesChanged = true;
                },
                loadMoreCallback() {
                    affectingInstance.loadMoreCalled = true;
                },
                placeholderChangedCallback() {
                    affectingInstance.placeholderChanged = true;
                },
                viewModel: {
                    subscribe() {},
                    getStartIndex() {
                        return vsInstance.startIndex;
                    }
                }
            });

            vsInstance.itemsCount = 20;
            vsInstance.reset();
            vsInstance.viewportHeight = 400;
            vsInstance.itemsContainer = {
                children, offsetHeight: 600
            };
        });

        it('reset', () => {
            vsInstance.reset();
            assert.equal(0, vsInstance.itemsHeights.length);
            assert.equal(0, vsInstance.itemsOffsets.length);
            assert.isTrue(affectingInstance.indexesChanged);
            assert.isTrue(affectingInstance.placeholderChanged);
            assert.equal(0, vsInstance.startIndex);
            assert.equal(20, vsInstance.stopIndex);
        });
        it('recalcItemsHeights', () => {
            const itemsHeight = heights.slice(0, 20);
            const itemsOffsets = [];
            let sum = 0;
            for (let i = 0; i < vsInstance.itemsCount; i++) {
                itemsOffsets[i] = sum;
                sum += itemsHeight[i];
            }

            vsInstance.recalcItemsHeights();

            assert.deepEqual(vsInstance.itemsHeights, itemsHeight);
            assert.deepEqual(vsInstance.itemsOffsets, itemsOffsets)
        });
        it('recalcFromIndex', () => {
            vsInstance.recalcRangeFromIndex(1);

            assert.equal(0, vsInstance.startIndex);
            assert.equal(20, vsInstance.stopIndex);

            vsInstance.itemsCount = 40;
            vsInstance.recalcRangeFromIndex(5);
            assert.equal(5, vsInstance.startIndex);
            assert.equal(24, vsInstance.stopIndex);
        });
        it('getItemsHeights', () => {
            assert.equal(60, vsInstance.getItemsHeights(0, 2));
        });
        it('can scroll to item', () => {
            assert.isTrue(vsInstance.canScrollToItem(1));
            assert.isFalse(vsInstance.canScrollToItem(19));
            assert.isFalse(vsInstance.canScrollToItem(21));
        });
        it('recalcFromScrollTop', () => {
            vsInstance.scrollTop = 0;
            vsInstance.setStartIndex(4);
            vsInstance.recalcRangeFromScrollTop();
            assert.equal(0, vsInstance.startIndex);
            assert.equal(20, vsInstance.stopIndex);
        });
        it('getActiveElement', () => {
            vsInstance.itemsContainerHeight = 600;
            vsInstance.scrollTop = 0;
            assert.equal(0, vsInstance.getActiveElement());
            vsInstance.scrollTop = 200;
            assert.equal(19, vsInstance.getActiveElement());
            vsInstance.scrollTop = 100;
            assert.equal(9, vsInstance.getActiveElement());
            vsInstance.itemsHeights = [];
            assert.isUndefined(vsInstance.getActiveElement());
        });
        it('recalcToDirection', () => {
            vsInstance.itemsCount = 20;
            vsInstance.reset();
            vsInstance.viewportHeight = 400;
            vsInstance.itemsContainer = {
                children, offsetHeight: 600
            };
            vsInstance.setStartIndex(0);
            vsInstance.itemsCount = 40;
            vsInstance.scrollTop = 160;
            vsInstance.recalcRangeToDirection('down');
            assert.equal(0, vsInstance.startIndex);
            assert.equal(24, vsInstance.stopIndex);
            vsInstance.setStartIndex(10);
            vsInstance.recalcItemsHeights();
            vsInstance.viewportHeight = 200;
            vsInstance.scrollTop = 10;
            vsInstance.recalcRangeToDirection('up');
            assert.equal(6, vsInstance.startIndex);
            assert.equal(24, vsInstance.stopIndex);
        });
        it('itemsAddedHandler', () => {
            vsInstance.itemsCount = 20;
            vsInstance.reset();
            vsInstance.recalcItemsHeights();
            vsInstance.itemsCount = 40;
            vsInstance.itemsAddedHandler(20, {length: 20} as object[]);
            assert.equal(0, vsInstance.startIndex);
            assert.equal(24, vsInstance.stopIndex);
            vsInstance.itemsCount = 20;
            vsInstance.reset();
            vsInstance.actualizeSavedIndexes();
            vsInstance.itemsCount = 40;
            vsInstance.recalcItemsHeights();
            vsInstance.itemsFromLoadToDirection = true;
            vsInstance.itemsAddedHandler(0, {length: 20} as object[]);
            assert.equal(16, vsInstance.startIndex);
            assert.equal(40, vsInstance.stopIndex);
            assert.equal(20, vsInstance.savedStartIndex);
            assert.equal(40, vsInstance.savedStopIndex);
        });
        it('itemsRemovedHandler', () => {
            vsInstance.itemsCount = 20;
            vsInstance.reset();
            vsInstance.itemsCount = 19;
            vsInstance.itemsRemovedHandler(19, {length: 1} as object[]);
            assert.equal(0, vsInstance.startIndex);
            assert.equal(19, vsInstance.stopIndex);
        });
    });
});