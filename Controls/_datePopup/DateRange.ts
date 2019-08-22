import BaseControl = require('Core/Control');
import {date as formatDate} from 'Types/formatter';
import { SyntheticEvent } from 'Vdom/Vdom';
import EventProxy from './Mixin/EventProxy';
import {DateRangeModel, Utils as DateControlsUtils, dateRangeQuantum as quantumUtils} from 'Controls/dateRange';
import {MonthModel} from 'Controls/calendar';
import dateUtils = require('Controls/Utils/Date');
import datePopupUtils from './Utils';
import componentTmpl = require('wml!Controls/_datePopup/DateRange');
import 'wml!Controls/_datePopup/DateRangeItem';
import 'css!theme?Controls/datePopup';

/**
 * Component that allows you to select periods of multiple days.
 *
 * @class Controls/_datePopup/DateRange
 * @extends Core/Control
 * @control
 * @author Красильников А.С.
 *
 */

const _private = {
    updateView: function (self, options, dontUpdateScroll) {
        self._rangeModel.update(options);
        self._monthSelectionEnabled = options.selectionType === 'range' ||
            (options.selectionType === 'quantum' && quantumUtils.monthSelectionEnabled(options.quantum) &&
                options.quantum.months[0] === 1);
    },

    notifyPositionChanged: function(self, date) {
        self._notify('positionChanged', [date]);
    }
};

var Component = BaseControl.extend([EventProxy], {
    _template: componentTmpl,

    _monthViewModel: MonthModel,

    _weekdaysCaptions: DateControlsUtils.getWeekdaysCaptions(),
    _formatDate: formatDate,

    _isStickySupport: datePopupUtils.isStickySupport(),

    _monthSelectionEnabled: true,
    _selectionProcessing: false,

    constructor: function () {
        Component.superclass.constructor.apply(this, arguments);
        this._rangeModel = new DateRangeModel();
        DateControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
    },

    _beforeMount: function (options) {
        _private.updateView(this, options);
    },

    _beforeUpdate: function (options) {
        _private.updateView(this, options);
    },

    _beforeUnmount: function () {
        this._rangeModel.destroy();
    },

    _monthCaptionClick: function(e: SyntheticEvent, yearDate: Date, month: number): void {
        let date;
        if (this._monthSelectionEnabled) {
            date = new Date(yearDate.getFullYear(), month);
            this._notify('fixedPeriodClick', [date, dateUtils.getEndOfMonth(date)]);
        }
    },

    /**
     * [текст, условие, если true, если false]
     * @param prefix
     * @param style
     * @param cfgArr
     * @private
     */
    _prepareCssClass: function (prefix, style, cfgArr) {
        var cssClass = prefix;
        if (style) {
            cssClass += '-' + style;
        }
        return cfgArr.reduce(function (previousValue, currentValue, index) {
            var valueToAdd = currentValue[0] ? currentValue[1] : currentValue[2];
            if (valueToAdd) {
                return previousValue + '-' + valueToAdd;
            }
            return previousValue;
        }, cssClass);
    },

    _onItemClick: function (e) {
        e.stopPropagation();
    },

    _wheelHandler: function(event) {
        const
            //TODO remove after complete https://online.sbis.ru/opendoc.html?guid=7c921a5b-8882-4fd5-9b06-77950cbe2f79
            container = this._container.get ? this._container.get(0) : this._container,
            height = container.offsetHeight,
            offset = this._children.monthList.getDisplayedItemOffset(dateUtils.getStartOfYear(this._options.position));

        let date;

        if (event.nativeEvent.deltaY > 0 && offset.top > 0 && offset.bottom > height) {
            date = new Date(this._options.position.getFullYear(), 10, 1);
            this._children.monthList.scrollIntoView(date);
        } else if ( event.nativeEvent.deltaY < 0 && offset.top > 0 && offset.bottom > 0) {
            date = new Date(this._options.position.getFullYear(), 0, 1);
            this._children.monthList.scrollIntoView(date);
        }
    },

    _dateToString: function(date) {
        return datePopupUtils.dateToDataString(date);
    },

    _scrollToMonth: function(e, year, month) {
        _private.notifyPositionChanged(this, new Date(year, month));
    },

    _formatMonth: function(month) {
        return formatDate(new Date(2000, month), 'MMMM');
    },

    _getMonth: function(year, month) {
        return new Date(year, month, 1);
    },

    _onPositionChanged: function(e: Event, position: Date) {
        _private.notifyPositionChanged(this, position);
    }

});

Component._private = _private;

// Component.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

// Component.getDefaultOptions = function() {
//    return coreMerge({}, {} /*IPeriodSimpleDialog.getDefaultOptions()*/);
// };

// Component.getOptionTypes = function() {
//    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
// };

export = Component;
