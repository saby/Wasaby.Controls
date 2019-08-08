import datePopupUtils from 'Controls/_datePopup/Utils';
import dateUtils = require('Controls/Utils/Date');

describe('Controls/_datePopup/Utils', function() {
    describe('dataStringToDate', function() {
        [{
            str: '2019.1',
            date: new Date(2019, 0, 1)
        }, {
            str: '2019.12',
            date: new Date(2019, 11, 1)
        }].forEach(function(test) {
            it('should create the correct models when empty range passed.', function() {
                assert(dateUtils.isDatesEqual(datePopupUtils.dataStringToDate(test.str), test.date));
            });
        });
    });

    describe('isMonthStateEnabled', () => {
        [{
            options: { minRange: 'day' },
            isEnabled: true
        }, {
            options: { quantum: {}, minRange: 'day' },
            isEnabled: true
        }, {
            options: { quantum: { days: [1] } },
            isEnabled: true
        }, {
            options: { quantum: { weeks: [1] } },
            isEnabled: true
        }, {
            options: { minRange: 'month' },
            isEnabled: false
        }].forEach((test) => {
            it(`should return ${test.isEnabled} if ${test.options} passed.`, () => {
                assert.equal(datePopupUtils.isMonthStateEnabled(test.options), test.isEnabled);
            });
        });
    });
});
