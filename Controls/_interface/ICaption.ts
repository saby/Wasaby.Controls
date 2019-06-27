import {TemplateFunction} from 'UI/Base';
export interface ICaptionOptions {
   caption?: string | TemplateFunction;
}

/**
 * Текст заголовка.
 *
 * @interface Controls/_interface/ICaption
 * @public
 * @author Михайловский Д.С.
 */

/*
 * Caption text.
 *
 * @interface Controls/_interface/ICaption
 * @public
 * @author Михайловский Д.С.
 */
export default interface ICaption {
   readonly '[Controls/_interface/ICaption]': boolean;
}
/**
 * @name Controls/_interface/ICaption#caption
 * @cfg {String} Определяет текст заголовка контрола.
 * @remark Вы можете передать разметку в заголовок.
 * @example
 * Контрол с заголовком 'Dialog'.
 * <pre>
 *    <ControlsDirectory.Control caption="Dialog"/>
 * </pre>
 * Контрол имеет заголовок с разметкой.
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

/*
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
