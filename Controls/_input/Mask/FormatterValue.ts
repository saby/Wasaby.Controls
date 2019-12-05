import * as Formatter from 'Controls/_input/Mask/Formatter';
import * as FormatBuilder from 'Controls/_input/Mask/FormatBuilder';

export interface IOptions {
    mask: string;
    replacer: string;
    formatMaskChars: object;
}
export function formattedValueToValue(formattedValue, options: IOptions) {
    const format = FormatBuilder.getFormat(options.mask, options.formatMaskChars, options.replacer);

    if (formattedValue.match(format.searchingGroups)) {
        return Formatter.getClearData(format, formattedValue).value;
    }

    return formattedValue;
}
