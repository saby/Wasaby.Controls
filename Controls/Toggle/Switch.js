define('Controls/Toggle/Switch', [
   'Core/Control',
   'tmpl!Controls/Toggle/Switch/Switch',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Switch/Switch'
], function (Control, template, types) {

   /**
    * Контрол, отображающий переключатель
    * @class Controls/Toggle/Switch
    * @extends Controls/Control
    * @mixes Controls/Toggle/interface/ICheckable
    * @mixes Controls/interface/ITooltip
    * @control
    * @public
    * @category Toggle
    */

   /**
    * @name Controls/Toggle/Switch#caption
    * @cfg {String} Заголовок
    */

   var Switch = Control.extend({
      _template: template,

      _clickHandler: function (e) {
         if (this.isEnabled()) {
            this._notify('valueChanged', [!this._options.value]);
         }
      },

      _getMarkerState: function() {
         if (this.isEnabled()) {
            if (this._options.value) {
               return 'controls-Switch__marker_enabled_checked';
            } else {
               return 'controls-Switch__marker_enabled_unchecked'
            }
         } else {
            if (this._options.value) {
               return 'controls-Switch__marker_disabled_checked';
            } else {
               return 'controls-Switch__marker_disabled_unchecked'
            }
         }
      }
   });

   Switch.getDefaultOptions = function getDefaultOptions() {
      return {
         value: false
      };
   };

   Switch.getOptionTypes = function getOptionTypes() {
      return {
         value: types(Boolean),
         caption: types(String)
      };
   };

   return Switch;
});