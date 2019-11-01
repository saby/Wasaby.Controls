import VirtualScroll from 'Controls/_list/ScrollController/VirtualScroll';

describe('Controls/_list/ScrollController/VirtualScroll', () => {
    const heights = [20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40, 20, 40];
    const children = heights.map((offsetHeight) => ({offsetHeight: offsetHeight}));
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
                pageSizeMode: 'dynamic',
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
            vsInstance.recalcFromIndex(1);

            assert.equal(0, vsInstance.startIndex);
            assert.equal(20, vsInstance.stopIndex);

            vsInstance.itemsCount = 40;
            vsInstance.recalcFromIndex(5);
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
            vsInstance.recalcFromScrollTop();
            assert.equal(0, vsInstance.startIndex);
            assert.equal(20, vsInstance.stopIndex);
        });

        it('recalcFromNewItems', () => {
            vsInstance.itemsCount = 40;
            vsInstance.insertItemsHeights(20, 20);
            vsInstance.triggerOffset = 50;
            vsInstance.scrollTop = 150;
            vsInstance.recalcFromNewItems('down');
            assert.equal(0, vsInstance.startIndex);
            assert.equal(20, vsInstance.stopIndex);

            vsInstance.setStartIndex(10);
            vsInstance.recalcFromNewItems('up');
            assert.equal(10, vsInstance.startIndex);
            assert.equal(30, vsInstance.stopIndex);
        });
    });
    describe('dynamic virtual scroll', () => {
        let vsInstance = new VirtualScroll({
            pageSize: 20,
            pageSizeMode: 'dynamic',
            segmentSize: 4,
            virtualScrollMode: 'hide',
            indexesChangedCallback() {
            },
            loadMoreCallback() {
            },
            placeholderChangedCallback() {
            }
        });

        vsInstance.itemsCount = 20;
        vsInstance.reset();
        vsInstance.viewportHeight = 400;
        vsInstance.itemsContainer = {
            children, offsetHeight: 600
        };

        it('recalcFromDirection', () => {
            vsInstance.setStartIndex(0);
            vsInstance.itemsCount = 40;
            vsInstance.scrollTop = 160;
            vsInstance.recalcToDirection('down');
            assert.equal(5, vsInstance.startIndex);
            assert.equal(24, vsInstance.stopIndex);
            vsInstance.setStartIndex(10);
            vsInstance.recalcItemsHeights();
            vsInstance.viewportHeight = 200;
            vsInstance.scrollTop = 10;
            vsInstance.recalcToDirection('up');
            assert.equal(6, vsInstance.startIndex);
            assert.equal(18, vsInstance.stopIndex);
        });
    });
    describe('static virtual scroll', () => {
        let vsInstance = new VirtualScroll({
            pageSize: 20,
            pageSizeMode: 'static',
            segmentSize: 4,
            virtualScrollMode: 'hide',
            indexesChangedCallback() {
            },
            loadMoreCallback() {
            },
            placeholderChangedCallback() {
            }
        });

        vsInstance.itemsCount = 20;
        vsInstance.reset();
        vsInstance.viewportHeight = 400;
        vsInstance.itemsContainer = {
            children, offsetHeight: 600
        };

        it('recalcFromDirection', () => {
            vsInstance.setStartIndex(0);
            vsInstance.itemsCount = 40;
            vsInstance.scrollTop = 160;
            vsInstance.recalcToDirection('down');
            assert.equal(4, vsInstance.startIndex);
            assert.equal(24, vsInstance.stopIndex);
            vsInstance.setStartIndex(10);
            vsInstance.recalcItemsHeights();
            vsInstance.viewportHeight = 200;
            vsInstance.scrollTop = 10;
            vsInstance.recalcToDirection('up');
            assert.equal(6, vsInstance.startIndex);
            assert.equal(26, vsInstance.stopIndex);
        });
    });
});