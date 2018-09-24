define('Controls/Heading', [
   'Core/Control',
   'wml!Controls/Header/Heading',
   'WS.Data/Type/descriptor',
   'css!theme?Controls/Header/Heading'
], function(Control, template, types) {
   'use strict';

   /**
    * Header with support different display styles and sizes. Can be used independently or as part of complex headers(you can see it in <a href="/materials/demo-ws4-header-separator">Demo-example</a>) consisting of a <a href="/docs/js/Controls/Header/Counter/?v=3.18.500">counter</a>, a <a href="/docs/js/Controls/Header/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    *
    * @class Controls/Header
    * @extends Core/Control
    * @control
    * @public
    * @demo Controls-demo/Headers/headerDemo
    *
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Header/HeadingStyles
    */

   /**
    * @name Controls/Header#size
    * @cfg {String} Header size.
    * @variant s Small text size.
    * @variant m Medium text size. It is default value.
    * @variant l Large text size.
    * @variant xl Extralarge text size.
    */

   /**
    * @name Controls/Header#style
    * @cfg {String} Header display style.
    * @variant primary Primary display style. It is default value.
    * @variant secondary Secondary display style.
    */

   var Header = Control.extend({
      _template: template
   });

   Header.getOptionTypes =  function getOptionTypes() {
      return {
         caption: types(String),
         style: types(String).oneOf([
            'secondary',
            'primary'
         ]),
         size: types(String).oneOf([
            'xl',
            'l',
            'm',
            's'
         ])
      };
   };

   Header.getDefaultOptions = function() {
      return {
         style: 'secondary',
         size: 'm'
      };
   };

   return Header;
});
