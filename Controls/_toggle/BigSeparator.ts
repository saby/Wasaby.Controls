import * as Control from 'Core/Control';
import {ICheckable, ICheckableOptions} from './interface/ICheckable';
import BigSeparatorTemplate = require('wml!Controls/_toggle/BigSeparator/BigSeparator');
import {descriptor as EntityDescriptor} from 'Types/entity';

// TODO https://online.sbis.ru/opendoc.html?guid=d602a67d-6d52-47a9-ac12-9c74bf5722e1
interface IControlOptions {
   readOnly?: boolean;
   theme?: string;
}
export interface IBigSeparatorOptions extends IControlOptions, ICheckableOptions {

}

/**
 * Limit separator, limit the number of entries to display. By clicking on it, you should show other entries.
 *
 * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
 *
 * @class Controls/_toggle/BigSeparator
 * @extends Core/Control
 * @control
 * @public
 * @author Михайловский Д.С.
 * @implements Controls/_toggle/interface/ICheckable
 *
 * @demo Controls-demo/Headers/BigSeparator/BigSeparatorDemo
 *
 * @mixes Controls/_toggle/BigSeparator/BigSeparatorStyles
 */

/**
 * @name Controls/_toggle/Separator#value
 * @cfg {Boolean} If value is true, that opening icon will be displaying, else closing icon will be displaying.
 */
class BigSeparator extends Control implements ICheckable {
   //TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
   protected _template: Function = BigSeparatorTemplate;
   protected _theme: string[] = ['Controls/toggle'];
   protected _options: IBigSeparatorOptions;
   protected _icon: string;

   private _iconChangedValue(value: boolean): void {
      if (value) {
         this._icon = 'icon-AccordionArrowUp ';
      } else {
         this._icon = 'icon-AccordionArrowDown ';
      }
   }

   protected _beforeMount(newOptions: IBigSeparatorOptions): void {
      this._iconChangedValue(newOptions.value);
   }

   protected _beforeUpdate(newOptions: IBigSeparatorOptions): void {
      this._iconChangedValue(newOptions.value);
   }

   protected _clickHandler(): void {
      this._notify('valueChanged', [!this._options.value]);
   }

   static getDefaultOptions(): object {
      return {
         value: false
      };
   }

   static getOptionTypes(): object {
      return {
         value: EntityDescriptor(Boolean)
      };
   }

   '[Controls/_toggle/interface/ICheckable]': true;
}

export default BigSeparator;
