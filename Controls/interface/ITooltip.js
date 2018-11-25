define('Controls/interface/ITooltip', [
], function() {

   /**
    * Interface for the tooltip.
    *
    * @interface Controls/interface/ITooltip
    * @public
    * @author Красильников А.С.
    */

   /**
    * @name Controls/interface/ITooltip#tooltip
    * @cfg {String} Text of the tooltip shown when the control is hovered over.
    * @default Undefined
    * @remark "Title" attribute added to the control's root node and default browser tooltip is shown on hover.
    * @example
    * Tooltip is "Add".
    * <pre>
    *    <ControlsDirectory.Control tooltip=”Add”/>
    * </pre>
    */

});
