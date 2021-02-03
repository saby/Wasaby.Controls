import { assert } from 'chai';
import * as sinon from 'sinon';
import { Model } from 'Types/entity';
import { GridDataRow } from 'Controls/gridNew';

const rawData = { key: 1, col1: 'c1-1', col2: 'с2-1', col3: 'с3-1' };
const columns = [
    { displayProperty: 'col1' },
    { displayProperty: 'col2' },
    { displayProperty: 'col3' }
];

describe('Controls/grid_clean/Display/StickyGroup/DataRow/HasStickyGroup', () => {
    let model: Model;

    beforeEach(() => {
        model = new Model({
            rawData,
            keyProperty: 'key'
        });
    });

    afterEach(() => {
        model = undefined;
    });

    it('HasStickyGroup', () => {
        const gridDataRow = new GridDataRow({
            contents: model,
            owner: { hasStickyGroup: () => false } as any,
            columns
        });
        const sandbox = sinon.createSandbox();
        sandbox.spy(gridDataRow.getOwner(), 'hasStickyGroup');
        gridDataRow.hasStickyGroup();
        assert(gridDataRow.getOwner().hasStickyGroup.calledOnce);

        sandbox.restore();
    });
});
