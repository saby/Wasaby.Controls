import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import monthTmpl = require('wml!Controls/Date/Month/Month');
import IMonth = require('Controls/Date/interface/IMonth');
import MonthViewModel = require('Controls/Date/Month/Model');

/**
 * Календарь отображающий 1 месяц.
 * Предназначен для задания даты или диапазона дат в рамках одного месяца путём выбора периода с помощью мыши.
 *
 * @class Controls/Date/Month
 * @extends Core/Control
 * @mixes Controls/Date/interface/IMonth
 * @mixes Controls/Date/interface/IRangeSelectable
 * @mixes Controls/Date/interface/IDateRangeSelectable
 * @control
 * @public
 * @author Миронов А.Ю.
 * @demo Controls-demo/Date/Month
 *
 */

var Component = BaseControl.extend({
    _template: monthTmpl,
    _monthViewModel: MonthViewModel,

    // constructor: function() {
    //    this._dayFormatter = this._dayFormatter.bind(this);
    //    Component.superclass.constructor.apply(this, arguments);
    // },

    // _beforeMount: function(options) {
    //    this._view = options.view || 'Controls/Date/MonthView';
    // },

    _onRangeChangedHandler: function (event, startValue, endValue) {
        this._notify('startValueChanged', [startValue]);
        this._notify('endValueChanged', [endValue]);
    }

    // _startValueChangedHandler: function(event, value) {
    //    this._notify('startValueChanged', [value]);
    // },
    //
    // _endValueChangedHandler: function(event, value) {
    //    this._notify('endValueChanged', [value]);
    // }

});

Component.getDefaultOptions = function () {
    return coreMerge({}, IMonth.getDefaultOptions());
};

Component.getOptionTypes = function () {
    return coreMerge({}, IMonth.getOptionTypes());
};

export default Component;
