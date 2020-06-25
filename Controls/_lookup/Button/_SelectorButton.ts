// @ts-ignore
import template = require('wml!Controls/_lookup/Button/_SelectorButton');
// @ts-ignore
import itemTemplate = require('wml!Controls/_lookup/Button/itemTemplate');
// @ts-ignore
import rk = require('i18n!Controls');
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {List} from 'Types/collection';
import {IValidationStatus, IValidationStatusOptions} from 'Controls/interface';
import {SyntheticEvent} from 'Vdom/Vdom';
import { Model } from 'Types/entity';

export interface ISelectorButtonOptions extends IControlOptions, IValidationStatusOptions {
   multiSelect?: boolean;
   fontColorStyle: string;
   buttonStyle: string;
   maxVisibleItems: number;
   itemTemplate: TemplateFunction;
   showSelectorCaption: string;
}

export default class SelectorButton extends Control<ISelectorButtonOptions> implements IValidationStatus {
   '[Controls/_interface/IValidationStatus]': true;

   protected _template: TemplateFunction = template;

   // @ts-ignore
   private _open(): void {
      this._notify('showSelector');
   };

   // @ts-ignore
   private _reset(): void {
      this._notify('updateItems', [new List()]);
   };

   protected _crossClick(event: SyntheticEvent<Event>, item: Model): void {
      this._notify('removeItem', [item]);
   };

   protected _itemClickHandler(event: SyntheticEvent<Event>, item: Model): void {
      this._notify('itemClick', [item]);

      if (!this._options.readOnly && !this._options.multiSelect) {
         this._open();
      }
   };

   protected _openInfoBox(event: SyntheticEvent<Event>, config: Object): void {
      // @ts-ignore
      config.width = this._container.offsetWidth;
   }

   static _theme: string[] = ['Controls/lookup'];

   static getDefaultOptions = (): ISelectorButtonOptions => {
      return {
         fontColorStyle: 'link',
         buttonStyle: 'secondary',
         maxVisibleItems: 7,
         itemTemplate: itemTemplate,
         showSelectorCaption: `+${rk('еще')}`,
         validationStatus: 'valid'
      };
   };
}
