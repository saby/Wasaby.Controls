import BaseControl = require('Core/Control');
import formatDate = require('Core/helpers/Date/format');
import EventProxy from './Mixin/EventProxy';
import DateRangeModel = require('Controls/Date/model/DateRange');
import {MonthModel} from 'Controls/calendar';
import quantumUtils = require('Controls/Date/Utils/DateRangeQuantum');
import DateControlsUtils = require('Controls/Calendar/Utils');
import dateUtils = require('Controls/Utils/Date');
import componentTmpl = require('wml!Controls/_datePopup/DateRange');
import 'wml!Controls/_datePopup/DateRangeItem';
import 'css!theme?Controls/_datePopup/RangeSelection';

/**
 * Component that allows you to select periods of multiple days.
 *
 * @class Controls/_datePopup/DateRange
 * @extends Core/Control
 * @control
 * @author Миронов А.Ю.
 *
 */

var _private = {
    updateView: function (self, options) {
        self._rangeModel.update(options);
        self._monthSelectionEnabled = options.selectionType === 'range' ||
            (options.selectionType === 'quantum' && quantumUtils.monthSelectionEnabled(options.quantum) &&
            options.quantum.months[0] === 1);
    }
};

var Component = BaseControl.extend([EventProxy], {
    _template: componentTmpl,

    _monthViewModel: MonthModel,

    _weekdaysCaptions: DateControlsUtils.getWeekdaysCaptions(),
    _formatDate: formatDate,

    _monthSelectionEnabled: true,
    _selectionProcessing: false,

    constructor: function () {
        Component.superclass.constructor.apply(this, arguments);
        this._rangeModel = new DateRangeModel();
        DateControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged']);
    },

    _beforeMount: function (options) {
        this._month = options.month || new Date();
        _private.updateView(this, options);
    },

    _beforeUpdate: function (options) {
        _private.updateView(this, options);
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