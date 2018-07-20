define('Controls/Toggle/Checkbox', [
   'Core/Control',
   'tmpl!Controls/Toggle/Checkbox/Checkbox',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Checkbox/Checkbox'
], function(Control, template, types) {

   /**
    * Basic checkbox.
    *
    * <a href="/materials/demo-ws4-checkbox">Демо-пример</a>.
    * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
    * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
    *
    * @class Controls/Toggle/Checkbox
    * @extends Core/Control
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/Button/interface/ICaption
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    * @demo Controls-demo/Checkbox/Checkbox
    */

   /**
    * @name Controls/Toggle/Checkbox#triState
    * @cfg {Boolean} Enable three-state mode.
    */

   /**
    * @name Controls/Toggle/Checkbox#value
    * @cfg {Boolean|null} Current state.
    */

   /**
    * @event Controls/Toggle/Checkbox#valueChanged Occurs when state changes.
    * @param {Boolean|null} value New state.
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
         var map = this._options.triState ? mapTriState : mapBoolState;
         _private.notifyChangeValue(this, map[this._options.value + '']);
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
