import * as Control from 'Core/Control';
import Classes from './Button/Classes';
import {buttonTemplate, iconsUtil} from 'Controls/buttons';
import {ICheckable, ICheckableOptions} from './interface/ICheckable';
import {ITooltip, ITooltipOptions, IButton, IButtonOptions, IIconStyle, IIconStyleOptions} from 'Controls/interface';

// TODO https://online.sbis.ru/opendoc.html?guid=d602a67d-6d52-47a9-ac12-9c74bf5722e1
interface IControlOptions {
   readOnly?: boolean;
   theme?: string;
}
export interface IToggleButtonOptions extends
   IControlOptions, ICheckableOptions, ITooltipOptions, IButtonOptions, IIconStyleOptions {
   icons: string[];
   captions: string[];
   viewMode: string;
}

/**
 * Button that switches between two states: on-state and off-state.
 *
 * <a href="/materials/demo-ws4-buttons">Demo-example</a>.
 *
 * @class Controls/_toggle/Button
 * @implements Controls/_toggle/interface/ICheckable
 * @implements Controls/_interface/ITooltip
 * @implements Controls/_interface/IButton
 * @implements Controls/_interface/IIconStyle
 * @mixes Controls/_toggle/Button/Styles
 * @control
 * @public
 * @author Михайловский Д.С.
 * @category Toggle
 *
 * @demo Controls-demo/Buttons/Toggle/ToggleButtonPG
 */

/**
 * @name Controls/_toggle/Button#icons
 * @cfg {Array} Pair of icons.
 * First icon displayed when toggle switch is off.
 * Second icon displayed when toggle switch is on.
 * @example
 * Toggle button with one icon.
 * <pre>
 *    <Controls.Toggle.Button icons="{{['icon-small icon-ArrangeList03']}}" viewMode="link"/>
 * </pre>
 * Toggle button with two icons.
 * <pre>
 *    <Controls.Toggle.Button icons="{{['icon-small icon-ArrangeList03', 'icon-small icon-ArrangeList04']}}" iconStyle="success" style="primary" viewMode="link"/>
 * </pre>
 */

/**
 * @name Controls/_toggle/Button#captions
 * @cfg {Array} Pair of captions.
 * First caption displayed when toggle switch is off.
 * Second caption displayed when toggle switch is on.
 * @example
 * Toggle button with two captions.
 * <pre>
 *    <Controls.Toggle.Button readOnly="{{false}}" size="m" captions="{{['Change', 'Save']}}" style="info" viewMode="link"/>
 * </pre>
 * Toggle button with one caption.
 * <pre>
 *    <Controls.Toggle.Button readOnly="{{false}}" size="m" captions="{{['Save']}}" style="info" viewMode="link"/>
 * </pre>
 */

/**
 * @name Controls/_toggle/Button#viewMode
 * @cfg {Enum} Toggle button view mode.
 * @variant link Decorated hyperlink.
 * @variant pushButton Decorated hyperlink transform to toolbar button.
 * @variant toolButton Toolbar button.
 * @default link
 * @example
 * Toggle button with 'link' viewMode.
 * <pre>
 *    <Controls.Toggle.Button captions="{{['Send document']}}" style="primary" viewMode="link" size="xl"/>
 * </pre>
 * Toggle button with 'toolButton' viewMode.
 * <pre>
 *    <Controls.Toggle.Button captions="{{['Send document']}}" style="danger" viewMode="toolButton"/>
 * </pre>
 * Toggle button with 'pushButton' viewMode.
 * <pre>
 *    <Controls.Toggle.Button captions="{{['Send document']}}" style="primary" viewMode="pushButton"/>
 * </pre>
 */
const stickyButton = [
   'pushButton',
   'toolButton'
];

class ToggleButton extends Control implements ICheckable {
   // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
   protected _template: Function = buttonTemplate;
   protected _theme: string[] = ['Controls/buttons', 'Controls/toggle'];
   protected _options: IToggleButtonOptions;
   protected _icon: string;
   protected _buttonStyle: string;
   protected _transparent: boolean;
   protected _viewMode: string;
   protected _state: string;
   protected _caption: string;
   protected _iconStyle: string;

   private _optionsGeneration(options: IToggleButtonOptions): void {
      const currentButtonClass = Classes.getCurrentButtonClass(options.style);

      // Называть _style нельзя, так как это состояние используется для темизации
      this._buttonStyle = currentButtonClass.style ? currentButtonClass.style : options.style;
      this._transparent = options.transparent;
      this._viewMode = currentButtonClass.style ? currentButtonClass.viewMode : options.viewMode;
      this._state = (stickyButton.indexOf(this._viewMode) !== -1 && options.value ? '_toggle_on' : '') + (options.readOnly ? '_readOnly' : '');
      this._caption = (options.captions ? (!options.value && options.captions[1] ? options.captions[1] : options.captions[0]) : '');
      this._icon = (options.icons ? (!options.value && options.icons[1] ? options.icons[1] : options.icons[0]) : '');
      this._iconStyle = iconsUtil.iconStyleTransformation(options.iconStyle);
   }

   private _clickHandler(): void {
      if (!this._options.readOnly) {
         this._notify('valueChanged', [!this._options.value]);
      }
   }

   protected _beforeMount(newOptions: IToggleButtonOptions): void {
      this._optionsGeneration(newOptions);
   }

   protected _beforeUpdate(newOptions: IToggleButtonOptions): void {
      this._optionsGeneration(newOptions);
   }

   static getDefaultOptions(): object {
      return {
         viewMode: 'link',
         style: 'secondary',
         size: 'l',
         iconStyle: 'secondary'
      };
   }
   '[Controls/_toggle/interface/ICheckable]': true;
   '[Controls/_interface/IButton]': true;
   '[Controls/_interface/IIconStyle]': true;
   '[Controls/_interface/ITooltip]': true;
}
export default ToggleButton;
