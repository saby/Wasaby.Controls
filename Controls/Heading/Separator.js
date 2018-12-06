define('Controls/Heading/Separator', [
   'Core/Control',
   'wml!Controls/Heading/Separator/Separator',
   'WS.Data/Type/descriptor',
   'css!theme?Controls/Heading/Separator/Separator'
], function(Control, template, types) {
   'use strict';

   /**
    * Header separator with support some display styles. Used as part of complex headers(you can see it in Demo-example)
    * consisting of a <a href="/docs/js/Controls/Heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a> and a <a href="/docs/js/Controls/Heading/Counter/?v=3.18.500">counter</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    * @class Controls/Heading/Separator
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    *
    * @demo Controls-demo/Headers/HeaderSeparator/headerSeparatorDemo
    *
    * @mixes Controls/Heading/Separator/SeparatorStyles
    * @mixes Controls/interface/ICaption
    */

   /**
    * @name Controls/Heading/Separator#style
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
