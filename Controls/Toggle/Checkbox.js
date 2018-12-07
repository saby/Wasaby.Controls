define('Controls/Toggle/Checkbox', [
   'Core/Control',
   'wml!Controls/Toggle/Checkbox/Checkbox',
   'WS.Data/Type/descriptor',
   'css!theme?Controls/Toggle/Checkbox/Checkbox'
], function(Control, template, types) {

   /**
    * Represents a control that a user can select and clear.
    *
    * <a href="/materials/demo-ws4-checkbox">Demo-example</a>.
    *
    * @class Controls/Toggle/Checkbox
    * @extends Core/Control
    * @mixes Controls/interface/ICaption
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @author Михайловский Д.С.
    * @category Toggle
    * @demo Controls-demo/Checkbox/CheckBoxDemoPG
    *
    * @mixes Controls/Toggle/Checkbox/CheckboxStyles
    */

   /**
    * @name Controls/Toggle/Checkbox#triState
    * @cfg {Boolean} Determines whether the Checkbox will allow three check status rather than two.
    * @variant True Enable triState.
    * @variant False Disable triState.
    * @default False
    * @remark If the triState mode is set, then the value can be null.
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
    * @name Controls/Toggle/Checkbox#value
    * @cfg {Boolean|null} Current value, it's determines current state.
    * @variant True Selected checkbox state.
    * @variant False Unselected checkbox state. It is default state.
    * @variant Null TriState checkbox state.
    * @default False
    * @remark Variant null of value this option is possible only when the triState option is enabled.
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
    * @event Controls/Toggle/Checkbox#valueChanged Occurs when state changes.
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
         triState: types(Boolean),
         tooltip: types(String)
      };
   };

   Checkbox.getDefaultOptions = function getDefaultOptions() {
      return {
         value: false,
         triState: false
      };
   };

   Checkbox._ptivate = _private;

   return Checkbox;
});
