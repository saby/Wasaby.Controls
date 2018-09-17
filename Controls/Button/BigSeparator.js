define('Controls/Button/BigSeparator', [
   'Core/Control',
   'wml!Controls/Button/BigSeparator/BigSeparator',
   'WS.Data/Type/descriptor',

   'css!?Controls/Button/BigSeparator/BigSeparator'
], function(Control, template, types) {
   'use strict';

   /**
    * Limit separator, limit the number of entries to display. By clicking on it, you should show other entries.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/Button/BigSeparator
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    * @mixes Controls/Toggle/interface/ICheckable
    *
    * @demo Controls-demo/Headers/BigSeparator/BigSeparatorDemo
    *
    * @mixes Controls/Button/BigSeparator/BigSeparatorStyles
    */

   /**
    * @name Controls/Button/Separator#value
    * @cfg {Boolean} If value is true, that opening icon will be displaying, else closing icon will be displaying.
    */

   var _private = {
      iconChangedValue: function(self, options) {
         if (options.value) {
            self._icon = 'icon-AccordionArrowUp ';
         } else {
            self._icon = 'icon-AccordionArrowDown ';
         }
      }
   };

   var BigSeparator = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         _private.iconChangedValue(this, options);
      },

      _beforeUpdate: function(newOptions) {
         _private.iconChangedValue(this, newOptions);
      },

      clickHandler: function() {
         this._notify('valueChanged', [!this._options.value]);
      }
   });

   BigSeparator.getOptionTypes =  function getOptionTypes() {
      return {
         value: types(Boolean)
      };
   };

   BigSeparator.getDefaultOptions = function() {
      return {
         value: false
      };
   };

   BigSeparator._private = _private;

   return BigSeparator;
});
