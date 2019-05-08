import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import formatDate = require('Core/helpers/Date/format');
import IMonth = require('Controls/Date/interface/IMonth');
import Slider from './MonthSlider/Slider';
import calendarUtils = require('Controls/Calendar/Utils');
import DateUtil = require('Controls/Utils/Date');
import monthTmpl = require('wml!Controls/_calendar/MonthSlider/MonthSlider');

/**
 * A calendar that displays 1 month and allows you to switch to the next and previous months using the buttons.
 * Designed to select a date or period within a few months or years.
 *
 * @class Controls/_calendar/MonthSlider
 * @extends Core/Control
 * @mixes Controls/_calendar/interface/IMonth
 * @mixes Controls/Date/interface/IRangeSelectable
 * @mixes Controls/_dateRange/interfaces/IDateRangeSelectable
 * @control
 * @public
 * @author Миронов А.Ю.
 * @demo Controls-demo/Calendar/MonthSlider
 *
 */

var _private = {
    _setMonth: function (self, month, silent) {
        if (DateUtil.isDatesEqual(month, self._month)) {
            return;
        }
        self._animation = month < self._month ? Slider.ANIMATIONS.slideRight : Slider.ANIMATIONS.slideLeft;
        self._month = month;
        self._isHomeVisible = !DateUtil.isMonthsEqual(month, new Date());
        if (!silent) {
            self._notify('monthChanged', [month]);
        }
    }
};

var Component = BaseControl.extend({
    _template: monthTmpl,
    _month: null,
    _animation: Slider.ANIMATIONS.slideLeft,
    _isHomeVisible: true,
    _days: [],
    _formatDate: formatDate,

    _beforeMount: function (options) {
        // TODO: Тема для аккордеона. Временное решение, переделать когда будет понятно, как мы будем делать разные темы в рамках одной страницы.
        if (options.theme === 'accordion') {
            this._themeCssClass = 'controls-MonthSlider__accordionTheme';
        }
        this._days = calendarUtils.getWeekdaysCaptions();
        _private._setMonth(this, options.month, true);
    },

    _beforeUpdate: function (options) {
        this._days = calendarUtils.getWeekdaysCaptions();
        _private._setMonth(this, options.month, true);
    },

    _slideMonth: function (event, delta) {
        _private._setMonth(this, new Date(this._month.getFullYear(), this._month.getMonth() + delta, 1));
    },

    _setCurrentMonth: function () {
        _private._setMonth(this, DateUtil.normalizeDate(new Date()));
    },

    _itemClickHandler: function (event, item) {
        this._notify('itemClick', [item]);
    },

    _onStartValueChanged: function (event, value) {
        this._notify('startValueChanged', [value]);
    },

    _onEndValueChanged: function (event, value) {
        this._notify('endValueChanged', [value]);
    }
});

Component.getDefaultOptions = function () {
    return coreMerge({}, IMonth.getDefaultOptions());
};

Component.getOptionTypes = function () {
    return coreMerge({}, IMonth.getOptionTypes());
};

Component._theme = ['Controls/calendar'];

Component._private = _private;

export default Component;
export {default as Base} from './MonthSlider/Slider';
