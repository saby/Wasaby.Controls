define('Controls/Header/Separator/Separator', [
   'Core/Control',
   'Core/IoC',
   'tmpl!Controls/Header/Separator/Separator',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Separator/Separator'
], function(Control, IoC, template, types) {
   'use strict';

   /**
    * Control showing the right arrow icon.
    * @class Controls/Header
    * @extends Controls/Control
    * @control
    * @public
    */

   /**
    * @name Controls/Header#separatorIconStyle
    * @cfg {String} Icon display style. In the online theme has only one display style.
    * @variant primary Icon-separator will be accented.
    * @variant default Icon-separator will be default.
    */

   var Header = Control.extend({
      _template: template
   });

   Header.getOptionTypes =  function getOptionTypes() {
      return {
         style: types(String).oneOf([
            'default',
            'primary'
         ])
      }
   };

   Header.getDefaultOptions = function() {
      return {
         style: 'default'
      };
   };

   return Header;
});
