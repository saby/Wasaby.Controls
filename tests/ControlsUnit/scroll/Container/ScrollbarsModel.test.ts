import ScrollbarsModel from 'Controls/_scroll/Container/ScrollbarsModel';
import {getDefaultOptions as getScrollbarsDefaultOptions} from 'Controls/_scroll/Container/Interface/IScrollbars';
import {SCROLL_MODE} from 'Controls/_scroll/Container/Type';
import {SCROLL_DIRECTION} from 'Controls/_scroll/Utils/Scroll';

describe('Controls/scroll:ContainerNew ScrollbarsModel', () => {

    describe('constructor', () => {
        [{
            scrollMode: SCROLL_MODE.VERTICAL,
            direction: [SCROLL_DIRECTION.VERTICAL]
        }, {
            scrollMode: SCROLL_MODE.VERTICAL_HORIZONTAL,
            direction: [SCROLL_DIRECTION.VERTICAL, SCROLL_DIRECTION.HORIZONTAL]
        }].forEach((test) => {
            it(`should init scrollbars models. ${test.scrollMode}`, () => {
                const model: ScrollbarsModel = new ScrollbarsModel({
                    ...getScrollbarsDefaultOptions(),
                    scrollMode: test.scrollMode
                });
                assert.hasAllKeys(model._models, test.direction);
                for (let direction of test.direction) {
                    assert.isFalse(model._models[direction].isVisible);
                    assert.strictEqual(model._models[direction].position, 0);
                    assert.isUndefined(model._models[direction].contentSize);
                }
            });
        });
        it('should restore serialized state.', () => {
            const
                state = {
                    overflowHidden: true,
                    scrollContainerStyles: 'scrollContainerStyles',
                    styleHideScrollbar: 'styleHideScrollbar'
                },
                model: ScrollbarsModel = new ScrollbarsModel({
                    ...getScrollbarsDefaultOptions(),
                    scrollMode: SCROLL_MODE.VERTICAL
                }, state);

            assert.isTrue(model._overflowHidden);
            assert.strictEqual(model._styleHideScrollbar, state.styleHideScrollbar);
            assert.strictEqual(model._scrollContainerStyles, state.scrollContainerStyles);
        });
    });

    describe('serializeState', () => {
        it('should serialize state.', () => {
            const model: ScrollbarsModel = new ScrollbarsModel({
                ...getScrollbarsDefaultOptions(),
                scrollMode: SCROLL_MODE.VERTICAL
            });
            assert.deepEqual(model.serializeState(), {
                overflowHidden: false,
                scrollContainerStyles: undefined,
                styleHideScrollbar: undefined
            });
        });
    });

    describe('updateScrollState', () => {
        it('should update position and contentSize.', () => {
            const
                model: ScrollbarsModel = new ScrollbarsModel({
                    ...getScrollbarsDefaultOptions(),
                    scrollMode: SCROLL_MODE.VERTICAL_HORIZONTAL
                }),
                scrollTop: number = 10,
                scrollLeft: number = 20,
                scrollHeight: number = 30,
                scrollWidth: number = 40;

            model.updateScrollState({
                scrollTop: scrollTop,
                scrollLeft: scrollLeft,
                scrollHeight: scrollHeight,
                scrollWidth: scrollWidth
            })
            assert.strictEqual(model._models.vertical.position, scrollTop);
            assert.strictEqual(model._models.horizontal.position, scrollLeft);
            assert.strictEqual(model._models.vertical.contentSize, scrollHeight);
            assert.strictEqual(model._models.horizontal.contentSize, scrollWidth);
        });
    });
});
