import Base = require('Controls/_input/Base');

import {descriptor, TimeInterval} from 'Types/entity';
import {IOptions as IModelOptions, ViewModel} from 'Controls/_input/TimeInterval/ViewModel';

type IOptions = IModelOptions;

/**
 * Поле ввода временного интервала.
 * @remark
 * Позволяет вводить время с точностью от суток до секунд.
 * <a href="/materials/demo-ws4-input">Демо-пример</a>.
 *
 * @class Controls/_input/TimeInterval
 * @extends Controls/_input/Base
 *
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/ITimeInterval
 *
 * @public
 * @demo Controls-demo/Input/SizesAndHeights/Index
 * @demo Controls-demo/Input/FontStyles/Index
 * @demo Controls-demo/Input/TextAlignments/Index
 * @demo Controls-demo/Input/TagStyles/Index
 * @demo Controls-demo/Input/ValidationStatuses/Index
 *
 * @author Красильников А.С.
 */

/*
 * Controls that allows user to enter some amount of time with the accuracy from day to seconds.
 * <a href="/materials/demo-ws4-input">Demo examples.</a>.
 * @remark
 * If container with width: auto, then the width is determined based on the content.
 *
 * @class Controls/_input/TimeInterval
 * @extends Controls/_input/Base
 *
 * @mixes Controls/interface/IInputBase
 * @mixes Controls/interface/ITimeInterval
 *
 * @public
 * @demo Controls-demo/Input/TimeInterval/TimeIntervalPG
 *
 * @author Красильников А.С.
 */

class TimeInterval extends Base {
    protected _autoWidth: boolean = true;

    protected _defaultValue: TimeInterval | null = null;

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

        return defaultOptions;
    }

    static getOptionTypes(): object {
        const optionTypes = Base.getOptionTypes();

        optionTypes.value = descriptor(Object, null);
        optionTypes.mask = descriptor(String).oneOf([
            'HH:MM',
            'HHH:MM',
            'HHHH:MM',
            'HH:MM:SS',
            'HHH:MM:SS',
            'HHHH:MM:SS'
        ]).required();

        return optionTypes;
    }
}

export default TimeInterval;
