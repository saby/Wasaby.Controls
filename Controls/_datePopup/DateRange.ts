import BaseControl = require('Core/Control');
import formatDate = require('Core/helpers/Date/format');
import EventProxy from './Mixin/EventProxy';
import DateRangeModel = require('Controls/Date/model/DateRange');
import {MonthModel} from 'Controls/calendar';
import quantumUtils = require('Controls/Date/Utils/DateRangeQuantum');
import DateControlsUtils = require('Controls/Calendar/Utils');
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
 * @author Миронов А.Ю.
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
        } else {
            self._notify('monthChanged', [month]);
        }
    }
};

var Component = BaseControl.extend([EventProxy], {
    _template: componentTmpl,

    _monthViewModel: MonthModel,

    _weekdaysCaptions: DateControlsUtils.getWeekdaysCaptions(),
    _formatDate: formatDate,

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
        if (this._monthScrollTo) {
            _private.updateScrollPosition(this, this._monthScrollTo);
            this._monthScrollTo = null;
        }
    },

    _beforeUpdate: function (options) {
        _private.updateView(this, options);
    },

    _afterUpdate: function(options) {
        if (this._monthScrollTo) {
            _private.updateScrollPosition(this, this._monthScrollTo);
            this._monthScrollTo = null;
        }
    },

    _beforeUnmount: function () {
        this._rangeModel.destroy();
    },

    _monthCaptionClick: function (e, month) {
        if (this._monthSelectionEnabled) {
            this._notify('fixedPeriodClick', [month, dateUtils.getEndOfMonth(month)]);
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

    _dateToString: function(date) {
        return datePopupUtils.dateToDataString(date);
    },

    _scrollToMonth: function(e, year, month) {
        _private.updateScrollPosition(this, new Date(year, month));
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
