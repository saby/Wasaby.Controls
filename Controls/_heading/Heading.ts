import{Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_heading/Heading/Heading');
import {descriptor as EntityDescriptor} from 'Types/entity';
import {ITooltip, ITooltipOptions, ICaption, ICaptionOptions} from 'Controls/interface';
import {ICheckable} from "../_toggle/interface/ICheckable";

export interface IHeadingOptions extends IControlOptions, ICaptionOptions, ITooltipOptions {
   fontSize?: string;
   fontColorStyle?: string;
   size?: string;
   style?: string;
}

   /**
    * Heading with support different display styles and sizes. Can be used independently or as part of complex headings(you can see it in <a href="/materials/demo-ws4-header-separator">Demo-example</a>) consisting of a <a href="/docs/js/Controls/_heading/Counter/?v=3.18.500">counter</a>, a <a href="/docs/js/Controls/_heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    *
    * @class Controls/_heading/Heading
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    * @demo Controls-demo/Headers/headerDemo
    *
    * @mixes Controls/_interface/ITooltip
    * @mixes Controls/_interface/ICaption
    * @mixes Controls/_heading/Heading/HeadingStyles
    */

   /**
    * @name Controls/_heading/Heading#size
    * @cfg {String} Heading size.
    * @variant s Small text size.
    * @variant m Medium text size.
    * @variant l Large text size.
    * @variant xl Extralarge text size.
    * @default m
    */

/**
 * @name Controls/_heading/Heading#fontSize
 * @cfg {String} Heading font-size.
 * @variant xs Extra small text size.
 * @variant s Small text size.
 * @variant m Medium text size.
 * @variant l Large text size.
 * @variant xl Extra large text size.
 * @variant 2xl 2*Extra large text size.
 * @variant 3xl 3*Extra large text size.
 * @variant 4xl 4*Extra large text size.
 * @variant 5xl 5*Extra large text size.
 * @default m
 */


   /**
    * @name Controls/_heading/Heading#style
    * @cfg {String} Heading display style.
    * @variant primary
    * @variant secondary
    * @variant info
    * @default primary
    */

   class Header extends Control<IHeadingOptions> implements ITooltip, ICaption {
      protected _template: TemplateFunction = template;
      protected _theme: string[] = ['Controls/heading'];

      static getDefaultOptions(): object {
         return {
            style: 'secondary',
            size: 'm',
            theme: 'default'
         };
      }
      static getOptionTypes(): object {
         return {
            caption: EntityDescriptor(String),
            style: EntityDescriptor(String).oneOf([
               'secondary',
               'primary',
               'info'
            ]),
            size: EntityDescriptor(String).oneOf([
               'xl',
               'l',
               'm',
               's'
            ])
         };
      }
   }

export default Header;
