import MonthsRangeItem from 'Controls/_datePopup/MonthsRangeItem';
import MonthsRange from 'Controls/_datePopup/MonthsRange';
import calendarTestUtils = require('ControlsUnit/Calendar/Utils');

describe('Controls/_datePopup/MonthsRange', function() {
   describe('Initialisation', function() {
      [{
         options: {},
         selectionViewType: MonthsRangeItem.SELECTION_VEIW_TYPES.days
      }, {
         options: {
            startValue: new Date(2019, 0)
         },
         selectionViewType: MonthsRangeItem.SELECTION_VEIW_TYPES.days
      }, {
         options: {
            endValue: new Date(2019, 1, 0)
         },
         selectionViewType: MonthsRangeItem.SELECTION_VEIW_TYPES.days
      }, {
         options: {
            startValue: new Date(2019, 1, 2),
            endValue: new Date(2019, 1, 3)
         },
         selectionViewType: MonthsRangeItem.SELECTION_VEIW_TYPES.days
      }, {
         options: {
            startValue: new Date(2019, 0),
            endValue: new Date(2019, 1, 0)
         },
         selectionViewType: MonthsRangeItem.SELECTION_VEIW_TYPES.months
      }].forEach(function(test) {
         it(`should set proper model for options ${JSON.stringify(test.options)}.`, function() {
            const component = calendarTestUtils.createComponent(MonthsRange, test.options);
            assert.strictEqual(component._selectionViewType, test.selectionViewType);
         });
      });
   });
});
