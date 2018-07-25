define('Controls/Toggle/Switch', [
   'Core/Control',
   'tmpl!Controls/Toggle/Switch/Switch',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Switch/Switch',
   'css!Controls/Toggle/resources/SwitchCircle/SwitchCircle'
], function(Control, template, types) {

   /**
    * Switch control.
    *
    * <a href="/materials/demo-ws4-switchers">Демо-пример</a>.
    * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
    * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
    *
    * @class Controls/Toggle/Switch
    * @extends Core/Control
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    * @demo Controls-demo/Switch/SwitchDemo
    *
    * @mixes Controls/Toggle/Switch/SwitchStyles
    * @mixes Controls/Toggle/resources/SwitchCircle/SwitchCircleStyles
    */

   /**
    * @name Controls/Toggle/Switch#caption
    * @cfg {String} Title.
    */

   /**
    * @name Controls/Toggle/Switch#captionPosition
    * @cfg {Boolean} Switch caption has left position.
    * @variant left Switch has caption before toggle composition.
    * @variant right Switch has toggle before caption composition.
    */

   var Switch = Control.extend({
      _template: template,

      _clickHandler: function(e) {
         if (!this._options.readOnly) {
            this._notify('valueChanged', [!this._options.value]);
         }
      }
   });

   Switch.getDefaultOptions = function getDefaultOptions() {
      return {
         value: false,
         captionPosition: 'right'
      };
   };

   Switch.getOptionTypes = function getOptionTypes() {
      return {
         value: types(Boolean),
         caption: types(String),
         captionPosition: types(String).oneOf([
            'left',
            'right'
         ])
      };
   };

   return Switch;
});
