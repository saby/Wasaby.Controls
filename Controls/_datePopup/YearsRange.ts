import BaseControl = require('Core/Control');
import DateRangeModel = require('Controls/Date/model/DateRange');
import rangeSelectionUtils = require('Controls/Date/Utils/RangeSelection');
import dateUtils = require('Controls/Utils/Date');
import componentTmpl = require('wml!Controls/_datePopup/YearsRange');
import 'css!theme?Controls/_datePopup/RangeSelection';

/**
 * Component that allows you to select periods that are multiples of years.
 *
 * @class Controls/_datePopup/YearsRange
 * @extends Core/Control
 * @control
 * @author Миронов А.Ю.
 *
 */

const BUTTONS_COUNT = 6;

var Component = BaseControl.extend({
    _template: componentTmpl,

    _year: null,
    _rangeModel: null,
    _model: null,
    _lastYear: null,

    // constructor: function() {
    //    this._dayFormatter = this._dayFormatter.bind(this);
    //    Component.superclass.constructor.apply(this, arguments);
    // },

    _beforeMount: function (options) {
        this._year = options.year ? options.year.getFullYear() : (new Date()).getFullYear();
        this._lastYear = this._year;
        this._rangeModel = new DateRangeModel();
        this._rangeModel.update(options);
        this._updateModel();
    },

    _beforeUpdate: function (options) {
        if (!dateUtils.isYearsEqual(options.year, this._options.year)) {
            this._year = options.year.getFullYear();
            if (this._year > this._lastYear) {
                this._lastYear = this._year;
            } else if (this._year <= this._lastYear - BUTTONS_COUNT) {
                this._lastYear = this._year + BUTTONS_COUNT - 1;
            }
        }
        this._rangeModel.update(options);
        this._updateModel();
    },

    _beforeUnmount: function () {
        this._rangeModel.destroy();
    },

    _onPrevClick: function () {
        this._lastYear--;
        this._updateModel();
    },

    _onNextClick: function () {
        this._lastYear++;
        this._updateModel();
    },

    _onItemClick: function (e, date) {
        this._notify('itemClick', [date]);
    },

    _onItemMouseEnter: function (e, date) {
        this._notify('itemMouseEnter', [date]);
    },

    _onItemMouseLeave: function (e, date) {
        this._notify('itemMouseLeave', [date]);
    },

    _updateModel: function () {
        var items = [],
            currentYear = (new Date()).getFullYear(),
            item, year;

        for (var i = 0; i < BUTTONS_COUNT; i++) {
            year = this._lastYear - BUTTONS_COUNT + 1 + i;
            item = {
                caption: year,
                isDisplayed: year === this._year,
                isCurrent: year === currentYear,
                date: new Date(year, 0),
                year: year
            };

            items.push(item);
        }
        this._model = items;
    },

    _prepareItemClass: function (itemValue) {
        let
            css = [],
            itemDate = new Date(itemValue, 0);

        css.push(rangeSelectionUtils.prepareSelectionClass(
            itemDate,
            this._rangeModel.startValue,
            this._rangeModel.endValue,
            this._options.selectionProcessing,
            this._options.selectionBaseValue,
            this._options.selectionHoveredValue
        ));

        css.push(rangeSelectionUtils.prepareHoveredClass(
            itemDate,
            this._options.hoveredStartValue,
            this._options.hoveredEndValue
        ));

        if (itemValue === this._year) {
            css.push('controls-PeriodDialog-Years__item-displayed');
        } else if (itemValue === (new Date()).getFullYear()) {
            css.push('controls-PeriodDialog-Years__item-current');
        } else {
            css.push('controls-PeriodDialog-Years__rangeBtn-regular');
        }
        return css.join(' ');
    }

});

// Component.EMPTY_CAPTIONS = IPeriodSimpleDialog.EMPTY_CAPTIONS;

// Component.getDefaultOptions = function() {
//    return coreMerge({}, {} /*IPeriodSimpleDialog.getDefaultOptions()*/);
// };

// Component.getOptionTypes = function() {
//    return coreMerge({}, IPeriodSimpleDialog.getOptionTypes());
// };

export = Component;
