import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import {descriptor} from 'Types/entity';
import IRangeSelectable from './_datePopup/IRangeSelectable';
import dateRange = require('Controls/dateRange');
import EventProxyMixin from './_datePopup/Mixin/EventProxy';
import DateRangeModel = require('Controls/Date/model/DateRange');
import MonthsRange from './_datePopup/MonthsRange';
import periodDialogUtils from './_datePopup/Utils';
import dateUtils = require('Controls/Utils/Date');
import componentTmpl = require('wml!Controls/_datePopup/DatePopup');
import headerTmpl = require('wml!Controls/_datePopup/header');
import 'css!theme?Controls/datePopup';

/**
 * A dialog that allows you to choose dates and periods of arbitrary duration.
 *
 * @class Controls/datePopup
 * @extends Core/Control
 * @mixes Controls/_dateRange/interfaces/IDateRangeSelectable
 * @mixes Controls/interface/IDateMask
 * @mixes Controls/_datePopup/interfaces/IDatePopup
 * @control
 * @public
 * @author Миронов А.Ю.
 * @demo Controls-demo/datePopup/datePopup
 *
 * @css @background-color_PeriodDialog Background color of dialog.
 * @css @width_PeriodDialog Dialog width.
 * @css @height_PeriodDialog Dialog height.
 * @css @border-width_PeriodDialog Borders width.
 * @css @border-color_PeriodDialog Borders color.
 * @css @background-color__PeriodDialog-header Background color of dialog header.
 * @css @spacing_PeriodDialog-header-between-borderLeft-content Spacing between left border and header content.
 * @css @height_PeriodDialog-header Height of dialog header.
 * @css @spacing_PeriodDialog-header-between-stateButton-date Spacing between state button and date in header.
 * @css @width_PeriodDialog-header-dash Width of the dash between start and end input fields.
 * @css @spacing_PeriodDialog-header-between-dash-date Spacing between dash and input fields.
 * @css @spacing_PeriodDialog-header-between-applyButton-otherElements Spacing between apply button and other header elements.
 * @css @height_PeriodDialog-years Height of the years panel.
 * @css @width_PeriodDialog-years-leftRight Width of the left and right regions in year mode.
 * @css @height_PeriodDialog-years-rangeButton Height of the years range button.
 * @css @color_PeriodDialog-years-rangeButton Color of the years range button.
 * @css @font-size_PeriodDialog-years-rangeButton Font size of the years range button.
 * @css @color_PeriodDialog-years-current-year Color of the text on button with current year.
 * @css @color_PeriodDialog-years-displayed-year Color of the text on button with displayed year.
 * @css @font-size_PeriodDialog-years-displayed-year Font size of the text on button with displayed year.
 * @css @border-width_PeriodDialog-monthRange: Default border width in years mode. For example between months.
 * @css @border-width_PeriodDialog-monthRange-additional: Border width between year end year title, half years or quarters and months in years mode.
 * @css @border-color_PeriodDialog-monthRange Color of borders in month range.
 * @css @height_PeriodDialog-monthRange-header Height of the month range year header.
 * @css @color_PeriodDialog-monthRange-header Color of the month range year header.
 * @css @font-size_PeriodDialog-monthRange-header Font size of the month range year header.
 * @css @color_PeriodDialog-monthRange-halfyearsAndQuarters Color of the text in halfyears and quarters buttons.
 * @css @border-color_PeriodDialog-monthRange-halfyearsAndQuarters_selected Border color of the borders selected halfyears and quarters regions.
 * @css @font-size_PeriodDialog-monthRange-halfYears Font size of the text in halfyears buttons.
 * @css @border-width_PeriodDialog-monthRange-halfYears Border width of the half years block in month range.
 * @css @font-size_PeriodDialog-monthRange-quarters Font size of the text in halfyears buttons.
 * @css @spacing_PeriodDialog-monthRange-monthWrapper-between-content-leftRightBorder Spacing between content and left and right border in month.
 * @css @height_PeriodDialog-monthRange-monthWrapper Height of the months in month range.
 * @css @width_PeriodDialog-monthRange-monthWrapper Width of the months in month range.
 * @css @border-color_PeriodDialog-monthRange-month Color of the border on hovered month in month range.
 * @css @color_PeriodDialog-monthRange-month-title Color of the title in month range.
 * @css @font-size_PeriodDialog-monthRange-month-title Font size of the title in month range.
 * @css @height_PeriodDialog-monthRange-month-title Height of the title in month range.
 * @css @height_PeriodDialog-monthRange-month-date Height of the month body in month range.
 * @css @font-size_PeriodDialog-monthRange-month-date Font size of the month body in month range.
 * @css @width_PeriodDialog-monthRange-month-selectionEdge Width of the edge line in first and end selected month.
 * @css @height_PeriodDialog-dateRange-header Height of date range header.
 * @css @font-size_PeriodDialog-dateRange-header Font size of date range header.
 * @css @width_PeriodDialog-dateRange-monthPanel Width of month panel in date range mode.
 * @css @spacing_PeriodDialog-dateRange-monthPanel-between-content-leftRightBorder Spacing between left border of month button and text in date range mode.
 * @css @color_PeriodDialog-dateRange-header-year Color of year in header in date range mode.
 * @css @font-weight_PeriodDialog-dateRange-header-year Font weight of year in header in date range mode.
 * @css @color_PeriodDialog-dateRange-header-workday Color of the workday in header in date range mode.
 * @css @color_PeriodDialog-dateRange-header-weekend Color of the weekend in header in date range mode.
 * @css @height_PeriodDialog-dateRange-months-button Height of the month button in date range mode.
 * @css @border-color_PeriodDialog-dateRange-months Border color of the month button in date range mode.
 * @css @color_PeriodDialog-dateRange-months-button Color of the month button in date range mode.
 * @css @font-size_PeriodDialog-dateRange-months-button Font size of the month button in date range mode.
 * @css @background-color_PeriodDialog-dateRange-months-button Background color of the month button in date range mode.
 * @css @border-color_PeriodDialog-dateRange-months-button_hover Border color of the hovered month button in date range mode.
 * @css @background-color_PeriodDialog-dateRange-months-button_hover Background color of the hovered month button in date range mode.
 * @css @color_PeriodDialog-dateRange-months-nextYearButton Color of the next year button in date range mode.
 * @css @font-size_PeriodDialog-dateRange-months-nextYearButton Font size of the next year button in date range mode.
 * @css @border-color_PeriodDialog-dateRange-months Border color of the next year button in date range mode.
 * @css @background-color_PeriodDialog-dateRange-months-nextYearButton Background color of the next year button in date range mode.
 * @css @border-color_PeriodDialog-dateRange-months-nextYearButton Border color of the next year button in date range mode.
 * @css @background-color_PeriodDialog-dateRange-months-nextYearButton_hover Background color of the next year hovered button in date range mode.
 * @css @height_PeriodDialog-dateRange-monthsWithDates-title Height of the month title in date range mode.
 * @css @font-size_PeriodDialog-dateRange-monthsWithDates-title Font size of the month title in date range mode.
 * @css @color_PeriodDialog-dateRange-monthsWithDates-title Color of the month title in date range mode.
 * @css @background-color_PeriodDialog-dateRange-monthsWithDates-title Background color of the month title in date range mode.
 * @css @border-color_PeriodDialog-dateRange-monthsWithDates-title_hover Border color of the hovered month title in date range mode.
 * @css @background-color_PeriodDialog-dateRange-monthsWithDates-title_hover Background color of the hovered month title in date range mode.
 *
 */

