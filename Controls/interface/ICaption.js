define('Controls/interface/ICaption', [
], function() {

   /**
    * Caption text.
    *
    * @interface Controls/interface/ICaption
    * @public
    * @author Михайловский Д.С.
    */

   /**
    * @name Controls/interface/ICaption#caption
    * @cfg {String} Control caption text.
    * @default Undefined
    * @remark You can submit the markup to the caption.
    * @example
    * Control has caption 'Dialog'.
    * <pre>
    *    <ControlsDirectory.Control caption="Dialog"/>
    * </pre>
    * Control has markup caption.
    * <pre>
    *    <ControlsDirectory.Control caption="captionTemplate"/>
    * </pre>
    * captionTemplate
    * <pre>
    *    <span class='customDialog'>
    *       Dialog
    *    </span>
    * </pre>
    */

});
