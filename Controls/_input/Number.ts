import {Logger} from 'UI/Utils';
import Base = require('Controls/_input/Base');
import entity = require('Types/entity');
import ViewModel = require('Controls/_input/Number/ViewModel');


/**
 * Поле ввода числовых значений.
 * <a href="/materials/demo-ws4-input">Демо-пример</a>.
 *
 * @class Controls/_input/Number
 * @extends Controls/_input/Base
 *
 * @mixes Controls/interface/IOnlyPositive
 * @mixes Controls/interface/IInputNumber
 * @mixes Controls/_interface/INumberFormat
 *
 * @public
 * @demo Controls-demo/Input/SizesAndHeights/Index
 * @demo Controls-demo/Input/FontStyles/Index
 * @demo Controls-demo/Input/TextAlignments/Index
 * @demo Controls-demo/Input/TagStyles/Index
 * @demo Controls-demo/Input/ValidationStatuses/Index
 * @demo Controls-demo/Input/SelectOnClick/Index
 *
 * @author Красильников А.С.
 */

/*
 * Controls that allows user to enter single-line number.
 * <a href="/materials/demo-ws4-input">Demo example.</a>.
 *
 * @class Controls/_input/Number
 * @extends Controls/_input/Base
 *
 * @mixes Controls/interface/IOnlyPositive
 * @mixes Controls/interface/IInputNumber
 * @mixes Controls/_interface/INumberFormat
 * @mixes Controls/_input/interface/INumberLength
 *
 * @public
 * @demo Controls-demo/Input/Number/NumberPG
 *
 * @author Красильников А.С.
 */

var _private = {
    validateOptions: function (options) {
        if (options.integersLength <= 0) {
            Logger.error('Number: Incorrect integers length: ' + options.integersLength + '. Integers length must be greater than 0.');
        }
    },
    convertToNumber: function (value) {
        return value === null ? void 0 : value;
    }
};

var NumberInput = Base.extend({
    _defaultValue: 0,
    _getViewModelOptions: function (options) {
        _private.validateOptions(options);

        return {
            precision: _private.convertToNumber(options.precision),
            useGrouping: options.useGrouping,
            onlyPositive: options.onlyPositive,
            integersLength: _private.convertToNumber(options.integersLength),
            showEmptyDecimals: options.showEmptyDecimals,
            useAdditionToMaxPrecision: options.showEmptyDecimals
        };
    },

    _getViewModelConstructor: function () {
        return ViewModel;
    },

    _changeHandler: function () {
        if (this._viewModel.trimTrailingZeros(true)) {
            this._notifyValueChanged();
        }

        NumberInput.superclass._changeHandler.apply(this, arguments);
    },

    _focusOutHandler: function () {
        if (this._viewModel.trimTrailingZeros(false)) {
            this._notifyValueChanged();
        }

        NumberInput.superclass._focusOutHandler.apply(this, arguments);
    }
});

NumberInput.getDefaultOptions = function () {
    var defaultOptions = Base.getDefaultOptions();

    defaultOptions.useGrouping = true;
    defaultOptions.onlyPositive = false;
    defaultOptions.showEmptyDecimals = false;

    return defaultOptions;
};

NumberInput.getOptionTypes = function () {
    const optionTypes = Base.getOptionTypes();

    optionTypes.value = entity.descriptor(Number, String, null);
    optionTypes.precision = entity.descriptor(Number, null);
    optionTypes.integersLength = entity.descriptor(Number, null);
    optionTypes.useGrouping = entity.descriptor(Boolean);
    optionTypes.onlyPositive = entity.descriptor(Boolean);
    optionTypes.showEmptyDecimals = entity.descriptor(Boolean);

    return optionTypes;
};

export = NumberInput;

