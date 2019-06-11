/**
 * @interface Controls/interface/IEmptyDecimals
 * @public
 * @author Журавлев М.С.
 */
interface IEmptyDecimals {
    readonly _options: {
        /**
         * @name Controls/interface/IEmptyDecimals#showEmptyDecimals
         * @cfg {Boolean} Determines whether to display empty the decimal part.
         * @default true
         * @remark
         * true -  Empty the decimal part is displayed.
         * false - Empty the decimal part is not displayed.
         */
        showEmptyDecimals: boolean;
    }
}

export default IEmptyDecimals;
