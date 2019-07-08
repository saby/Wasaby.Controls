import {IoC} from 'Env/Env';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {descriptor as EntityDescriptor} from 'Types/entity';
import {ICaption, ICaptionOptions} from 'Controls/interface';
import * as LabelTemplate from 'wml!Controls/_input/Label/Label';

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
 * @author Красильников А.С.
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

   readonly '[Controls/_interface/ICaption]': true;

   static _theme: string[] = ['Controls/input'];

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
