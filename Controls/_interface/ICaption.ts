export interface ICaptionOptions {
   caption?: string | Function;
}

/**
 * Caption text.
 *
 * @interface Controls/_interface/ICaption
 * @public
 * @author Михайловский Д.С.
 */

/**
 * @name Controls/_interface/ICaption#caption
 * @cfg {String} Control caption text.
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
export default interface ICaption {
   readonly '[Controls/_interface/ICaption]': boolean;
}
