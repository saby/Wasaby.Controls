import {detection} from 'Env/Env';
import BaseControl = require('Core/Control');
import coreMerge = require('Core/core-merge');
import isEmpty = require('Core/helpers/Object/isEmpty');
import ILinkView from './interfaces/ILinkView';
import IInputSelectable from './interfaces/IInputSelectable';
import DateRangeModel from './DateRangeModel';
import CalendarControlsUtils from './Utils';
import componentTmpl = require('wml!Controls/_dateRange/Selector/Selector');

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
 * @author Миронов А.Ю.
 * @demo Controls-demo/Input/Date/RangeLink
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
        if ((options.prevArrowVisibility && options.prevArrowVisibility) || (options.showPrevArrow && options.showNextArrow)) {
            return this._isMinWidth = true;
        }
    },

    _beforeUpdate: function (options) {
        this._rangeModel.update(options);
    },

    _openDialog: function (event) {
        const ranges = this._options.ranges;
        let className = 'controls-DatePopup__selector-marginTop ';

        if (this._options.selectionType !== 'single' &&
            (!ranges || (isEmpty(ranges) ||
                (('months' in ranges || 'quarters' in ranges || 'halfyears' in ranges || 'years' in ranges) &&
                    ('days' in ranges || 'weeks' in ranges)))) &&
            (!this._options.minRange || this._options.minRange  === 'day')) {
            className += 'controls-DatePopup__selector-marginLeft';
        } else {
            className += 'controls-DatePopup__selector-marginLeft-withoutModeBtn';
        }
        const cfg = {
            opener: this,
            target: this._container,
            template: 'Controls/datePopup',
            className,
            horizontalAlign: {side: 'right'},
            targetPoint: {horizontal: 'left'},
            fittingMode: 'overflow',
            eventHandlers: {
                onResult: this._onResult.bind(this)
            },
            templateOptions: {
                startValue: this._rangeModel.startValue,
                endValue: this._rangeModel.endValue,
                headerType: 'link',
                captionFormatter: this._options.captionFormatter,
                closeButtonEnabled: true,
                selectionType: this._options.selectionType,
                quantum: this._options.ranges,
                minRange: this._options.minRange
            }
        };

        // TODO problems with ie in datePopup will be solved by the task
        //  https://online.sbis.ru/opendoc.html?guid=b2e54e78-8dae-4206-8647-559822d3d8e6
        if (!this._isVdomDialog()) {
            cfg.template = 'SBIS3.CONTROLS/Date/RangeBigChoose';
            cfg.isCompoundTemplate = true;
            cfg.templateOptions.handlers = { onChoose: this._onResultWS3.bind(this) };
            cfg.templateOptions.rangeselect = true;
            cfg.templateOptions.minQuantum = this._options.minRange;
            cfg.templateOptions.quantum = this._options.ranges;
        }
        this._children.opener.open(cfg);

    },

    _isVdomDialog: function() {
        return this._options.vdomDialog;
    },

    _onResultWS3: function (event, startValue, endValue) {
        this._onResult(startValue, endValue);
    },
    _onResult: function (startValue, endValue) {
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
    return coreMerge(coreMerge({
        minRange: 'day',
        vdomDialog: true
    }, IInputSelectable.getDefaultOptions()), ILinkView.getDefaultOptions());
};

Component.getOptionTypes = function () {
    return coreMerge(coreMerge({}, IInputSelectable.getOptionTypes()), ILinkView.getOptionTypes());
};
Component._theme = ['Controls/dateRange'];
export default Component;
