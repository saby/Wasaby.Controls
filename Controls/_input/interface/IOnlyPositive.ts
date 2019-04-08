/**
 * @interface Controls/_input/interface/IOnlyPositive
 * @public
 * @author Журавлев М.С.
 */

/**
 * @name Controls/_input/interface/IOnlyPositive#onlyPositive
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
