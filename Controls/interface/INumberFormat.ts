/**
 * @interface Controls/interface/INumberFormat
 * @public
 * @author Журавлев М.С.
 */
interface INumberFormat {
    readonly _options: {
        /**
         * @name Controls/interface/INumberFormat#showEmptyDecimals
         * @cfg {Boolean} Determines whether to display empty the decimal part.
         * @default true
         * @remark
         * true -  Empty the decimal part is displayed.
         * false - Empty the decimal part is not displayed.
         */


        /**
         * @name Controls/interface/INumberFormat#useGrouping
         * @cfg {Boolean} Determines whether to use grouping separators, such as thousands separators.
         * @default true
         * @remark
         * true - the number is separated into grouping.
         * false - does not do anything.
         */
        showEmptyDecimals: boolean;
        useGrouping: boolean;

    }
}

export default INumberFormat;
