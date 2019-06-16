import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import ButtonTemplate = require('wml!Controls/_buttons/Button');
import ActualApi from './ActualApi';
import { IoC } from 'Env/Env';
import {IHref, IHrefOptions} from './interface/IHref';
import {IClick} from './interface/IClick';
import {ITooltip, ITooltipOptions,
   ICaption, ICaptionOptions,
   IIcon, IIconOptions,
   IIconStyle, IIconStyleOptions,
   IButton, IButtonOptions
} from 'Controls/interface';

export interface IButtonOptions extends IControlOptions, IHrefOptions,
                                 ICaptionOptions, IIconOptions, IIconStyleOptions, ITooltipOptions, IButtonOptions {
   contrastBackground?: boolean;
   buttonStyle?: string;
   fontColorStyle?: string;
}

/**
 * Graphical control element that provides the user a simple way to trigger an event.
 *
 * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
 *
 * @class Controls/_buttons/Button
 * @extends Core/Control
 * @mixes Controls/_buttons/interface/IHref
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/_buttons/interface/IClick
 * @mixes Controls/_interface/IIcon
 * @mixes Controls/_interface/IIconStyle
 * @mixes Controls/_interface/ITooltip
 * @mixes Controls/_interface/IButton
 * @mixes Controls/_button/ButtonStyles
 * @control
 * @public
 * @author Михайловский Д.С.
 * @category Button
 * @demo Controls-demo/Buttons/ButtonDemoPG
 */

/**
 * @name Controls/Button#contrastBackground
 * @cfg {Boolean} Determines whether button having background.
 * @default true
 * @remark
 * false - Button has transparent background.
 * true - Button has default background for this viewmode and style.
 * @example
 * Button has transparent background.
 * <pre>
 *    <Controls.Button caption="Send document" style="primary" viewMode="toolButton" contrastBackground="{{false}}" size="l"/>
 * </pre>
 * Button hasn't transparent background.
 * <pre>
 *    <Controls.Button caption="Send document" style="primary" viewMode="toolButton" />
 * </pre>
 * @see style
 */

class Button extends Control<IButtonOptions> implements IHref, ICaption, IIcon, IIcon, ITooltip, IButton, IClick {
   protected _template: TemplateFunction = ButtonTemplate;
   protected _theme: string[] = ['Controls/buttons', 'Controls/Classes'];

   // Называть _style нельзя, так как это состояние используется для темизации
   private _buttonStyle: string;
   private _fontColorStyle: string;
   private _fontSize: string;
   private _contrastBackground: boolean;
   private _hasIcon: boolean;
   private _viewMode: string;
   private _height: string;
   private _state: string;
   private _caption: string | TemplateFunction;
   private _stringCaption: boolean;
   private _icon: string;
   private _iconSize: string;
   private _iconStyle: string;

   private cssStyleGeneration(options: IButtonOptions): void {
      const currentButtonClass = ActualApi.styleToViewMode(options.style);
      const oldViewModeToken = ActualApi.viewMode(currentButtonClass.viewMode, options.viewMode);

      this._buttonStyle = ActualApi.buttonStyle(currentButtonClass.style, options.style, options.buttonStyle, options.readOnly);
      this._contrastBackground = ActualApi.contrastBackground(options);
      this._viewMode = oldViewModeToken.viewMode;
      if (typeof oldViewModeToken.contrast !== 'undefined') {
         this._contrastBackground = oldViewModeToken.contrast;
      }
      this._height = ActualApi.actualHeight(options.size, options.height, this._viewMode);
      this._fontColorStyle = ActualApi.fontColorStyle(this._buttonStyle, this._viewMode, options.fontColorStyle);
      this._fontSize = ActualApi.fontSize(options);
      this._hasIcon = options.icon;

      this._state = options.readOnly ? '_readOnly' : '';
      this._caption = options.caption;
      this._stringCaption = typeof options.caption === 'string';

      this._icon = options.icon;
      this._iconSize = ActualApi.iconSize(options);
      this._iconStyle = ActualApi.iconStyle(options);
   }

   _beforeMount(options: IButtonOptions): void {
      this.cssStyleGeneration(options);
   }

   _beforeUpdate(newOptions: IButtonOptions): void {
      this.cssStyleGeneration(newOptions);
   }

   _keyUpHandler(e): void {
      if (e.nativeEvent.keyCode === 13 && !this._options.readOnly) {
         this._notify('click');
      }
   }

   _clickHandler(e): void {
      if (this._options.readOnly) {
         e.stopPropagation();
      }
   }

   static getDefaultOptions() {
      return {
         viewMode: 'button',
         iconStyle: 'secondary',
         theme: 'default'
      };
   }
}

export default Button;
