define('Controls/Input/interface/IOnlyPositive', [], function() {

   /**
    * @interface Controls/Input/interface/IOnlyPositive
    * @public
    * @author Журавлев М.С.
    */

   /**
    * @name Controls/Input/interface/IOnlyPositive#onlyPositive
    * @cfg {Boolean} Determines whether only positive numbers can be entered in the field.
    * @default false
    * @remark
    * true - only positive numbers can be entered in the field.
    * false - positive and negative numbers can be entered in the field.
    * @example
    * In this example you _inputValue in the control state will store only a positive number.
    * <pre>
    *    <Controls.Input.Number bind:value="_inputValue" onlyPositive="{{true}}"/>
    * </pre>
    */
});
