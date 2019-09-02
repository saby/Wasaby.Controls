/**
 * @interface Controls/interface/IOnlyPositive
 * @public
 * @author Красильников А.С.
 */
interface IOnlyPositive {
    readonly _options: {
        /**
         * @name Controls/interface/IOnlyPositive#onlyPositive
         * @cfg {Boolean} Определяет, можно ли вводить в поле только положительные числа.
         * @default false
         * @remark
         * true - в поле можно вводить только положительные числа.
         * false - в поле можно вводить положительные и отрицательные числа.
         * @example
         * В этом примере _inputValue в состоянии контрола будет хранить только положительные числа.
         * <pre>
         *    <Controls.input:Number bind:value="_inputValue" onlyPositive="{{true}}"/>
         * </pre>
         */

        /*
         * @name Controls/interface/IOnlyPositive#onlyPositive
         * @cfg {Boolean} Determines whether only positive numbers can be entered in the field.
         * @default false
         * @remark
         * true - only positive numbers can be entered in the field.
         * false - positive and negative numbers can be entered in the field.
         * @example
         * In this example you _inputValue in the control state will store only a positive number.
         * <pre>
         *    <Controls.input:Number bind:value="_inputValue" onlyPositive="{{true}}"/>
         * </pre>
         */         
        onlyPositive: boolean;
    }
}

export default IOnlyPositive;
