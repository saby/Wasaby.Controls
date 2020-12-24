import {TemplateFunction} from 'UI/Base';

/**
 * Интерфейс опций контролов, которые поддерживают заголовок.
 *
 * @public
 * @author Красильников А.С.
 */
export interface ICaptionOptions {
   /**
    * Определяет текст заголовка контрола.
    * @example
    * <pre class="brush: html">
    *    <Controls.buttons:Button caption="Hello Wasaby"/>
    * </pre>
    */
   caption?: string | TemplateFunction;
}

/**
 * Интерфейс для контролов, которые поддерживают заголовок.
 *
 * @public
 * @author Красильников А.С.
 */
export default interface ICaption {
   readonly '[Controls/_interface/ICaption]': boolean;
}

/*
 * Caption text.
 *
 * @public
 * @author Красильников А.С.
 */

/*
 * @name Controls/_interface/ICaption#caption
 * @cfg {String} Control caption text.
 * @example
 * Control has caption 'Dialog'.
 * <pre>
 *    <ControlsDirectory.Control caption="Dialog"/>
 * </pre>
 */
