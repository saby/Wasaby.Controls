import * as Control from 'Core/Control';
import checkBoxTemplate = require('wml!Controls/_toggle/Checkbox/Checkbox');
import {descriptor as EntityDescriptor} from 'Types/entity';
import {ITooltip, ITooltipOptions, ICaption, ICaptionOptions, IIcon, IIconOptions} from 'Controls/interface';
// убрать после https://online.sbis.ru/opendoc.html?guid=39d8fd32-5701-4e7f-b022-3ef5893977e8
import 'css!theme?Controls/_toggle/Checkbox/Checkbox';

// TODO https://online.sbis.ru/opendoc.html?guid=d602a67d-6d52-47a9-ac12-9c74bf5722e1
interface IControlOptions {
   readOnly?: boolean;
   theme?: string;
}
export interface ICheckboxOptions extends IControlOptions, ICaptionOptions, IIconOptions, ITooltipOptions {
   triState?: boolean;
   value?: boolean | null;
}

/**
 * Represents a control that a user can select and clear.
 *
 * <a href="/materials/demo-ws4-checkbox">Demo-example</a>.
 *
 * @class Controls/_toggle/Checkbox
 * @extends Core/Control
 * @implements Controls/_interface/ICaption
 * @implements Controls/_interface/IIcon
 * @implements Controls/_interface/ITooltip
 * @control
 * @public
 * @author Михайловский Д.С.
 * @category Toggle
 * @demo Controls-demo/Checkbox/CheckBoxDemoPG
 *
 * @mixes Controls/_toggle/Checkbox/CheckboxStyles
 */

/**
 * @name Controls/_toggle/Checkbox#triState
 * @cfg {Boolean} Determines whether the Checkbox will allow three check status rather than two.
 * @default False
 * @remark
 * True - Enable triState.
 * False - Disable triState.
 * If the triState mode is set, then the value can be null.
 * @example
 * Checkbox with enabled triState.
 * <pre>
 *    Boolean variable value: <Controls.Toggle.Checkbox on:valueChanged="_updateCheckBox()" triState="{{true}}" value="{{_checkBoxValue}}"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ...
 *       _updateCheckBox(event, value) {
 *          _checkBoxValue = value;
 *       }
 *       ...
 *    });
 * </pre>
 * @see option Value
 */

/**
 * @name Controls/_toggle/Checkbox#value
 * @cfg {Boolean|null} Current value, it's determines current state.
 * @default False
 * @remark
 * True - Selected checkbox state.
 * False - Unselected checkbox state. It is default state.
 * Null - TriState checkbox state.
 * Variant null of value this option is possible only when the triState option is enabled.
 * @example
 * Checkbox regulate theme in control.
 * <pre>
 *    <Controls.Toggle.Checkbox caption="Enable dark theme" value="{{_checkBoxValue}}" on:valueChanged="{{_darkThemeSwitched()}}"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ...
 *       _darkThemeSwitched(e, value) {
 *          _checkBoxValue = value;
 *          this._notify('themeChanged', [_checkBoxValue]);
 *       }
 *       ...
 *    });
 * </pre>
 * Checkbox value when triState option is true.
 * <pre>
 *    Boolean variable value: <Controls.Toggle.Checkbox on:valueChanged="_updateCheckBox()" triState="{{true}}" value="{{_checkBoxValue}}"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ...
 *       _updateCheckBox(event, value) {
 *          _checkBoxValue = value;
 *       }
 *       ...
 *    });
 * </pre>
 * @see option triState
 * @see event valueChanged()
 */

/**
 * @event Controls/_toggle/Checkbox#valueChanged Occurs when state changes.
 * @param {Boolean|null} New value.
 * @remark This event should be used to react to changes user makes in the checkbox. Value returned in the event is not inserted in control unless you pass it back to the field as an option. Value may be null only when checkbox tristate option is true.
 * @example
 * Example description.
 * <pre>
 *    <Controls.Toggle.Checkbox value="{{_checkBoxValue}}" on:valueChanged="_valueChangedHandler()" />
 * </pre>
 * <pre>
 *    Control.extend({
 *       ...
 *       _valueChangedHandler(e, value) {
 *          this._checkBoxValue= value;
 *       }
 *       ...
 *    });
 * </pre>
 * @see value
 * @see triState
 */

const mapTriState = {false: true, true: null, null: false};
const mapBoolState = {true: false, false: true};

class Checkbox extends Control implements ICaption, IIcon, ITooltip {

   // TODO https://online.sbis.ru/opendoc.html?guid=0e449eff-bd1e-4b59-8a48-5038e45cab22
   protected _template: Function = checkBoxTemplate;
   protected _theme: string[] = ['Controls/toggle'];
   protected _options: ICheckboxOptions;

   private _notifyChangeValue(value: boolean | null): void {
      this._notify('valueChanged', [value]);
   }

   private _clickHandler(): void {
      if (!this._options.readOnly) {
         const map = this._options.triState ? mapTriState : mapBoolState;
         this._notifyChangeValue(map[this._options.value + '']);
      }
   }

   static getDefaultOptions(): object {
      return {
         value: false,
         triState: false
      };
   }

   static getOptionTypes(): object {
      return {
         triState: EntityDescriptor(Boolean),
         tooltip: EntityDescriptor(String)
      };
   }
   '[Controls/_interface/ITooltip]': true;
   '[Controls/_interface/ICaption]': true;
   '[Controls/_interface/IIcon]': true;
}

export default Checkbox;
