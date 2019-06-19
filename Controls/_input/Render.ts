import {detection} from 'Env/Env';
import {descriptor} from 'Types/entity';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import {
   IHeight, IHeightOptions, IFontColorStyle,
   IFontColorStyleOptions, IFontSize, IFontSizeOptions
} from 'Controls/interface';

import * as notifyHandler from 'Controls/Utils/tmplNotify';
import * as template from 'wml!Controls/_input/Render/Render';

type State = 'valid' | 'valid-active' | 'invalid' | 'invalid-active' | 'readonly' | 'readonly-multiline';

interface IRenderOptions extends IControlOptions, IHeightOptions, IFontColorStyleOptions, IFontSizeOptions {
   multiline: boolean;
   roundBorder: boolean;

   validationStatus: 'valid' | 'invalid';

   content: TemplateFunction;
   beforeFieldWrapper?: TemplateFunction;
   afterFieldWrapper?: TemplateFunction;
}

/**
 * Control the rendering of text fields.
 *
 * @class Controls/_input/Render
 * @extends UI/_base/Control
 *
 * @mixes Controls/_interface/IHeight
 * @mixes Controls/_interface/IFontSize
 * @mixes Controls/_interface/IFontColorStyle
 *
 * @public
 *
 * @author Krasilnikov A.S.
 */
class Render extends Control<IRenderOptions, void> implements IHeight, IFontColorStyle, IFontSize {
   private contentActive: boolean = false;

   protected _state: string = null;
   protected _notifyHandler: notifyHandler;
   protected _template: TemplateFunction = template;
   protected _theme: string[] = ['Controls/input', 'Controls/Classes'];

   readonly '[Controls/_interface/IHeight]': true;
   readonly '[Controls/_interface/IFontSize]': true;
   readonly '[Controls/_interface/IFontColorStyle]': true;

   private updateState(options: IRenderOptions): void {
      this._state = `${options.state}${Render.calcState(this.contentActive, options)}`;
   }

   protected _beforeMount(options: IRenderOptions): void {
      this.updateState(options);
   }

   protected _beforeUpdate(options: IRenderOptions): void {
      this.updateState(options);
   }

   protected _setContentActive(newContentActive: boolean): void {
      this.contentActive = newContentActive;

      this.updateState(this._options);
   }

   protected _compatInlineHeight(): string {
      if (this._options.inlineHeight) {
         return this._options.inlineHeight;
      }

      return this._options.size;
   }
   protected _compatFontColorStyle(): string {
      if (this._options.fontColorStyle) {
         return this._options.fontColorStyle;
      }

      return this._options.fontStyle;
   }
   protected _compatFontSize(): string {
      if (this._options.fontSize) {
         return this._options.fontSize;
      }

      switch (this._options.fontStyle) {
         case 'default':
         default:
            return 'm';
         case 'primary':
         case 'secondary':
            return '3xl'
      }
   }

   private static calcState(contentActive: boolean, options: IRenderOptions): State {
      if (options.readOnly) {
         if (options.multiline) {
            return 'readonly-multiline';
         }

         return 'readonly';
      }

      /**
       * Only for ie and edge. Other browsers can work with :focus-within pseudo selector.
       */
      if (contentActive && detection.isIE) {
         return Render.compatValidationStatus(options) + '-active';
      }

      return Render.compatValidationStatus(options);
   }
   private static compatValidationStatus(options: IRenderOptions): string {
      if (options.validationStatus) {
         return options.validationStatus;
      }

      switch (options.style) {
         case 'invalid':
            return 'invalid';
         case 'info':
         default:
            return 'valid';
      }
   }

   static getDefaultTypes() {
      return {
         content: descriptor(Function).required(),
         afterFieldWrapper: descriptor(Function),
         beforeFieldWrapper: descriptor(Function),
         multiline: descriptor(Boolean).required(),
         roundBorder: descriptor(Boolean).required()
      };
   }

   static getDefaultOptions() {
      return {
         state: ''
      };
   }
}

export default Render;
