import { assert } from 'chai';
import { stub, SinonStub } from 'sinon';

import * as rk from 'i18n!ControlsUnit';

import { IItemAction } from 'Controls/_itemActions/interface/IItemActions';
import { horizontalMeasurer } from 'Controls/_itemActions/measurers/HorizontalMeasurer';
import {MeasurerUtils} from 'Controls/_itemActions/measurers/MeasurerUtils';

describe('Controls/_itemActions/measurers/HorizontalMeasurer', () => {
    it('needIcon', () => {
        assert.isFalse(horizontalMeasurer.needIcon({}, 'none', true));
        assert.isFalse(horizontalMeasurer.needIcon({}, 'none', false));
        assert.isFalse(horizontalMeasurer.needIcon({}, 'right', false));
        assert.isTrue(horizontalMeasurer.needIcon({}, 'right', true));
        assert.isTrue(
            horizontalMeasurer.needIcon(
                {
                    icon: '123'
                },
                'none',
                true
            )
        );
        assert.isTrue(
            horizontalMeasurer.needIcon(
                {
                    icon: '123'
                },
                'none',
                false
            )
        );
    });

    it('needTitle', () => {
        assert.isFalse(
            horizontalMeasurer.needTitle(
                {
                    icon: 'icon-Message'
                },
                'none'
            )
        );
        assert.isFalse(
            horizontalMeasurer.needTitle(
                {
                    icon: 'icon-Message'
                },
                'right'
            )
        );
        assert.isTrue(horizontalMeasurer.needTitle({}, 'none'));
        assert.isTrue(horizontalMeasurer.needTitle({}, 'right'));
        assert.isTrue(
            horizontalMeasurer.needTitle(
                {
                    title: '123'
                },
                'none'
            )
        );
        assert.isTrue(
            horizontalMeasurer.needTitle(
                {
                    title: '123'
                },
                'right'
            )
        );
        assert.isTrue(
            horizontalMeasurer.needTitle(
                {
                    title: '123'
                },
                'bottom'
            )
        );
    });

    describe('getSwipeConfig', () => {
        const actions: IItemAction[] = [
            {
                id: 1,
                icon: 'icon-PhoneNull'
            },
            {
                id: 2,
                icon: 'icon-Erase'
            },
            {
                id: 3,
                icon: 'icon-EmptyMessage'
            }
        ];

        let stubCalculateSizesOfItems: SinonStub;

        beforeEach(() => {
            stubCalculateSizesOfItems = stub(MeasurerUtils, 'calculateSizesOfItems');
            stubCalculateSizesOfItems.callsFake((itemsHtml: string[], measurerBlockClass: string, itemClass: string) => ({
                blockSize: 0,
                itemsSizes: itemsHtml.map((item) => 25)
            }));
        });

        afterEach(() => {
            stubCalculateSizesOfItems.restore();
        });

        // Если кол-во записей > 3, то показываем максимум 3 (если они влезли) и добавляем кнопку "ещё"
        it('should add menu, when more than 3 itemActions are in \'showed\' array', () => {
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions.concat({
                        id: 4,
                        icon: 'icon-DK'
                    }),
                    showed: actions.concat({
                        id: null,
                        icon: 'icon-SwipeMenu',
                        title: rk('Ещё'),
                        _isMenu: true,
                        showType: 2
                    })
                },
                paddingSize: 'm'
            };

            assert.deepInclude(
                horizontalMeasurer.getSwipeConfig(
                    actions.concat({
                        id: 4,
                        icon: 'icon-DK'
                    }),
                    100,
                    20,
                    'right'
                ),
                result
            );
        });

        // Если кол-во записей > 3 и видимые записи не влезли в контейнер, показываем столько, сколько влезло
        it('should show only item actions that are smaller than container by their summarized width when total > 3', () => {
            const showed = [...actions];
            showed.splice(-1, 1, {
                id: null,
                icon: 'icon-SwipeMenu',
                title: rk('Ещё'),
                _isMenu: true,
                showType: 2
            });
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions.concat({
                        id: 4,
                        icon: 'icon-DK'
                    }),
                    showed
                },
                paddingSize: 'm'
            };
            assert.deepInclude(horizontalMeasurer.getSwipeConfig(
                actions.concat({
                    id: 4,
                    icon: 'icon-DK'
                }),
                75,
                20,
                'right'
            ), result);
        });

        // Если кол-во записей <= 3 и видимые записи не влезли в контейнер, показываем столько, сколько влезло
        it('should show only item actions that are smaller than container by their summarized width when total <= 3', () => {
            stubCalculateSizesOfItems.callsFake((itemsHtml: string[], measurerBlockClass: string, itemClass: string) => ({
                blockSize: 0,
                itemsSizes: itemsHtml.map((item, index) => 25 + index)
            }));

            const lessActions = [...actions];
            lessActions.splice(-1, 1);

            const showed = [...lessActions];
            showed.splice(-1, 1, {
                id: null,
                icon: 'icon-SwipeMenu',
                title: rk('Ещё'),
                _isMenu: true,
                showType: 2
            });

            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: lessActions,
                    showed
                },
                paddingSize: 'm'
            };
            const config = horizontalMeasurer.getSwipeConfig(
                lessActions,
                50,
                20,
                'right'
            );
            assert.deepInclude(config, result);
        });

        // Если кол-во записей <= 3 и видимые записи влезли в контейнер, не показываем кнопку "Ещё"
        it('should not show menu button when item actions are smaller than container by their summarized width and total <= 3', () => {
            const lessActions = [...actions];
            lessActions.splice(-1, 1);

            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: lessActions,
                    showed: lessActions
                },
                paddingSize: 'm'
            };
            const config = horizontalMeasurer.getSwipeConfig(
                lessActions,
                50,
                20,
                'right'
            );
            assert.deepInclude(config, result);
        });

        it('small row without title, itemActionsSize should be m', () => {
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions,
                    showed: actions
                },
                paddingSize: 'm'
            };

            assert.deepInclude(
                horizontalMeasurer.getSwipeConfig(actions, 100, 20, 'none'),
                result
            );
        });

        it('big row without title, itemActionsSize should be l', () => {
            const result = {
                itemActionsSize: 'l',
                itemActions: {
                    all: actions,
                    showed: actions
                },
                paddingSize: 'm'
            };

            assert.deepInclude(
                horizontalMeasurer.getSwipeConfig(actions, 100,39, 'none'),
                result
            );
        });

        it('small row with title, itemActionsSize should be m', () => {
            const result = {
                itemActionsSize: 'm',
                itemActions: {
                    all: actions,
                    showed: actions
                },
                paddingSize: 'm'
            };

            assert.deepInclude(
                horizontalMeasurer.getSwipeConfig(actions, 100, 20, 'bottom'),
                result
            );
        });

        it('big row with title, itemActionsSize should be l', () => {
            const result = {
                itemActionsSize: 'l',
                itemActions: {
                    all: actions,
                    showed: actions
                },
                paddingSize: 'm'
            };

            assert.deepInclude(
                horizontalMeasurer.getSwipeConfig(actions, 100, 59, 'bottom'),
                result
            );
        });

        it('main actions', () => {
            const otherActions: IItemAction[] = [
                {
                    id: 1,
                    showType: 2,
                    icon: 'icon-PhoneNull'
                },
                {
                    id: 5,
                    icon: 'icon-PhoneNull',
                    parent: 1
                },
                {
                    id: 2,
                    showType: 2,
                    icon: 'icon-Erase'
                },
                {
                    id: 3,
                    showType: 0,
                    icon: 'icon-EmptyMessage'
                },
                {
                    id: 4,
                    showType: 2,
                    icon: 'icon-Profile'
                }];
            const result: IItemAction[] = [
                {
                    id: 1,
                    showType: 2,
                    icon: 'icon-PhoneNull'
                },
                {
                    id: 2,
                    showType: 2,
                    icon: 'icon-Erase'
                },
                {
                    id: 4,
                    showType: 2,
                    icon: 'icon-Profile'
                },
                {
                    id: null,
                    icon: 'icon-SwipeMenu',
                    title: rk('Ещё'),
                    _isMenu: true,
                    showType: 2
                }
            ];
            assert.deepEqual(
                result,
                horizontalMeasurer.getSwipeConfig(otherActions, 100, 59, 'none').itemActions.showed
            );
        });
    });
});
