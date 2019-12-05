import {isValidDateRange} from 'Controls/validate';

describe('Controls.Validate:isValidDateRange', () => {
    const errorMessage = 'Дата конца периода должна быть больше даты начала';
    [{
        startValue: null,
        endValue: null,
        resp: true
    }, {
        startValue: new Date(),
        endValue: null,
        resp: true
    }, {
        startValue: null,
        endValue: new Date(),
        resp: true
    }, {
        startValue: new Date('InvalidDate'),
        endValue: new Date('InvalidDate'),
        resp: true
    }, {
        startValue: new Date(2019, 0),
        endValue: new Date(2019, 0),
        resp: true
    }, {
        startValue: new Date(2019, 0),
        endValue: new Date(2020, 0),
        resp: true
    }, {
        startValue: new Date(2019, 0),
        endValue: new Date(2018, 0),
        resp: errorMessage
    }].forEach((test) => {
        it(`should return ${test.resp} for period ${JSON.stringify(test.startValue)} - ${JSON.stringify(test.endValue)}`, () => {
            assert.equal(isValidDateRange({
                startValue: test.startValue,
                endValue: test.endValue
            }), test.resp);
        });
    });
});
