/**
 * Интерфейс для контролов, которые поддерживают настройку числового формата.
 * @interface Controls/_interface/INumberFormat
 * @public
 * @author Красильников А.С.
 */
export interface INumberFormatOptions {
    /**
     * Определяет, следует ли использовать разделители группы.
     * @remark
     * true - число разделено на группы.
     * false - разделения не происходит.
     */
    useGrouping?: boolean;
    /**
     * Определяет, отображать ли нули в конце десятичной части.
     * @remark
     * true -  Отображать нули в десятичной части.
     * false - Не отображать нули в десятичной части.
     */
    showEmptyDecimals?: boolean;
}

interface INumberFormat {
    readonly '[Controls/_interface/INumberFormat]': boolean;
}

export default INumberFormat;