var _private = {
        fixedPeriodClick: function (self, start, end) {
            self._rangeModel.startValue = start;
            self._rangeModel.endValue = end;
            self._headerRangeModel.startValue = start;
            self._headerRangeModel.endValue = end;
            self._monthRangeSelectionProcessing = false;
            _private.sendResult(self, start, end);
        },
        selectionChanged: function (self, start, end) {
            self._headerRangeModel.startValue = start;
            self._headerRangeModel.endValue = end;
        },
        rangeChanged: function (self, start, end) {
            self._rangeModel.startValue = start;
            self._rangeModel.endValue = end;
            self._headerRangeModel.startValue = start;
            self._headerRangeModel.endValue = end;
        },
        sendResult: function (self, start, end) {
            self._notify(
                'sendResult',
                [start || self._rangeModel.startValue, end || self._rangeModel.endValue],
                {bubbling: true}
            );
        }
    },
    HEADER_TYPES = {
        link: 'link',
        input: 'input'
    },
    STATES = {
        year: 'year',
        month: 'month'
    };

var Component = BaseControl.extend([EventProxyMixin], {
    _template: componentTmpl,
    _headerTmpl: headerTmpl,

    _rangeModel: null,
    _headerRangeModel: null,
    _yearRangeModel: null,

    _displayedDate: null,

    _HEADER_TYPES: HEADER_TYPES,
    _headerType: HEADER_TYPES.link,

    _homeButtonVisible: true,

    _STATES: STATES,
    _state: STATES.year,

    _monthRangeSelectionViewType: MonthsRange.SELECTION_VEIW_TYPES.days,
    _monthRangeSelectionProcessing: false,

    _dateRangeSelectionProcessing: false,

    _yearStateEnabled: true,
    _monthStateEnabled: true,

    _yearRangeSelectionType: null,

    _beforeMount: function (options) {
        this._displayedDate = dateUtils.getStartOfMonth(options.startValue);

        this._rangeModel = new DateRangeModel();
        this._rangeModel.update(options);

        this._headerRangeModel = new DateRangeModel();
        this._headerRangeModel.update(options);

        this._yearRangeModel = new DateRangeModel();

        this._monthStateEnabled = periodDialogUtils.isMonthStateEnabled(options);
        this._yearStateEnabled = periodDialogUtils.isYearStateEnabled(options);

        if (!this._yearStateEnabled && this._monthStateEnabled) {
            this._state = STATES.month;
        }

        this._yearRangeSelectionType = options.selectionType;
        this._yearRangeQuantum = {};
        this._monthRangeSelectionType = options.selectionType;
        this._monthRangeQuantum = {};

        if (options.selectionType === 'quantum') {
            if ('years' in options.quantum) {
                this._yearRangeSelectionType = options.selectionType;
                this._yearRangeQuantum = {'years': options.quantum.years};
            } else {
                this._yearRangeSelectionType = 'disable';
            }
            if ('months' in options.quantum) {
                this._monthRangeSelectionType = options.selectionType;
                this._monthRangeQuantum = {'months': options.quantum.months};
            } else {
                this._monthRangeSelectionType = 'disable';
            }
        }

        this._headerType = options.headerType;
    },

    _beforeUpdate: function (options) {
        this._rangeModel.update(options);
    },

    _beforeUnmount: function () {
        this._rangeModel.destroy();
        this._headerRangeModel.destroy();
        this._yearRangeModel.destroy();
    },

    _toggleState: function () {
        this._state = this._state === STATES.year ? STATES.month : STATES.year;
    },

    _homeButtonClick: function () {
        this._displayedDate = dateUtils.getStartOfMonth(new Date());
    },

    _yearsRangeChanged: function (e, start, end) {
        _private.rangeChanged(this, start, end ? dateUtils.getEndOfYear(end) : null);
    },

    _headerLinkClick: function (e) {
        if (this._headerType === this._HEADER_TYPES.link) {
            this._headerType = this._HEADER_TYPES.input;
        } else {
            this._headerType = this._HEADER_TYPES.link;
        }
    },

    _startValuePickerChanged: function (e, value) {
        _private.rangeChanged(
            this,
            value,
            this._options.selectionType === IRangeSelectable.SELECTION_TYPES.single ? value : this._rangeModel.endValue
        );
    },

    _endValuePickerChanged: function (e, value) {
        _private.rangeChanged(
            this,
            this._options.selectionType === IRangeSelectable.SELECTION_TYPES.single
                ? value : this._rangeModel.startValue,
            value
        );
    },

    _yearsSelectionChanged: function (e, start, end) {
        _private.selectionChanged(this, start, end ? dateUtils.getEndOfYear(end) : null);
    },

    _yearsSelectionStarted: function (e, start, end) {
        this._monthRangeSelectionViewType = MonthsRange.SELECTION_VEIW_TYPES.days;
        this._monthRangeSelectionProcessing = false;
    },

    _yearsRangeSelectionEnded: function (e, start, end) {
        _private.sendResult(this, start, dateUtils.getEndOfYear(end));
    },

    _monthsRangeChanged: function (e, start, end) {
        _private.rangeChanged(this, start, end ? dateUtils.getEndOfMonth(end) : null);
        this._yearRangeModel.startValue = null;
        this._yearRangeModel.endValue = null;
    },

    _monthsSelectionChanged: function (e, start, end) {
        _private.selectionChanged(this, start, end ? dateUtils.getEndOfMonth(end) : null);
    },

    _monthsRangeSelectionEnded: function (e, start, end) {
        _private.sendResult(this, start, dateUtils.getEndOfMonth(end));
    },

    _monthRangeMonthClick: function (e, date) {
        this._displayedDate = date;
        this._toggleState();
    },

    _monthRangeFixedPeriodClick: function (e, start, end) {
        _private.fixedPeriodClick(this, start, end);
    },

    _dateRangeChanged: function (e, start, end) {
        _private.rangeChanged(this, start, end);
        this._monthRangeSelectionProcessing = false;
    },

    _dateRangeSelectionChanged: function (e, start, end) {
        _private.selectionChanged(this, start, end);
    },

    _dateRangeSelectionEnded: function (e, start, end) {
        _private.sendResult(this, start, end);
    },

    _dateRangeFixedPeriodClick: function (e, start, end) {
        _private.fixedPeriodClick(this, start, end);
    },

    _applyClick: function (e) {
        _private.sendResult(this);
    },

    _closeClick: function () {
        this._notify('close');
    }
});

Component._private = _private;

Component.SELECTION_TYPES = IRangeSelectable.SELECTION_TYPES;
Component.HEADER_TYPES = HEADER_TYPES;

Component.getDefaultOptions = function () {
    return coreMerge({

        /**
         * @name Controls/datePopup#emptyCaption
         * @cfg {String} Text that is used if the period is not selected
         */
        emptyCaption: rk('Не указан'),

        /**
         * @name Controls/datePopup#headerType
         * @cfg {String} Type of the header.
         * @variant link
         * @variant input
         */
        headerType: HEADER_TYPES.link

    }, IRangeSelectable.getDefaultOptions());
};

Component.getOptionTypes = function () {
    return coreMerge({
        headerType: descriptor(String).oneOf([
            HEADER_TYPES.link,
            HEADER_TYPES.input
        ]),
    }, dateRange.IDateRangeSelectable.getOptionTypes());
};

export = Component;
