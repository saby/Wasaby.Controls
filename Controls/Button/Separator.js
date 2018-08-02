define('Controls/Button/Separator', [
   'Core/Control',
   'tmpl!Controls/Button/Separator/Separator',
   'WS.Data/Type/descriptor',
   'css!Controls/Button/Separator/Separator'
], function(Control, template, types) {
   'use strict';

   /**
    * Button separator with support three display style and can be bold.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    *
    * @class Controls/Button/Separator
    * @extends Core/Control
    * @control
    * @public
    * @mixes Controls/Toggle/interface/ICheckable
    *
    * @demo Controls-demo/Headers/ButtonSeparator/buttonSeparatorDemo
    *
    * @mixes Controls/Button/Separator/SeparatorStyles
    */

   /**
    * @name Controls/Button/Separator#style
    * @cfg {String} Separator display style.
    * @variant secondary Secondary display style. It is default value.
    * @variant additional Additional display style.
    * @variant primary Primary display style.
    */

   /**
    * @name Controls/Button/Separator#value
    * @cfg {Boolean} Determines the current state.
    */

   /**
    * @name Controls/Button/Separator#bold
    * @cfg {Boolean} Determines the double separator thickness.
    */

   var _private = {
      iconChangedValue: function(self, options) {
         if (options.value) {
            self._icon = 'icon-' + (options.bold ? 'MarkCollapseBold ' : 'CollapseLight ');
         } else {
            self._icon = 'icon-' + (options.bold ? 'MarkExpandBold ' : 'ExpandLight ');
         }
      }
   };

   var ButtonSeparator = Control.extend({
      _template: template,

      _beforeMount: function(options) {
         _private.iconChangedValue(this, options);
      },

      _beforeUpdate: function(newOptions) {
         _private.iconChangedValue(this, newOptions);
      },

      clickHandler: function(e) {
         this._notify('valueChanged', [!this._options.value]);
      }
   });

   ButtonSeparator.getOptionTypes =  function getOptionTypes() {
      return {
         bold: types(Boolean),
         style: types(String).oneOf([
            'secondary',
            'additional',
            'primary'
         ]),
         value: types(Boolean)
      };
   };

   ButtonSeparator.getDefaultOptions = function() {
      return {
         style: 'secondary',
         value: false,
         bold: false
      };
   };

   ButtonSeparator._private = _private;

   return ButtonSeparator;
});
