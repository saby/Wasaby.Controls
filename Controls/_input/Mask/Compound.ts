import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as template from 'wml!Controls/_input/Mask/Compound';
import {formattedValueToValue} from 'Controls/_input/Mask/FormatterValue';
import * as Mask from 'Controls/_input/Mask';
import * as tmplNotify from 'Controls/Utils/tmplNotify';

/**
 * Контрол обертка над полем ввода маски. Обеспечивает работу со значением с разделителями.
 *
 * @class Controls/_input/Mask/Compound
 * @extends UI/_base/Control
 * @private
 *
 * @author Красильников А.С.
 */
class Compound extends Control<IControlOptions> {
    private _notifyHandler = tmplNotify;

    protected _template: TemplateFunction = template;

    protected _beforeMount(options): void {
        this._value = formattedValueToValue(options.value, {
            mask: options.mask,
            replacer: options.replacer,
            formatMaskChars: options.formatMaskChars
        });
    }

    protected _beforeUpdate(newOptions): void {
        if (this._options.value !== newOptions.value ||
            this._options.mask !== newOptions.mask ||
            this._options.replacer !== newOptions.replacer
        ) {
            this._value = formattedValueToValue(newOptions.value, {
                mask: newOptions.mask,
                replacer: newOptions.replacer,
                formatMaskChars: newOptions.formatMaskChars
            });
        }
    }

    static getDefaultOptions = Mask.getDefaultOptions;
}

export default Compound;
