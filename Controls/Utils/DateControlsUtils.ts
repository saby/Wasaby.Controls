import {isValidDateRange} from 'Controls/validate';

export function getRangeValueValidators(validators?: Function[] | object[], rangeModel, value): Function[] {
    return [
        isValidDateRange.bind(null, {
            startValue: rangeModel.startValue,
            endValue: rangeModel.endValue
        }),
        ...validators.map((validator) => {
            let
                _validator: Function,
               args: object;
            if (typeof validator === 'function') {
               _validator = validator
            } else {
               _validator = validator.validator;
               args = validator.arguments;
            }
            return _validator.bind(null, {
               ...(args || {}),
               value: value
            });
        })
    ];
}

export const dateMaskConstants = {
    DD_MM_YYYY: 'DD.MM.YYYY',
    DD_MM_YY: 'DD.MM.YY',
    MM_YYYY: 'MM.YYYY'
};
