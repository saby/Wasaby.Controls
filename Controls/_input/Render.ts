import {detection} from 'Env/Env';
import {descriptor} from 'Types/entity';
import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import * as ActualAPI from 'Controls/_input/ActualAPI';
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

   protected _state: string;
   protected _fontSize: string;
   protected _inlineHeight: string;
   protected _fontColorStyle: string;
   protected _validationStatus: string;
   protected _notifyHandler: notifyHandler;
   protected _template: TemplateFunction = template;
   protected _theme: string[] = ['Controls/input', 'Controls/Classes'];

   readonly '[Controls/_interface/IHeight]': true;
   readonly '[Controls/_interface/IFontSize]': true;
   readonly '[Controls/_interface/IFontColorStyle]': true;

   private updateState(options: IRenderOptions): void {
      this._fontSize = ActualAPI.fontSize(options.fontStyle, options.fontSize);
      this._inlineHeight = ActualAPI.inlineHeight(options.size, options.inlineHeight);
      this._fontColorStyle = ActualAPI.fontColorStyle(options.fontStyle, options.fontColorStyle);
      this._validationStatus = ActualAPI.validationStatus(options.style, options.validationStatus);
      this._state = `${options.state}${this.calcState(options)}`;
   }
   private calcState(options: IRenderOptions): State {
      if (options.readOnly) {
         if (options.multiline) {
            return 'readonly-multiline';
         }

         return 'readonly';
      }

      /**
       * Only for ie and edge. Other browsers can work with :focus-within pseudo selector.
       */
      if (this.contentActive && detection.isIE) {
         return this._validationStatus + '-active';
      }

      return this._validationStatus;
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
