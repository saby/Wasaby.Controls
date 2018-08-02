define('Controls/Header/Separator', [
   'Core/Control',
   'tmpl!Controls/Header/Separator/Separator',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Separator/Separator'
], function(Control, template, types) {
   'use strict';

   /**
    * Header separator with support two display styles.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    *
    * @class Controls/Header/Separator
    * @extends Core/Control
    * @control
    * @public
    *
    * @demo Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo
    *
    * @mixes Controls/Header/Separator/SeparatorStyles
    */

   /**
    * @name Controls/Header/Separator#style
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant primary Primary display style.
    * @variant secondary Secondary display style. It is default value.
    */

   var Separator = Control.extend({
      _template: template
   });

   Separator.getOptionTypes =  function getOptionTypes() {
      return {
         style: types(String).oneOf([
            'secondary',
            'primary'
         ])
      };
   };

   Separator.getDefaultOptions = function() {
      return {
         style: 'secondary'
      };
   };

   return Separator;
});
