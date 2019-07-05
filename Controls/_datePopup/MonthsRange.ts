import Control = require('Core/Control');
import coreMerge = require('Core/core-merge');
import tmplNotify = require('Controls/Utils/tmplNotify');
import {DateRangeModel, Utils as CalendarControlsUtils} from 'Controls/dateRange';
import dateUtils = require('Controls/Utils/Date');
import MonthsRangeItem from './MonthsRangeItem';
import datePopupUtils from './Utils';
import componentTmpl = require('wml!Controls/_datePopup/MonthsRange');
import 'css!theme?Controls/datePopup';

/**
 * Component that allows you to select a period of multiple months.
 *
 * @class Controls/_datePopup/MonthsRange
 * @extends Core/Control
 * @control
 * @author Красильников А.С.
 *
 */

const
    ITEM_BODY_SELECTOR = '.controls-PeriodDialog-MonthsRange__body',
    ITEM_SELECTOR = '.controls-PeriodDialog-MonthsRange';

class Component extends Control {
    private _template: Function = componentTmpl;

    _proxyEvent: Function = tmplNotify;

    _startPosition: Date;
    _displayedPosition: Date;
    _rangeModel: DateRangeModel;

    constructor() {
        super();
        this._rangeModel = new DateRangeModel();
        CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
    }

    _beforeMount(options) {
        this._displayedPosition = dateUtils.getStartOfYear(options.year || new Date());
        this._startPosition = this._displayedPosition;
        this._rangeModel.update(options);

        // this._updateRangeItems(options);
    }

    _afterMount() {
        this._updateScrollPosition();
    }

    _beforeUpdate(options) {
        this._rangeModel.update(options);
        if (options.year.getFullYear() !== this._displayedPosition.getFullYear()) {
            this._displayedPosition = options.year;
            this._startPosition = this._displayedPosition;
        }
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
        if (year !== this._displayedPosition.getFullYear()) {
            this._displayedPosition = new Date(year, 0);
            this._notify('yearChanged', [this._displayedPosition]);
        }
    }

    private _updateScrollPosition() {
        if (!this._displayedPosition) {
            return;
        }
        datePopupUtils.scrollToDate(this._container, ITEM_BODY_SELECTOR, this._displayedPosition);
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
