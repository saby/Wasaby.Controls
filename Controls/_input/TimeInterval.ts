import Base = require('Controls/_input/Base');

import {descriptor} from 'Types/entity';
import {IOptions as IModelOptions, ViewModel} from 'Controls/_input/TimeInterval/ViewModel';

/**
 * Controls that allows user to enter some amount of time with the accuracy from day to seconds.
 * <a href="/materials/demo-ws4-input-timeinterval">Demo examples.</a>.
 *
 * @class Controls/_input/TimeInterval
 * @extends Controls/_input/Base
 *
 * @mixes Controls/_input/interface/IInputBase
 * @mixes Controls/_input/interface/ITimeInterval
 *
 * @public
 * @demo Controls-demo/Input/TimeInterval/TimeIntervalPG
 *
 * @author Миронов А.Ю.
 */

type IOptions = IModelOptions;

class TimeInterval extends Base {
    protected _getViewModelOptions(options: IOptions): IModelOptions {
        return {
            mask: options.mask
        };
    }

    protected _getViewModelConstructor() {
        return ViewModel;
    }

    protected _changeHandler() {
        if (this._viewModel.autoComplete()) {
            this._notifyValueChanged();
        }

        super._changeHandler();
    }

    static getDefaultOptions(): object {
        const defaultOptions = Base.getDefaultOptions();

        defaultOptions.value = null;

        return defaultOptions;
    }

    static getOptionTypes(): object {
        const optionTypes = Base.getOptionTypes();

        /**
         * TODO: Uncomment after execution.
         * https://online.sbis.ru/opendoc.html?guid=8b36a045-d4f7-4d73-9d92-de4f190a65da
         * optionTypes.value = descriptor(Object, null);
         */

        return optionTypes;
    }
}

export default TimeInterval;
