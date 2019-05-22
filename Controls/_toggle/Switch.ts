import * as Control from 'Core/Control';
import { SyntheticEvent } from 'Core/vdom/Synchronizer/resources/SyntheticEvent';
import SwitchTemplate = require('wml!Controls/_toggle/Switch/Switch');
import {descriptor as EntityDescriptor} from 'Types/entity';
import {ICheckable, ICheckableOptions} from './interface/ICheckable';
import {ITooltip, ITooltipOptions} from 'Controls/interface';

// TODO https://online.sbis.ru/opendoc.html?guid=d602a67d-6d52-47a9-ac12-9c74bf5722e1
interface IControlOptions {
   readOnly?: boolean;
   theme?: string;
}
export interface ISwitchOptions extends IControlOptions, ICheckableOptions, ITooltipOptions {
   caption: string;
   captionPosition: string;
}
/**
 * Switch button with single caption. Frequently used for 'on-off' settings.
 *
 * <a href="/materials/demo-ws4-switchers">Demo-example</a>.
 *
 * @class Controls/_toggle/Switch
 * @extends Core/Control
 * @implements Controls/_toggle/interface/ICheckable
 * @implements Controls/_interface/ITooltip
 * @control
 * @public
 * @author Михайловский Д.С.
 * @category Toggle
 * @demo Controls-demo/Switch/SwitchDemo
 *
 * @mixes Controls/_toggle/Switch/SwitchStyles
 * @mixes Controls/_toggle/resources/SwitchCircle/SwitchCircleStyles
 */

/**
 * @name Controls/_toggle/Switch#caption
 * @cfg {String} Caption text.
 */

/**
 * @name Controls/_toggle/Switch#captionPosition
 * @cfg {String} Determines on which side of the button caption is located.
 * @variant left Caption before toggle.
 * @variant right Toggle before caption. It is default value.
 */

class Switch extends Control implements ITooltip, ICheckable {
   // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
   protected _template: Function = SwitchTemplate;
   protected _theme: string[] = ['Controls/toggle'];
   protected _options: ISwitchOptions;

   private _clickHandler(e: SyntheticEvent): void {
      if (!this._options.readOnly) {
         this._notify('valueChanged', [!this._options.value]);
      }
   }
   '[Controls/_interface/ITooltip]': true;
   '[Controls/_toggle/interface/ICheckable]': true;

   static getDefaultOptions(): object {
      return {
         value: false,
         captionPosition: 'right'
      };
   }
   static getOptionTypes(): object {
      return {
         value: EntityDescriptor(Boolean),
         caption: EntityDescriptor(String),
         captionPosition: EntityDescriptor(String).oneOf([
            'left',
            'right'
         ])
      };
   }
}

export default Switch;
