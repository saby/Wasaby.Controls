export interface INumberFormatOptions {
    howEmptyDecimals?: boolean;
    useGrouping?: boolean;
}

/**
 * Интерфейс для контролов, которые поддерживают настройку числового формата.
 * @interface Controls/_interface/INumberFormat
 * @public
 * @author Журавлев М.С.
 */

export default interface INumberFormat {
    readonly '[Controls/_interface/INumberFormat]': boolean;
}

/**
 * @name Controls/_interface/INumberFormat#showEmptyDecimals
 * @cfg {Boolean} Определяет, отображать ли нули в конце десятичной части.
 * @default true
 * @remark
 * true -  Отображать нули в десятичной части. 
 * false - Не отображать нули в десятичной части.
 */

/*
 * @name Controls/_interface/INumberFormat#showEmptyDecimals
 * @cfg {Boolean} Determines whether to display empty the decimal part.
 * @default true
 * @remark
 * true -  Empty the decimal part is displayed.
 * false - Empty the decimal part is not displayed.
 */

/**
 * @name Controls/_interface/INumberFormat#useGrouping
 * @cfg {Boolean} Определяет, следует ли использовать разделители группы.
 * @default true
 * @remark
 * true - число разделено на группы.
 * false - разделения не происходит.
 */

/*
 * @name Controls/_interface/INumberFormat#useGrouping
 * @cfg {Boolean} Determines whether to use grouping separators, such as thousands separators.
 * @default true
 * @remark
 * true - the number is separated into grouping.
 * false - does not do anything.
 */

