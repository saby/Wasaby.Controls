import Control = require('Core/Control');
import coreMerge = require('Core/core-merge');
import {date as formatDate} from 'Types/formatter';
import tmplNotify = require('Controls/Utils/tmplNotify');
import {DateRangeModel, Utils as CalendarControlsUtils} from 'Controls/dateRange';
import dateUtils = require('Controls/Utils/Date');
import MonthsRangeItem from './MonthsRangeItem';
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

class Component extends Control {
    private _template: Function = componentTmpl;

    _proxyEvent: Function = tmplNotify;

    _position: Date;
    _rangeModel: DateRangeModel;

    _formatDate: Function = formatDate;

    _selectionViewType: string;

    constructor() {
        super();
        this._rangeModel = new DateRangeModel();
        CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
    }

    _beforeMount(options) {
        this._position = dateUtils.getStartOfYear(options.position || new Date());
        this._rangeModel.update(options);
        this._updateSelectionType(options);
    }

    _beforeUpdate(options) {
        this._rangeModel.update(options);
        if (options.position.getFullYear() !== this._position.getFullYear()) {
            this._position = dateUtils.getStartOfYear(options.position);
        }
        this._updateSelectionType(options);
    }

    _beforeUnmount() {
        this._rangeModel.destroy();
    }

    _onItemClick(e) {
        e.stopPropagation();
    }

    _onPositionChanged(e: Event, position: Date) {
        this._notify('positionChanged', [position]);
    }

    private _updateSelectionType(options): void {
        if (dateUtils.isStartOfMonth(options.startValue) && dateUtils.isEndOfMonth(options.endValue)) {
            this._selectionViewType = MonthsRangeItem.SELECTION_VEIW_TYPES.months;
        } else {
            this._selectionViewType = MonthsRangeItem.SELECTION_VEIW_TYPES.days;
        }
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
