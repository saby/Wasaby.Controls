import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import {Date as WSDate} from 'Types/entity';
import ILinkView from './interfaces/ILinkView';
import IPeriodLiteDialog from './interfaces/IPeriodLiteDialog';
import DateRangeModel from './DateRangeModel';
import CalendarControlsUtils from './Utils';
import componentTmpl = require('wml!Controls/_dateRange/LiteSelector/LiteSelector');

/**
 * Кнопка-ссылка для отображения периода. Поддерживает смену периодов на смежные.
 *
 * @class Controls/_dateRange/LiteSelector
 * @extends Core/Control
 * @mixes Controls/_dateRange/interfaces/ILinkView
 * @mixes Controls/_dateRange/interfaces/IPeriodLiteDialog
 * @mixes Controls/_dateRange/interfaces/IInput
 * @control
 * @public
 * @category Input
 * @author Красильников А.С.
 * @demo Controls-demo/Input/Date/RangeLinkLite
 *
 */

/*
 * A link button that displays the period. Supports the change of periods to adjacent.
 *
 * @class Controls/_dateRange/LiteSelector
 * @extends Core/Control
 * @mixes Controls/_dateRange/interfaces/ILinkView
 * @mixes Controls/_dateRange/interfaces/IPeriodLiteDialog
 * @control
 * @public
 * @category Input
 * @author Красильников А.С.
 * @demo Controls-demo/Input/Date/RangeLinkLite
 *
 */

var Component = BaseControl.extend({
    _template: componentTmpl,

    _rangeModel: null,
    _isMinWidth: null,

    _beforeMount: function (options) {
        this._rangeModel = new DateRangeModel({ dateConstructor: options.dateConstructor });
        CalendarControlsUtils.proxyModelEvents(this, this._rangeModel, ['startValueChanged', 'endValueChanged', 'rangeChanged']);
        this._rangeModel.update(options);

        // when adding control arrows, set the minimum width of the block,
        // so that the arrows are always fixed and not shifted.
        // https://online.sbis.ru/opendoc.html?guid=ae195d05-0e33-4532-a77a-7bd8c9783ef1
        if ((options.prevArrowVisibility && options.prevArrowVisibility) || (options.showPrevArrow && options.showNextArrow)) {
            return this._isMinWidth = true;
        }
    },

    _beforeUpdate: function (options) {
        this._rangeModel.update(options);
    },

    openDialog: function (event) {
        var className;
        const container = this._children.linkView.getDialogTarget();
        if (!this._options.chooseMonths && !this._options.chooseQuarters && !this._options.chooseHalfyears) {
            className = 'controls-DateRangeSelectorLite__picker-years-only';
        } else {
            className = 'controls-DateRangeSelectorLite__picker-normal';
            if (this._options.prevArrowVisibility || this._options.prevArrowVisibility) {
                className += '-prevNext';
            }
        }

        this._children.opener.open({
            opener: this,
            target: container,
            className: className,
            fittingMode: 'overflow',
            templateOptions: {
                startValue: this._rangeModel.startValue,
                endValue: this._rangeModel.endValue,

                chooseMonths: this._options.chooseMonths,
                chooseQuarters: this._options.chooseQuarters,
                chooseHalfyears: this._options.chooseHalfyears,
                chooseYears: this._options.chooseYears,

                checkedStart: this._options.checkedStart,
                checkedEnd: this._options.checkedEnd,

                emptyCaption: this._options.emptyCaption,

                itemTemplate: this._options.itemTemplate,
                captionFormatter: this._options.captionFormatter,
                dateConstructor: this._options.dateConstructor
            }
        });
    },

    _onResult: function (event, startValue, endValue) {
        this._rangeModel.setRange(startValue, endValue);
        this._children.opener.close();
    },

    _rangeChangedHandler: function(event, startValue, endValue) {
        this._rangeModel.setRange(startValue, endValue);
    },

    _beforeUnmount: function () {
        this._rangeModel.destroy();
    }
});

Component.EMPTY_CAPTIONS = ILinkView.EMPTY_CAPTIONS;

Component.getDefaultOptions = function () {
    return {
        ...IPeriodLiteDialog.getDefaultOptions(),
        ...ILinkView.getDefaultOptions(),
        dateConstructor: WSDate
    };
};

Component.getOptionTypes = function () {
    return coreMerge(coreMerge({}, IPeriodLiteDialog.getOptionTypes()), ILinkView.getOptionTypes());
};
Component._theme = ['Controls/dateRange'];
export default Component;
