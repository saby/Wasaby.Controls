import Control = require('Core/Control');
import coreMerge = require('Core/core-merge');
import tmplNotify = require('Controls/Utils/tmplNotify');
import DateRangeModel = require('Controls/Date/model/DateRange');
import CalendarControlsUtils = require('Controls/Calendar/Utils');
import dateUtils = require('Controls/Utils/Date');
import MonthsRangeItem from './MonthsRangeItem';
import datePopupUtils from './Utils';
import componentTmpl = require('wml!Controls/_datePopup/MonthsRange');
import 'css!theme?Controls/_datePopup/RangeSelection';

/**
 * Component that allows you to select a period of multiple months.
 *
 * @class Controls/_datePopup/MonthsRange
 * @extends Core/Control
 * @control
 * @author Миронов А.Ю.
 *
 */

const
    ITEM_BODY_SELECTOR = '.controls-PeriodDialog-MonthsRange__body',
    ITEM_SELECTOR = '.controls-PeriodDialog-MonthsRange';

class Component extends Control {
    private _template: Function = componentTmpl;

    _proxyEvent: Function = tmplNotify;

    _year: Date;
    _rangeModel: DateRangeModel;

    constructor() {
        super();
        this._rangeModel = new DateRangeModel();
        CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
    }

    _beforeMount(options) {
        this._year = dateUtils.getStartOfYear(options.year || new Date());
        this._rangeModel.update(options);

        // this._updateRangeItems(options);
    }

    _afterMount() {
        this._updateScrollPosition();
    }

    _beforeUpdate(options) {
        this._rangeModel.update(options);
    }

    _beforeUnmount() {
        this._rangeModel.destroy();
    }

    _onItemClick(e) {
        e.stopPropagation();
    }

    _onScroll(e: Event, scrollTop: number) {
        let
            firstItem = this._container.querySelector(ITEM_SELECTOR),
            firstYear = datePopupUtils.dataStringToDate(firstItem.dataset.date),
            year = firstYear.getFullYear() + Math.floor(scrollTop / firstItem.offsetHeight);
        if (year !== this._year.getFullYear()) {
            this._year = new Date(year, 0);
            this._notify('yearChanged', [this._year]);
        }
    }

    private _updateScrollPosition() {
        if (!this._year) {
            return;
        }
        datePopupUtils.scrollToDate(this._container, ITEM_BODY_SELECTOR, this._year);
    }
}

Component.SELECTION_VEIW_TYPES = MonthsRangeItem.SELECTION_VEIW_TYPES;

Component.getDefaultOptions = function () {
    return coreMerge({
        selectionViewType: MonthsRangeItem.SELECTION_VEIW_TYPES.days
    }, {} /*IPeriodSimpleDialog.getDefaultOptions()*/);
};

// Component.getOptionTypes = function() {
//    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
// };

export default Component;
