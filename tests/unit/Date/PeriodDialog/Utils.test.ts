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
});
