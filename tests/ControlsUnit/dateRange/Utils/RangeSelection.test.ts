import utils from 'Controls/_dateRange/Utils/RangeSelection';

describe('Controls/_dateRange/Utils/RangeSelection', function() {
    describe('prepareSelectionClass', function() {
        const date: Date = new Date(2019, 0, 1);
        [{
            args: {
                date
            },
            css: ''
        }, {
            args: {
                date,
                startValue: date,
                endValue: date
            },
            css: 'controls-RangeSelection__selected-start-end'
        }, {
            args: {
                date,
                startValue: date,
                endValue: new Date(2019, 0, 2)
            },
            css: 'controls-RangeSelection__selected-start'
        }, {
            args: {
                date,
                startValue: new Date(2019, 0, 0),
                endValue: date
            },
            css: 'controls-RangeSelection__selected-end'
        }, {
            args: {
                date,
                startValue: new Date(2019, 0, 0),
                endValue: new Date(2019, 0, 2)
            },
            css: 'controls-RangeSelection__selected-inner'
        }, {
            args: {
                date,
                selectionProcessing: true,
                startValue: date,
                baseSelectionValue: date
            },
            css: 'controls-RangeSelection__start-base'
        }].forEach((test) => {
            it(`should return correct css class if arguments are equal to ${JSON.stringify(test.args)}.`, () => {
                assert.strictEqual(utils.prepareSelectionClass(
                    test.args.date,
                    test.args.startValue,
                    test.args.endValue,
                    test.args.selectionProcessing,
                    test.args.baseSelectionValue,
                    test.args.hoveredSelectionValue,
                    test.args.hoveredStartValue,
                    test.args.hoveredEndValue
                ), test.css);
            });
        });
    });
});
