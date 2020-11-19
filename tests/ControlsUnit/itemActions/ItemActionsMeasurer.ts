import {assert} from 'chai';
import {IItemAction, IItemActionsContainer} from 'Controls/ItemActions';
import {getActions} from 'Controls/_itemActions/measurers/ItemActionMeasurer';

describe('itemActionsMeasurer', () => {
    const actions: IItemAction[] = [
        {
            id: 1,
            icon: 'icon-PhoneNull',
            'parent@': false,
            parent: 2
        },
        {
            id: 2,
            'parent@': true,
            parent: null,
            icon: 'icon-Erase'
        },
        {
            id: 3,
            icon: 'icon-EmptyMessage'
        }
    ];
    const itemActions = {
        all: actions,
            showed: [
            {
                id: null,
                icon: 'icon-SwipeMenu',
                isMenu: true,
                showType: 2
            }
        ]
    };
    it ('returns only root actions with menu button', () => {
        const resultActions = getActions(itemActions, 'm', null, 400);
        assert.isFalse(!!resultActions.showed.find((action) => action['parent@']));
        assert.isTrue(!!resultActions.showed.find((action) => action.isMenu));
        assert.isFalse(!!resultActions.showed.find((action) => !!action.parent));
    });
});
