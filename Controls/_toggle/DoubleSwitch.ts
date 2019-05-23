import * as Control from 'Core/Control';
import { SyntheticEvent } from 'Core/vdom/Synchronizer/resources/SyntheticEvent';
import DoubleSwitchTemplate = require('wml!Controls/_toggle/DoubleSwitch/DoubleSwitch');
import toggleTemplate = require('wml!Controls/_toggle/DoubleSwitch/resources/DoubleSwitchToggle');
import textTemplate = require('wml!Controls/_toggle/DoubleSwitch/resources/DoubleSwitchText');
import {descriptor as EntityDescriptor} from 'Types/entity';
import {ICheckable, ICheckableOptions} from './interface/ICheckable';
import {ITooltip, ITooltipOptions} from 'Controls/interface';
import {ICheckboxOptions} from "./Checkbox";

// TODO https://online.sbis.ru/opendoc.html?guid=d602a67d-6d52-47a9-ac12-9c74bf5722e1
interface IControlOptions {
   readOnly?: boolean;
   theme?: string;
}
export interface IDoubleSwitchOptions extends IControlOptions, ICheckableOptions, ITooltipOptions {
   captions?: string[];
   orientation?: string;
}
/**
 * Switch with two captions and with support two orientation.
 *
 * <a href="/materials/demo-ws4-switchers">Demo-example</a>.
 *
 * @class Controls/_toggle/DoubleSwitch
 * @extends Core/Control
 * @implements Controls/_toggle/interface/ICheckable
 * @implements Controls/_interface/ITooltip
 * @control
 * @public
 * @author Михайловский Д.С.
 * @category Toggle
 *
 * @demo Controls-demo/Switch/DoubleSwitchDemo
 *
 * @mixes Controls/_toggle/resources/Switch/SwitchStyles
 * @mixes Controls/_toggle/resources/DoubleSwitch/DoubleSwitchStyles
 * @mixes Controls/_toggle/resources/SwitchCircle/SwitchCircleStyles
 *
 * @css @line-height_DoubleSwitch_vertical Line-height of vertical double switcher. It's align vertical switch toggle.
 */

/**
 * @name Controls/_toggle/DoubleSwitch#captions
 * @cfg {Array.<String>} Array of two captions. If caption number is not equal to two, then an error occurs.
 */

/**
 * @name Controls/_toggle/DoubleSwitch#orientation
 * @cfg {String} Double switch orientation in space.
 * @variant horizontal Horizontal orientation. It is default value.
 * @variant vertical Vertical orientation.
 */
const CAPTIONS_LENGTH = 2;
class DoubleSwitch extends Control implements ICheckable, ITooltip {

   // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
   protected _template: Function = DoubleSwitchTemplate;
   protected _theme: string[] = ['Controls/toggle'];
   protected _options: IDoubleSwitchOptions;

   protected _toggleTemplate: Function = toggleTemplate;
   protected _textTemplate: Function = textTemplate;
   protected _toggleHoverState: boolean = false;
   private _checkCaptions(captions: string[]): void {
      if (captions.length !== CAPTIONS_LENGTH) {
         throw new Error('You must set 2 captions.');
      }
   }

   private _toggleSwitchHoverState(e: SyntheticEvent, toggledState?: boolean): void {
      this._toggleHoverState = !!toggledState
   }

   private _clickTextHandler(e: SyntheticEvent, _nextValue: boolean): void {
      if (this._options.value !== _nextValue && !this._options.readOnly) {
         this._notifyChanged();
         this._toggleSwitchHoverState(false);
      }
   }

   private _notifyChanged(): void {
      this._notify('valueChanged', [!this._options.value]);
   }

   private _clickToggleHandler(): void {
      if (!this._options.readOnly) {
         this._notifyChanged();
      }
   }

   protected _beforeMount(newOptions: IDoubleSwitchOptions): void {
      this._checkCaptions(newOptions.captions);
   }

   protected _beforeUpdate(newOptions: IDoubleSwitchOptions): void {
      this._checkCaptions(newOptions.captions);
   }

   static getDefaultOptions(): object {
      return {
         value: false
      };
   }
   static getOptionTypes(): object {
      return {
         value: EntityDescriptor(Boolean),
         orientation: EntityDescriptor(String).oneOf([
            'vertical',
            'horizontal'
         ]),

         // TODO: сделать проверку на массив когда будет сделана задача
         // https://online.sbis.ru/opendoc.html?guid=2016ea16-ed0d-4413-82e5-47c3aeaeac59
         captions: EntityDescriptor(Object)
      };
   }
   '[Controls/_interface/ITooltip]': true;
   '[Controls/_toggle/interface/ICheckable]': true;
}

export default DoubleSwitch;
