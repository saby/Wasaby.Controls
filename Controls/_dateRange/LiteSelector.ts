import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import ILinkView from './interfaces/ILinkView';
import IPeriodLiteDialog from './interfaces/IPeriodLiteDialog';
import DateRangeModel = require('Controls/Date/model/DateRange');
import CalendarControlsUtils = require('Controls/Calendar/Utils');
import componentTmpl = require('wml!Controls/_dateRange/LiteSelector/LiteSelector');
import 'css!theme?Controls/_dateRange/LiteSelector/LiteSelector';

/**
 * A link button that displays the period. Supports the change of periods to adjacent.
 *
 * @class Controls/_dateRange/LiteSelector
 * @extends Core/Control
 * @mixes Controls/_dateRange/interfaces/ILinkView
 * @mixes Controls/_dateRange/interfaces/IPeriodLiteDialog
 * @control
 * @public
 * @category Input
 * @author Миронов А.Ю.
 * @demo Controls-demo/Input/Date/RangeLinkLite
 *
 */

var Component = BaseControl.extend({
    _template: componentTmpl,

    _rangeModel: null,
    _isMinWidth: null,

    _beforeMount: function (options) {
        this._rangeModel = new DateRangeModel();
        CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged', 'rangeChanged']);
        this._rangeModel.update(options);

        // when adding control arrows, set the minimum width of the block,
        // so that the arrows are always fixed and not shifted.
        // https://online.sbis.ru/opendoc.html?guid=ae195d05-0e33-4532-a77a-7bd8c9783ef1
        if (options.showPrevArrow && options.showNextArrow) {
            return this._isMinWidth = true;
        }
    },

    _beforeUpdate: function (options) {
        this._rangeModel.update(options);
    },

    openDialog: function (event) {
        var className;

        if (!this._options.chooseMonths && !this._options.chooseQuarters && !this._options.chooseHalfyears) {
            className = 'controls-DateRangeLinkLite__picker-years-only';
        } else {
            className = 'controls-DateRangeLinkLite__picker-normal';
        }

        this._children.opener.open({
            opener: this,
            target: this._container,
            className: className,
            eventHandlers: {
                onResult: this._onResult.bind(this)
            },
            templateOptions: {
                startValue: this._rangeModel.startValue,
                endValue: this._rangeModel.endValue,

                chooseMonths: this._options.chooseMonths,
                chooseQuarters: this._options.chooseQuarters,
                chooseHalfyears: this._options.chooseHalfyears,
                chooseYears: this._options.chooseYears,

                emptyCaption: this._options.emptyCaption,

                itemTemplate: this._options.itemTemplate,
                captionFormatter: this._options.captionFormatter
            }
        });
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
    return coreMerge(coreMerge({}, IPeriodLiteDialog.getDefaultOptions()), ILinkView.getDefaultOptions());
};

Component.getOptionTypes = function () {
    return coreMerge(coreMerge({}, IPeriodLiteDialog.getOptionTypes()), ILinkView.getOptionTypes());
};

export default Component;
