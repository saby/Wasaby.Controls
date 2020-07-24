import { assert } from 'chai';
import { stub, SinonStub, mock } from 'sinon';
import { MeasurerUtils } from 'Controls/_itemActions/measurers/MeasurerUtils';
import { IItemAction } from 'Controls/_itemActions/interface/IItemAction';

describe('Controls/_itemActions/measurers/MeasurerUtils', () => {
    it('getActualActions', () => {
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
                icon: 'icon-EmptyMessage',
                parent: 1
            },
            {
                id: 4,
                icon: 'icon-PhoneNull',
                parent: 1
            },
            {
                id: 5,
                icon: 'icon-Erase',
                showType: 2
            },
            {
                id: 6,
                icon: 'icon-EmptyMessage',
                showType: 0
            }
        ];
        const actual: IItemAction[] = [
            {
                id: 5,
                icon: 'icon-Erase',
                showType: 2
            },
            {
                id: 1,
                icon: 'icon-PhoneNull'
            },
            {
                id: 2,
                icon: 'icon-Erase'
            },
            {
                id: 6,
                icon: 'icon-EmptyMessage',
                showType: 0
            }
        ];
        const result = MeasurerUtils.getActualActions(actions);
        assert.deepEqual(actual, result);
    });
});
