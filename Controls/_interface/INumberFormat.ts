export interface INumberFormatOptions {
    howEmptyDecimals?: boolean;
    useGrouping?: boolean;
}

/**
 * @interface Controls/_interface/INumberFormat
 * @public
 * @author Журавлев М.С.
 */

export default interface INumberFormat {
    readonly '[Controls/_interface/INumberFormat]': boolean;
}

/**
 * @name Controls/_interface/INumberFormat#showEmptyDecimals
 * @cfg {Boolean} Determines whether to display empty the decimal part.
 * @default true
 * @remark
 * true -  Empty the decimal part is displayed.
 * false - Empty the decimal part is not displayed.
 */


/**
 * @name Controls/_interface/INumberFormat#useGrouping
 * @cfg {Boolean} Determines whether to use grouping separators, such as thousands separators.
 * @default true
 * @remark
 * true - the number is separated into grouping.
 * false - does not do anything.
 */

