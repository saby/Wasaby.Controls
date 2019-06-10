import {IoC} from 'Env/Env';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {descriptor as EntityDescriptor} from 'Types/entity';
import {ICaption, ICaptionOptions} from 'Controls/interface';
import LabelTemplate = require('wml!Controls/_input/Label/Label');

// TODO https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
interface IJqueryElement {
   get(): HTMLElement;
}

export interface ILabelOptions extends IControlOptions, ICaptionOptions {
   required?: boolean;
   underline?: string | null;
   href?: string;
}

/**
 * Represents the text label for a control.
 *
 * @class Controls/_input/Label
 * @extends Core/Control
 *
 * @mixes Controls/_interface/ICaption
 *
 * @public
 * @demo Controls-demo/Label/Label
 *
 * @author Михайловский Д.С.
 */

/**
 * @name Controls/_input/Label#required
 * @cfg {Boolean} Determines whether the label can be displayed as required.
 */

/**
 * @name Controls/_input/Label#underline
 * @cfg {String} Display underline style of the label.
 * @variant hovered
 * @variant fixed
 * @variant none
 */

/**
 * @name Controls/_input/Label#href
 * @cfg {String} Contains a URL or a URL fragment that the hyperlink points to.
 */
class Label extends Control<ILabelOptions> implements ICaption {
   protected _template: TemplateFunction = LabelTemplate;
   protected _theme: string[] = ['Controls/input'];
   readonly '[Controls/_interface/ICaption]': true;

   private _warn(labelContainer: HTMLElement, className: string, optionValue: string): void {
      if (labelContainer.classList.contains(className)) {
         IoC.resolve('ILogger').warn('Controls/Label',
            'Модификатор ' + className + ' не поддерживается. Используйте опцию underline со значением ' + optionValue);
      }
   }
   protected _afterMount(): void {
      let container: HTMLElement;
      container = this._container;

      // TODO https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
      if (container.get) {
         container = container.get(0);
      }

      this._warn(container, 'controls-Label_underline-hovered', 'hovered');
      this._warn(container, 'controls-Label_underline_color-hovered', 'fixed');
   }
   static getDefaultOptions(): object {
      return {
         underline: 'none'
      };
   }

   static getOptionTypes(): object {
      return {
         href: EntityDescriptor(String),
         caption: EntityDescriptor(String).required(),
         underline: EntityDescriptor(String).oneOf([
            'none',
            'fixed',
            'hovered'
         ]),
         required: EntityDescriptor(Boolean)
      };
   }
}

export default Label;
