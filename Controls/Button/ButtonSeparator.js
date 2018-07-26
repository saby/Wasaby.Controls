define('Controls/Button/ButtonSeparator', [
   'Core/Control',
   'tmpl!Controls/Button/ButtonSeparator/ButtonSeparator',
   'WS.Data/Type/descriptor',
   'css!Controls/Button/ButtonSeparator/ButtonSeparator'
], function(Control, template, types) {
   'use strict';

   /**
    * Control showing the separator button.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
    * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
    *
    * @class Controls/Button/ButtonSeparator
    * @extends Core/Control
    * @control
    * @public
    *
    * @demo Controls-demo/Headers/headerDemo
    *
    * @mixes Controls/Button/ButtonSeparator/ButtonSeparatorStyles
    */

   /**
    * @name Controls/Button/ButtonSeparator#style
    * @cfg {String} Icon display style.
    * @variant accent Icon will be default.
    * @variant additional Icon will be non accented.
    * @variant main Icon will be accented.
    */

   /**
    * @name Controls/Button/ButtonSeparator#value
    * @cfg {Boolean} Current state.
    */

   /**
    * @name Controls/Button/ButtonSeparator#bold
    * @cfg {Boolean} If value is true, that icon is bold, else icon isn't bold.
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
      }
   });

   ButtonSeparator.getOptionTypes =  function getOptionTypes() {
      return {
         bold: types(Boolean),
         style: types(String).oneOf([
            'accent',
            'additional',
            'main'
         ]),
         value: types(Boolean)
      };
   };

   ButtonSeparator.getDefaultOptions = function() {
      return {
         style: 'accent',
         value: false,
         bold: false
      };
   };

   ButtonSeparator._private = _private;

   return ButtonSeparator;
});
