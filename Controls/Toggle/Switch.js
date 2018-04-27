define('Controls/Toggle/Switch', [
   'Core/Control',
   'tmpl!Controls/Toggle/Switch/Switch',
   'WS.Data/Type/descriptor',
   'css!Controls/Toggle/Switch/Switch'
], function(Control, template, types) {

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

   var _private = {
      _getMarkerState: function(enabled, value) {
         if (enabled) {
            if (value) {
               return 'controls-Switch__marker_enabled_checked';
            } else {
               return 'controls-Switch__marker_enabled_unchecked';
            }
         } else {
            if (value) {
               return 'controls-Switch__marker_disabled_checked';
            } else {
               return 'controls-Switch__marker_disabled_unchecked';
            }
         }
      }
   };

   var Switch = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         //Мы ждем прокси опции от Димы Зуева, сейчас isEnabled() может работать неправильно
         var enabled = !options.readOnly;
         this._markerState = _private._getMarkerState(enabled, options.value);
      },

      _beforeUpdate: function(options) {
         //Мы ждем прокси опции от Димы Зуева, сейчас isEnabled() может работать неправильно
         var enabled = !options.readOnly;
         this._markerState = _private._getMarkerState(enabled, options.value);
      },

      _clickHandler: function(e) {
         if (!this._options.readOnly) {
            this._notify('valueChanged', [!this._options.value]);
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
