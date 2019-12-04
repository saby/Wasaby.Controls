import rk = require('i18n!Controls_localization');
import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import {date as formatDate} from 'Types/formatter';
import {Date as WSDate} from 'Types/entity';
import getCurrentPeriod = require('Core/helpers/Date/getCurrentPeriod');
import IPeriodSimpleDialog from './_dateLitePopup/IDateLitePopup';
import dateUtils = require('Controls/Utils/Date');
import componentTmpl = require('wml!Controls/_dateLitePopup/DateLitePopup');
import itemTmpl = require('wml!Controls/_dateLitePopup/Item');
import itemFullTmpl = require('wml!Controls/_dateLitePopup/ItemFull');
import itemMonthsTmpl = require('wml!Controls/_dateLitePopup/ItemMonths');
import itemQuartersTmpl = require('wml!Controls/_dateLitePopup/ItemQuarters');
import ItemWrapper = require('wml!Controls/_dateLitePopup/ItemWrapper');
import monthCaptionTemplate = require('wml!Controls/_dateLitePopup/MonthCaption');
import 'css!theme?Controls/_dateLitePopup/DateLitePopup';

/**
 * Контрол выбора даты или периода.
 *
 * @class Controls/dateLitePopup
 * @extends Core/Control
 * @mixes Controls/dateLitePopup/IDateLitePopup
 * @control
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/Date/PeriodLiteDialog
 *
 */

/*
 * Control for date or period selection.
 *
 * @class Controls/dateLitePopup
 * @extends Core/Control
 * @mixes Controls/dateLitePopup/IDateLitePopup
 * @control
 * @public
 * @author Красильников А.С.
 * @demo Controls-demo/Date/PeriodLiteDialog
 *
 */

