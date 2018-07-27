define('Controls/Header/Separator', [
   'Core/Control',
   'tmpl!Controls/Header/Separator/Separator',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Separator/Separator'
], function(Control, template, types) {
   'use strict';

   /**
    * Control showing the right arrow icon.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
    * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
    *
    * @class Controls/Header/Separator
    * @extends Core/Control
    * @control
    * @public
    *
    * @demo Controls-demo/Headers/headerDemo
    *
    * @mixes Controls/Header/Separator/SeparatorStyles
    */

   /**
    * @name Controls/Header/Separator#style
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant primary Icon-separator will be accented.
    * @variant default Icon-separator will be default.
    */

   var Separator = Control.extend({
      _template: template
   });

   Separator.getOptionTypes =  function getOptionTypes() {
      return {
         style: types(String).oneOf([
            'default',
            'primary'
         ])
      };
   };

   Separator.getDefaultOptions = function() {
      return {
         style: 'default'
      };
   };

   return Separator;
});
