import {assert} from 'chai';
import {ColumnScroll} from 'Controls/_grid/resources/ColumnScroll';

function mockScrollContainer(params: { offsetWidth: number }): HTMLElement {
    return {
        getClientRects: () => [null, null],
        offsetWidth: params.offsetWidth
    } as unknown as HTMLElement;
}

function mockStylesContainer(): HTMLStyleElement {
    return {
        innerHTML: ''
    } as unknown as HTMLStyleElement;
}

function mockContentContainer(params: {
    scrollWidth: number,
    offsetWidth: number,
    stickyElements?: unknown[],
    stickyColumnsCount?: number,
    hasMultiSelect?: boolean
}): HTMLElement {
    return {
        scrollWidth: params.scrollWidth,
        offsetWidth: params.offsetWidth,
        querySelectorAll: (selector: string) => selector === '.controls-Grid_columnScroll_wrapper' && !!params.stickyElements ? params.stickyElements : [],
        querySelector: (selector: string) => {
            const lastStickyColumnSelector = `.controls-Grid_columnScroll__fixed:nth-child(${(params.stickyColumnsCount || 1) + (params.hasMultiSelect ? 1 : 0)})`;
            if (selector === lastStickyColumnSelector) {
                return {
                    offsetWidth: 300,
                    getBoundingClientRect: () => ({
                        left: 52
                    })
                };
            }
        },
        getBoundingClientRect: () => ({
            left: 12
        })
    } as unknown as HTMLElement;
}

describe('Controls/grid_clean/Controllers/ColumnScroll', () => {

    let columnScroll: ColumnScroll;

    beforeEach(() => {
        const cfg = {
            hasMultiSelect: false,
            stickyColumnsCount: 2
        };
        columnScroll = new ColumnScroll(cfg);

        columnScroll.setContainers({
            scrollContainer: mockScrollContainer({
                offsetWidth: 600
            }),
            contentContainer: mockContentContainer({
                ...cfg,
                scrollWidth: 782,
                offsetWidth: 600
            }),
            stylesContainer: mockStylesContainer()
        });
    });

    it('should call only once, last callback in debounced updateSizes', (done) => {
        let updateCounter = 0;
        let isFiredLast = false;

        columnScroll.updateSizes(() => {
            // Должен быть проигнорирован.
            updateCounter++;
        });
        columnScroll.updateSizes(() => {
            // Должен быть проигнорирован.
            updateCounter++;
        });
        columnScroll.updateSizes(() => {
            updateCounter++;
            isFiredLast = true;
            assert.equal(updateCounter, 1, 'Debounced updating sizes called then more then 1 time.');
            assert.isTrue(isFiredLast, 'Should fire callback only on rea update(last in debounced fn).');
            done();
        });
    });

    it('should not call debounced updateSizes if controller was destroyed', () => {
        let isCallbackCalled = false;
        columnScroll.updateSizes(() => {
            isCallbackCalled = true;
        });

        columnScroll.destroy();

        columnScroll.updateSizes(() => {
            isCallbackCalled = true;
        });
        assert.isFalse(isCallbackCalled, 'Callback wasCalled for destroyed controller.');
    });
});
