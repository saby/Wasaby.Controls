import RangeSelectionController from 'Controls/_dateRange/Controllers/RangeSelectionController';
import calendarTestUtils = require('ControlsUnit/Calendar/Utils');

describe('Controls/_dateRange/Controllers/RangeSelectionController', () => {
    describe('_getDisplayedRangeEdges', () => {
        [{
            options: {
                selectionType: RangeSelectionController.SELECTION_TYPES.single,
                selectionBaseValue: null
            },
            item: new Date(2019, 0, 1),
            resp: [new Date(2019, 0, 1), new Date(2019, 0, 1)]
        }, {
            options: {
                selectionType: RangeSelectionController.SELECTION_TYPES.range,
                selectionBaseValue: null
            },
            item: new Date(2019, 0, 1),
            resp: [new Date(2019, 0, 1), new Date(2019, 0, 1)]
        }, {
            options: {
                selectionType: RangeSelectionController.SELECTION_TYPES.range,
                selectionBaseValue: new Date(2019, 0, 1)
            },
            item: new Date(2019, 0, 5),
            resp: [new Date(2019, 0, 1), new Date(2019, 0, 5)]
        }].forEach((test) => {
            it(`should return proper range for options ${JSON.stringify(test.options)}.`, () => {
                const
                    component: RangeSelectionController =
                        calendarTestUtils.createComponent(RangeSelectionController, test.options);
                let range: Date[];

                range = component._getDisplayedRangeEdges(test.item);
                assert.notStrictEqual(range[0], range[1]);
                assert.deepEqual(range, test.resp);
            });
        });
    });
});
