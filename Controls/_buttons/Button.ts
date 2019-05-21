import Control = require('Core/Control');
import template = require('wml!Controls/_buttons/Button');
import classesUtil from './classesUtil';
import iconsUtil from './iconsUtil';
// @ts-ignore
import { IoC } from 'Env/Env';


/**
 * Graphical control element that provides the user a simple way to trigger an event.
 *
 * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
 *
 * @class Controls/_buttons/Button
 * @extends Core/Control
 * @mixes Controls/interface/IHref
 * @mixes Controls/_interface/ICaption
 * @mixes Controls/interface/IClick
 * @mixes Controls/_interface/IIcon
 * @mixes Controls/_interface/IButton
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
 * @name Controls/Button#transparent
 * @cfg {Boolean} Determines whether button having background.
 * @default false
 * @remark
 * true - Button has transparent background.
 * false - Button has default background for this viewmode and style.
 * @example
 * Button has transparent background.
 * <pre>
 *    <Controls.Button caption="Send document" style="primary" viewMode="toolButton" transparent="{{true}}" size="l"/>
 * </pre>
 * Button hasn't transparent background.
 * <pre>
 *    <Controls.Button caption="Send document" style="primary" viewMode="toolButton" transparent="{{false}}"/>
 * </pre>
 * @see style
 */

class Button extends Control {
   private _template: Function = template;

   // Называть _style нельзя, так как это состояние используется для темизации
   private _buttonStyle: String;
   private _transparent: Boolean;
   private _viewMode: String;
   private _state: String;
   private _caption: String | Function;
   private _stringCaption: Boolean;
   private _icon: String;
   private _iconStyle: String;

   static _theme: Array<string> = ['Controls/buttons'];
   private cssStyleGeneration(options) {
      const currentButtonClass = classesUtil.getCurrentButtonClass(options.style);

      this._buttonStyle = currentButtonClass.style ? currentButtonClass.style : options.style;
      this._transparent = options.transparent;
      this._viewMode = currentButtonClass.viewMode ? currentButtonClass.viewMode : options.viewMode;
      if (this._viewMode === 'transparentQuickButton' || this._viewMode === 'quickButton') {
         if (this._viewMode === 'transparentQuickButton') {
            this._transparent = true;
         }
         this._viewMode = 'toolButton';
         IoC.resolve('ILogger').warn('Button', 'В кнопке используется viewMode = quickButton, transparentQuickButton используйте значение опции viewMode toolButton и опцию transparent');
      }
      this._state = options.readOnly ? '_readOnly' : '';
      this._caption = options.caption;
      this._stringCaption = typeof options.caption === 'string';
      this._icon = options.icon;
      this._iconStyle = currentButtonClass.buttonAdd ? 'default' : iconsUtil.iconStyleTransformation(options.iconStyle);
   }

   _beforeMount(options) {
      this.cssStyleGeneration(options);
   }

   _beforeUpdate(newOptions) {
      this.cssStyleGeneration(newOptions);
   }

   _keyUpHandler(e) {
      if (e.nativeEvent.keyCode === 13 && !this._options.readOnly) {
         this._notify('click');
      }
   }

   _clickHandler(e) {
      if (this._options.readOnly) {
         e.stopPropagation();
      }
   }

   static getDefaultOptions() {
      return {
         style: 'secondary',
         viewMode: 'button',
         size: 'm',
         iconStyle: 'secondary',
         transparent: true,
         theme: 'default'
      };
   }
}

export default Button;
