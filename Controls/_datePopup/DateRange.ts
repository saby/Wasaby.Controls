import BaseControl = require('Core/Control');
import {date as formatDate} from 'Types/formatter';
import { SyntheticEvent } from 'Vdom/Vdom';
import EventProxy from './Mixin/EventProxy';
import {DateRangeModel, Utils as DateControlsUtils, dateRangeQuantum as quantumUtils} from 'Controls/dateRange';
import {MonthModel} from 'Controls/calendar';
import dateUtils = require('Controls/Utils/Date');
import scrollToElement = require('Controls/Utils/scrollToElement');
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

const
    MONTH_CLASS = 'controls-PeriodDialog-DateRangeItem__monthList_monthWrapper',
    MONTH_SELECTOR = '.' + MONTH_CLASS,
    CURRENT_MONTH_CLASS = 'controls-PeriodDialog-DateRangeItem__monthList_current',
    CURRENT_MONTH_SELECTOR = '.' + CURRENT_MONTH_CLASS;

const _private = {
    updateView: function (self, options, dontUpdateScroll) {
        self._rangeModel.update(options);
        self._monthSelectionEnabled = options.selectionType === 'range' ||
            (options.selectionType === 'quantum' && quantumUtils.monthSelectionEnabled(options.quantum) &&
                options.quantum.months[0] === 1);
        if (!dontUpdateScroll && !dateUtils.isDatesEqual(self._month, options.month)) {
            self._month = options.month;
            if (!datePopupUtils.getElementByDate(self._container, MONTH_SELECTOR, options.month)) {
                self._year = self._month;
            }
            self._monthScrollTo = self._month;
        }
    },
    setMonth: function (self, month) {
        if (dateUtils.isDatesEqual(self._month, month)) {
            return;
        }
        self._month = month;
        self._notify('monthChanged', [month]);
    },

    updateScrollPosition: function (self, month) {
        var displayedContainer = datePopupUtils.getElementByDate(self._container, MONTH_SELECTOR, month);

        if (displayedContainer) {
            scrollToElement(displayedContainer);
            return true;
        }
        return false;
    },

    updateScrollAfterViewModification: function(self) {
        if (self._monthScrollTo) {
            if (_private.updateScrollPosition(self, self._monthScrollTo)) {
                self._monthScrollTo = null;
            }
        }
    },

    _scrollToMonth: function(self, month) {
        if (!_private.updateScrollPosition(self, month)) {
            self._notify('monthChanged', [month]);
        }
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

    _month: null,
    _year: null,
    _monthScrollTo: null,

    constructor: function () {
        Component.superclass.constructor.apply(this, arguments);
        this._rangeModel = new DateRangeModel();
        DateControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
    },

    _beforeMount: function (options) {
        this._month = options.month || new Date();
        this._monthScrollTo = this._month;
        this._year = this._month;
        _private.updateView(this, options);
    },

    _afterMount: function(options) {
        _private.updateScrollAfterViewModification(this);
    },

    _beforeUpdate: function (options) {
        _private.updateView(this, options);
    },

    _afterUpdate: function(options) {
        _private.updateScrollAfterViewModification(this);
    },

    _drawItemsHandler: function() {
        _private.updateScrollAfterViewModification(this);
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

    _onScroll: function(e, scrollTop) {
        var scrollContainerTop = this._children.monthList._container.getBoundingClientRect().top,
            monthsElements = this._container.querySelectorAll(MONTH_SELECTOR),
            first = false,
            date;
        Array.prototype.forEach.call(monthsElements, function (el, i) {
            if ((scrollContainerTop < el.getBoundingClientRect().top + el.offsetHeight) && !first) {
                first = true;
                date = el;
            }
        });
        date = datePopupUtils.dataStringToDate(date.getAttribute('data-date'));
        _private.setMonth(this, date);
    },

    _wheelHandler: function(event) {
        let year;

        if (event.nativeEvent.deltaY > 0) {
            year = this._month.getFullYear() + 1;
        } else {
            year = this._month.getFullYear() - 1;
        }
        _private._scrollToMonth(this, new Date(year, 0, 1));
        event.preventDefault();
    },

    _dateToString: function(date) {
        return datePopupUtils.dateToDataString(date);
    },

    _scrollToMonth: function(e, year, month) {
        _private._scrollToMonth(this, new Date(year, month));
    },

    _formatMonth: function(month) {
        return formatDate(new Date(2000, month), 'MMMM');
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
