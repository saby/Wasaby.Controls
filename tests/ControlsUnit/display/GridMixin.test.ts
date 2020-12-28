import { assert } from 'chai';
import { GridCollection } from 'Controls/display';

describe('Controls/_display/GridMixin', () => {
    describe('ladder', () => {
        let grid;
        const collection = [
            {
                id: 1,
                title: '1'
            },
            {
                id: 2,
                title: '1'
            },
            {
                id: 2,
                title: '2'
            }
        ];
        const cfg = {
            collection,
            ladderProperties: ['title']
        };
        beforeEach(() => {
            grid = new GridCollection(cfg);
        });
        it('init Ladder', () => {
            assert.isOk(grid.at(0).getLadder(), 'must init ladder on items');
        });
        afterEach(() => {
           grid.destroy();
        });
    });

    describe('hasMultiSelectColumn', () => {
        const grid = new GridCollection({collection: [{id: 1}]});

        it('hasMultiSelectColumn()', () => {
            grid.setMultiSelectVisibility('visible');
            grid.setMultiSelectPosition('default');
            assert.isTrue(grid.hasMultiSelectColumn());

            grid.setMultiSelectVisibility('onactivated');
            grid.setMultiSelectPosition('default');
            assert.isTrue(grid.hasMultiSelectColumn());

            grid.setMultiSelectVisibility('hidden');
            grid.setMultiSelectPosition('default');
            assert.isFalse(grid.hasMultiSelectColumn());

            grid.setMultiSelectVisibility('visible');
            grid.setMultiSelectPosition('custom');
            assert.isFalse(grid.hasMultiSelectColumn());

            grid.setMultiSelectVisibility('onactivated');
            grid.setMultiSelectPosition('custom');
            assert.isFalse(grid.hasMultiSelectColumn());

            grid.setMultiSelectVisibility('hidden');
            grid.setMultiSelectPosition('custom');
            assert.isFalse(grid.hasMultiSelectColumn());
        });
    });
});