var _private = {

    _getDefaultYear: function (options, dateConstructor) {

        var start = options.startValue,
            currentYear = (new dateConstructor()).getFullYear(),
            startValueYear;

        if (!options.chooseYears || options.chooseHalfyears || options.chooseQuarters || options.chooseMonths) {
            return start ? start.getFullYear() : undefined;
        }

        startValueYear = start ? start.getFullYear() : null;

        if (!startValueYear) {
            return currentYear;
        }

        if (startValueYear >= currentYear) {
            return startValueYear;
        } else if (currentYear - startValueYear >= 5) {
            return startValueYear + 4;
        } else {
            return currentYear;
        }
    },

    getQuarterData: function (quarterNumber, monthName, monthIndex) {
        return {
            number: quarterNumber * 3 + monthIndex,
            name: monthName
        };
    },
    getYearModel: function (year, dateConstructor) {
        return [{
            name: 'I',
            tooltip: formatDate(new dateConstructor(year, 0, 1), formatDate.FULL_HALF_YEAR),
            quarters: [{
                name: 'I',
                fullName: formatDate(new dateConstructor(year, 0, 1), 'QQQQr'),
                tooltip: formatDate(new dateConstructor(year, 0, 1), formatDate.FULL_QUATER),
                months: [{
                    name: new dateConstructor(year, 0, 1),
                    tooltip: formatDate(new dateConstructor(year, 0, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 1, 1),
                    tooltip: formatDate(new dateConstructor(year, 1, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 2, 1),
                    tooltip: formatDate(new dateConstructor(year, 2, 1), formatDate.FULL_MONTH)
                }],
                number: 0
            }, {
                name: 'II',
                fullName: formatDate(new dateConstructor(year, 3, 1), 'QQQQr'),
                tooltip: formatDate(new dateConstructor(year, 3, 1), formatDate.FULL_QUATER),
                months: [{
                    name: new dateConstructor(year, 3, 1),
                    tooltip: formatDate(new dateConstructor(year, 3, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 4, 1),
                    tooltip: formatDate(new dateConstructor(year, 4, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 5, 1),
                    tooltip: formatDate(new dateConstructor(year, 5, 1), formatDate.FULL_MONTH)
                }],
                number: 1
            }]
        }, {
            name: 'II',
            tooltip: formatDate(new dateConstructor(year, 6, 1), formatDate.FULL_HALF_YEAR),
            quarters: [{
                name: 'III',
                fullName: formatDate(new dateConstructor(year, 6, 1), 'QQQQr'),
                tooltip: formatDate(new dateConstructor(year, 6, 1), formatDate.FULL_QUATER),
                months: [{
                    name: new dateConstructor(year, 6, 1),
                    tooltip: formatDate(new dateConstructor(year, 6, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 7, 1),
                    tooltip: formatDate(new dateConstructor(year, 7, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 8, 1),
                    tooltip: formatDate(new dateConstructor(year, 8, 1), formatDate.FULL_MONTH)
                }],
                number: 2
            }, {
                name: 'IV',
                fullName: formatDate(new dateConstructor(year, 9, 1), 'QQQQr'),
                tooltip: formatDate(new dateConstructor(year, 9, 1), formatDate.FULL_QUATER),
                months: [{
                    name: new dateConstructor(year, 9, 1),
                    tooltip: formatDate(new dateConstructor(year, 9, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 10, 1),
                    tooltip: formatDate(new dateConstructor(year, 10, 1), formatDate.FULL_MONTH)
                }, {
                    name: new dateConstructor(year, 11, 1),
                    tooltip: formatDate(new dateConstructor(year, 11, 1), formatDate.FULL_MONTH)
                }],
                number: 3
            }]
        }];
    }
};

var Component = BaseControl.extend({
    _template: componentTmpl,
    _defaultItemTemplate: itemTmpl,
    _itemTmplByType: null,
    _monthCaptionTemplate: null,

    _year: null,

    _yearHovered: false,
    _halfyearHovered: false,

    _formatDate: formatDate,

    // constructor: function() {
    //    this._dayFormatter = this._dayFormatter.bind(this);
    //    Component.superclass.constructor.apply(this, arguments);
    // },

    _beforeMount: function (options) {

        this._monthCaptionTemplate = monthCaptionTemplate;

        if (options.chooseHalfyears && options.chooseQuarters && options.chooseMonths) {
            this._itemTmplByType = itemFullTmpl;
        } else if (options.chooseMonths) {
            this._itemTmplByType = itemMonthsTmpl;
        } else if (options.chooseQuarters) {
            this._itemTmplByType = itemQuartersTmpl;
        }

        if (options.year instanceof Date) {
            this._year = options.year.getFullYear();
        } else {
            this._year = _private._getDefaultYear(options, options.dateConstructor);
            if (!this._year) {
                this._year = (new options.dateConstructor()).getFullYear();
            }
        }
        this._emptyCaption = options.emptyCaption;
        if (!this._emptyCaption) {
            if (options.chooseMonths && (options.chooseQuarters || options.chooseHalfyears)) {
                this._emptyCaption = rk('Период не указан');
            } else {
                this._emptyCaption = rk('Не указан');
            }
        }

        this._caption = options.captionFormatter(options.startValue, options.endValue, options.emptyCaption);

        this._months = _private.getYearModel(this._year, options.dateConstructor);
    },

    _beforeUpdate: function (options) {
        // this._caption = _private._getCaption(options);
    },

    /**
     * Sets the current year
     * @param year
     */
    setYear: function (year) {
        this._year = year;
        this._months = _private.getYearModel(this._year, this._options.dateConstructor);
        this._notify('yearChanged', [year]);
    },

    _onYearMouseEnter: function () {
        if (this._options.chooseYears) {
            this._yearHovered = true;
        }
    },

    _onYearMouseLeave: function () {
        this._yearHovered = false;
    },

    _onPrevYearBtnClick: function () {
        var year = this._year - 1;
        this.setYear(year);
    },

    _onNextYearBtnClick: function () {
        var year = this._year + 1;
        this.setYear(year);
    },

    _onHomeClick: function () {
        var periodType = 'year', period;
        if (this._options.chooseMonths) {
            periodType = 'month';
        } else if (this._options.chooseQuarters) {
            periodType = 'quarter';
        } else if (this._options.chooseHalfyears) {
            periodType = 'halfyear';
        }
        period = getCurrentPeriod(periodType);
        this.setYear((new Date()).getFullYear());
        this._notify(
            'sendResult',
            [new this._options.dateConstructor(period[0]), new this._options.dateConstructor(period[1])],
            {bubbling: true});
    },

    _onWheel: function (event) {
        let wheelDelta = event.nativeEvent.deltaY;
        // In the year selection mode, years are located in another direction.
        if (this._options.chooseQuarters || this._options.chooseHalfyears || this._options.chooseMonths) {
            wheelDelta = -wheelDelta;
        }
        if (wheelDelta > 0) {
            this._onPrevYearBtnClick();
        } else {
            this._onNextYearBtnClick();
        }
        event.preventDefault();
    },

    _onQuarterMouseEnter: function (event, quarter) {
        this._quarterHovered = quarter;
    },

    _onQuarterMouseLeave: function () {
        this._quarterHovered = null;
    },

    _onHalfYearMouseEnter: function (event, halfyear) {
        this._halfyearHovered = halfyear;
    },

    _onHalfYearMouseLeave: function () {
        this._halfyearHovered = null;
    },

    _onHeaderClick: function () {
        this._notify('close', [], {bubbling: true});
    },

    _onYearClick: function (event, year) {
        if (this._options.chooseYears) {
            this._notify(
                'sendResult',
                [new this._options.dateConstructor(year, 0, 1), new this._options.dateConstructor(year, 11, 31)],
                {bubbling: true});
        }
    },

    _onHalfYearClick: function (event, halfYear) {
        var start = new this._options.dateConstructor(this._year, halfYear * 6, 1),
            end = new this._options.dateConstructor(this._year, (halfYear + 1) * 6, 0);
        this._notify('sendResult', [start, end], {bubbling: true});
    },

    _onQuarterClick: function (event, quarter) {
        var start = new this._options.dateConstructor(this._year, quarter * 3, 1),
            end = new this._options.dateConstructor(this._year, (quarter + 1) * 3, 0);
        this._notify('sendResult', [start, end], {bubbling: true});
    },

    _onMonthClick: function (event, month) {
        this._notify('sendResult', [month, dateUtils.getEndOfMonth(month)], {bubbling: true});
    },

    _getWidthCssClass: function () {
        if (this._options.chooseHalfyears) {
            return 'controls-PeriodLiteDialog__width-big';
        }
        if (this._options.chooseQuarters || this._options.chooseMonths) {
            return 'controls-PeriodLiteDialog__width-medium';
        }
        return '';
    },

    _getYearCssClasses: function () {
        var css = [];
        if (this._options.chooseYears) {
            css.push('controls-PeriodLiteDialog__year-clickable');
        }
        if (this._options.chooseMonths && this._options.chooseQuarters && this._options.chooseHalfyears) {
            css.push('controls-PeriodLiteDialog__year-medium');
        } else if (this._options.chooseMonths) {
            css.push('controls-PeriodLiteDialog__year-center-lite');
        }
        return css.join(' ');
    },

    _getYearItemCssClasses: function (year) {
        var css = [],
            date = this._options.startValue;
        if (!dateUtils.isValidDate(date) || (year !== date.getFullYear())) {
            css.push('controls-PeriodLiteDialog__vLayoutItem-clickable');
        }
        if (dateUtils.isValidDate(date) && (year === date.getFullYear())) {
            css.push('controls-PeriodLiteDialog__selectedYear');
        }
        return css.join(' ');
    }

});

Component._private = _private;

Component.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

Component.getDefaultOptions = function () {
    return {
        ...IPeriodSimpleDialog.getDefaultOptions(),
        itemTemplate: ItemWrapper,
        dateConstructor: WSDate
    };
};

Component.getOptionTypes = function () {
    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
};

export = Component;
