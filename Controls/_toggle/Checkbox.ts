import Control = require('Core/Control');
import template = require('wml!Controls/_toggle/Checkbox/Checkbox');
import entity = require('Types/entity');
// убрать после https://online.sbis.ru/opendoc.html?guid=39d8fd32-5701-4e7f-b022-3ef5893977e8
import 'css!theme?Controls/_toggle/Checkbox/_Checkbox';


   /**
    * Represents a control that a user can select and clear.
    *
    * <a href="/materials/demo-ws4-checkbox">Demo-example</a>.
    *
    * @class Controls/_toggle/Checkbox
    * @extends Core/Control
    * @mixes Controls/interface/ICaption
    * @mixes Controls/interface/ITooltip
    * @mixes Controls/interface/IIcon
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

   var _private = {
      notifyChangeValue: function(self, value) {
         self._notify('valueChanged', [value]);
      }
   };

   var mapTriState = {false: true, true: null, null: false};
   var mapBoolState = {true: false, false: true};

   var Checkbox = Control.extend({
      _template: template,

      _clickHandler: function() {
         if (!this._options.readOnly) {
            var map = this._options.triState ? mapTriState : mapBoolState;
            _private.notifyChangeValue(this, map[this._options.value + '']);
         }
      }
   });

   Checkbox.getOptionTypes = function getOptionTypes() {
      return {
         triState: entity.descriptor(Boolean),
         tooltip: entity.descriptor(String)
      };
   };

   Checkbox.getDefaultOptions = function getDefaultOptions() {
      return {
         value: false,
         triState: false
      };
   };

   Checkbox._ptivate = _private;

   export = Checkbox;

