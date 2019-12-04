import { assert } from 'chai';

import SwipeContainer from 'Controls/_listRender/Containers/Swipe';

describe('Controls/_listRender/Containers/Swipe', () => {
    const listModel = {
        swipeItem: null,
        activeItem: null,
        itemActions: null,
        setSwipeItem(item) {
            listModel.swipeItem = item;
        },
        setActiveItem(item) {
            listModel.activeItem = item;
        },
        setItemActions(_item, actions) {
            listModel.itemActions = actions;
        }
    };
    const defaultCfg = {
        listModel,
        itemActionsPosition: 'outside'
    };

    beforeEach(() => {
        listModel.swipeItem = null;
        listModel.activeItem = null;
    });

    it('_beforeMount()', () => {
        const container = new SwipeContainer({});

        let needTitleCalled = false;
        let needIconCalled = false;
        const measurer = {
            needTitle() { needTitleCalled = true; },
            needIcon() { needIconCalled = true; }
        };

        container._beforeMount();
        container._measurer = measurer;

        container._needTitle({});
        assert.isTrue(needTitleCalled);

        container._needIcon({});
        assert.isTrue(needIconCalled);
    });

    it('_beforeUpdate()', () => {
        const container = new SwipeContainer({});

        container.saveOptions({ menuIsShown: true });
        container._swipeConfig = true;

        container._beforeUpdate({ menuIsShown: true });
        assert.isTrue(container._swipeConfig);

        container._beforeUpdate({ menuIsShown: false });
        assert.isNull(container._swipeConfig);
    });

    describe('_onItemSwipe()', () => {
        it('opens actions on swipe left if item has them', () => {
            const container = new SwipeContainer(defaultCfg);
            container.saveOptions(defaultCfg);
            container._animationState = 'close';

            container._onItemSwipe({}, {
                getActions() {
                    return null;
                }
            }, {
                nativeEvent: {
                    direction: 'left'
                }
            });
            assert.strictEqual(container._animationState, 'close');

            container._onItemSwipe({}, {
                getActions() {
                    return [];
                }
            }, {
                nativeEvent: {
                    direction: 'left'
                }
            });
            assert.strictEqual(container._animationState, 'open');
        });

        it('closes actions on swipe right', () => {
            const container = new SwipeContainer({});
            container._animationState = 'open';

            container._onItemSwipe({}, {}, {
                nativeEvent: {
                    direction: 'right'
                }
            });
            assert.strictEqual(container._animationState, 'close');
        });
    });

    it('_onAnimationEnd()', () => {
        const container = new SwipeContainer({});

        container._animationState = 'open';
        container._swipeConfig = true;
        container._onAnimationEnd();
        assert.isTrue(container._swipeConfig);

        container._animationState = 'close';
        container._onAnimationEnd();
        assert.isNull(container._swipeConfig);
    });

    it('_openSwipe()', () => {
        const container = new SwipeContainer(defaultCfg);
        container.saveOptions(defaultCfg);

        const item = {};
        container._openSwipe(item, {});
        assert.strictEqual(listModel.activeItem, item);
        assert.strictEqual(listModel.swipeItem, item);
        assert.strictEqual(container._animationState, 'open');
    });

    describe('_closeSwipe()', () => {
        it('resets swipe state', () => {
            const container = new SwipeContainer({});
            container._animationState = 'open';
            container._swipeConfig = true;

            container._closeSwipe();

            assert.strictEqual(container._animationState, 'close');
            assert.isNull(container._swipeConfig);
        });

        it('does not close if dropdown menu is open', () => {
            const container = new SwipeContainer({ menuIsShown: true });
            container.saveOptions({ menuIsShown: true });
            container._animationState = 'open';

            container._closeSwipe();

            assert.strictEqual(container._animationState, 'open');
        });
    });

    it('_resetSwipeState()', () => {
        const container = new SwipeContainer({});
        container._animationState = 'open';
        container._swipeConfig = true;
        listModel.swipeItem = listModel.activeItem = {};

        container._resetSwipeState(listModel);

        assert.strictEqual(container._animationState, 'close');
        assert.isNull(container._swipeConfig);
        assert.isNull(listModel.activeItem);
        assert.isNull(listModel.swipeItem);
    });

    it('_updateSwipeConfig()', () => {
        const actions = {
            all: [1, 2, 3, 4, 5, 6],
            showed: [1, 2, 3, 4]
        };
        const item = {
            getActions() {
                return actions;
            }
        };
        
        const container = new SwipeContainer(defaultCfg);
        container.saveOptions(defaultCfg);

        container._getActionsContainerHeight = () => 100;
        container._measureSwipeConfig = () => {
            container._swipeConfig = {
                itemActions: item.getActions(),
                twoColumns: true
            };
        };

        container._updateSwipeConfig(item, {});

        assert.strictEqual(listModel.itemActions, item.getActions());
        assert.deepEqual(
            container._swipeConfig.twoColumnsActions,
            [[1, 2], [3, 4]]
        );
    });

    it('_needsHorizontalMeasurement()', () => {
        const container = new SwipeContainer({});

        container._swipeConfig = {
            itemActions: {
                all: [1, 2, 3],
                showed: []
            }
        };
        assert.isNotOk(container._needsHorizontalMeasurement());

        container._swipeConfig = {
            itemActions: {
                all: [1, 2, 3],
                showed: [1, 2]
            }
        };
        assert.isNotOk(container._needsHorizontalMeasurement());

        container._swipeConfig = {
            itemActions: {
                all: [1, 2, 3],
                showed: [3]
            }
        };
        assert.isOk(container._needsHorizontalMeasurement());

        container._swipeConfig = {
            itemActions: {
                all: [1],
                showed: [1]
            }
        };
        assert.isNotOk(container._needsHorizontalMeasurement());
    });

    it('_measureSwipeConfig()', () => {
        const swipeConfig = {};
        const measurer = {
            getSwipeConfig() {
                return swipeConfig;
            }
        };

        const container = new SwipeContainer({});
        container._setMeasurer = () => {
            container._measurer = measurer;
        };

        container._measureSwipeConfig();
        assert.strictEqual(container._swipeConfig, swipeConfig);
    });

    it('_setMeasurer()', () => {
        const container = new SwipeContainer({});

        container._setMeasurer('vertical');
        assert.strictEqual(container._actionAlignment, 'vertical');
        assert.isFunction(container._measurer.getSwipeConfig);
        const verticalMeasurer = container._measurer;

        container._setMeasurer('horizontal');
        assert.strictEqual(container._actionAlignment, 'horizontal');
        assert.isFunction(container._measurer.getSwipeConfig);
        assert.notStrictEqual(container._measurer, verticalMeasurer);
    });
});
