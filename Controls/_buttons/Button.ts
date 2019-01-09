import * as Control from 'Core/Control';
import template = require('wml!Controls/_buttons/Button');
import classesUtil from './classesUtil'
import iconsUtil from './iconsUtil'
import * as IoC from 'Core/IoC';


/**
 * Graphical control element that provides the user a simple way to trigger an event.
 *
 * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
 *
 * @class Controls/Button
 * @extends Core/Control
 * @mixes Controls/Button/interface/IHref
 * @mixes Controls/interface/ICaption
 * @mixes Controls/Button/interface/IClick
 * @mixes Controls/Button/interface/IIcon
 * @mixes Controls/Button/interface/IIconStyle
 * @mixes Controls/interface/ITooltip
 * @mixes Controls/interface/IButton
 * @mixes Controls/Button/ButtonStyles
 * @control
 * @public
 * @author Михайловский Д.С.
 * @category Button
 * @demo Controls-demo/Buttons/ButtonDemoPG
 */

/**
 * @name Controls/Button#transparent
 * @cfg {Boolean} Determines whether button having background.
 * @variant true Button has transparent background.
 * @variant false Button has default background for this viewmode and style.
 * @default false
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

   private _style: String;
   private _transparent: Boolean;
   private _viewMode: String;
   private _state: String;
   private _caption: String | Function;
   private _stringCaption: String;
   private _icon: String;
   private _iconStyle: String;

   private cssStyleGeneration(options) {
      const currentButtonClass = classesUtil.getCurrentButtonClass(options.style);

      this._style = currentButtonClass.style ? currentButtonClass.style : options.style;
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
         transparent: true
      };
   }
}

export default Button;
