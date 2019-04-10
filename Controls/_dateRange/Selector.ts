import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import ILinkView from './interfaces/ILinkView';
import IInputSelectable from './interfaces/IInputSelectable';
import DateRangeModel = require('Controls/Date/model/DateRange');
import CalendarControlsUtils = require('Controls/Calendar/Utils');
import componentTmpl = require('wml!Controls/_dateRange/Selector/Selector');
import 'css!theme?Controls/_dateRange/Selector/Selector';

/**
 * Controls that allows user to select date with start and end values in calendar.
 *
 * @class Controls/_dateRange/Selector
 * @extends Core/Control
 * @mixes Controls/_dateRange/interfaces/ILinkView
 * @mixes Controls/_dateRange/interfaces/ISelector
 * @control
 * @public
 * @category Input
 * @author Водолазских А.А.
 * @demo Controls-demo/Input/Date/RangeLink
 *
 */

var Component = BaseControl.extend({
    _template: componentTmpl,

    _rangeModel: null,

    _beforeMount: function (options) {
        this._rangeModel = new DateRangeModel();
        CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged', 'rangeChanged']);
        this._rangeModel.update(options);
    },

    _beforeUpdate: function (options) {
        this._rangeModel.update(options);
    },


    _openDialog: function (event) {
        this._children.opener.open({
            opener: this,
            target: this._container,
            className: 'controls-PeriodDialog__picker',
            isCompoundTemplate: true,
            horizontalAlign: {side: 'right'},
            corner: {horizontal: 'left'},
            eventHandlers: {
                onResult: this._onResult.bind(this)
            },
            templateOptions: {
                startValue: this._rangeModel.startValue,
                endValue: this._rangeModel.endValue,
                headerType: 'link',
                closeButtonEnabled: true,
                quantum: this._options.ranges,
                minQuantum: this._options.minRange,
                rangeselect: true,
                handlers: {
                    onChoose: this._onResultWS3.bind(this)
                }
            }
        });
    },
    _onResultWS3: function (event, startValue, endValue) {
        this._onResult(startValue, endValue);
    },
    _onResult: function (startValue, endValue) {
        this._rangeModel.setRange(startValue, endValue);
        this._children.opener.close();
        this._forceUpdate();
    },
    _beforeUnmount: function () {
        this._rangeModel.destroy();
    }
});

Component.EMPTY_CAPTIONS = ILinkView.EMPTY_CAPTIONS;

Component.getDefaultOptions = function () {
    return coreMerge(coreMerge({}, IInputSelectable.getDefaultOptions()), ILinkView.getDefaultOptions());
};

Component.getOptionTypes = function () {
    return coreMerge(coreMerge({}, IInputSelectable.getOptionTypes()), ILinkView.getOptionTypes());
};

export default Component;
