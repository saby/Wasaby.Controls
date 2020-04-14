import {Logger} from 'UI/Utils';

import * as Formatter from 'Controls/_input/Mask/Formatter';
import * as FormatBuilder from 'Controls/_input/Mask/FormatBuilder';

export interface IOptions {
    mask: string;
    replacer: string;
    formatMaskChars: object;
}

export function formattedValueToValue(formattedValue, options: IOptions): string {
    const format = FormatBuilder.getFormat(options.mask, options.formatMaskChars, options.replacer);

    if (formattedValue.match(format.searchingGroups)) {
        return Formatter.getClearData(format, formattedValue).value;
    }

    Logger.error('Некорректные данные. Проверьте значение на соответствие маске.');
    if (options.replacer === '') {
        return '';
    } else {
        const keys = Object.keys(options.formatMaskChars).join('');
        return options.mask.replace(new RegExp(`[${keys}]`, 'g'), options.replacer);
    }
}
