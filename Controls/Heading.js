define('Controls/Heading', [
   'Core/Control',
   'wml!Controls/Heading/Heading',
   'WS.Data/Type/descriptor',
   'css!theme?Controls/Heading/Heading'
], function(Control, template, types) {
   'use strict';

   /**
    * Heading with support different display styles and sizes. Can be used independently or as part of complex headings(you can see it in <a href="/materials/demo-ws4-header-separator">Demo-example</a>) consisting of a <a href="/docs/js/Controls/Heading/Counter/?v=3.18.500">counter</a>, a <a href="/docs/js/Controls/Heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    *
    * @class Controls/Heading
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    * @demo Controls-demo/Headers/headerDemo
    *
    * @mixes Controls/interface/ICaption
    * @mixes Controls/Heading/HeadingStyles
    */

   /**
    * @name Controls/Heading#size
    * @cfg {String} Heading size.
    * @variant s Small text size.
    * @variant m Medium text size.
    * @variant l Large text size.
    * @variant xl Extralarge text size.
    * @default m
    */

   /**
    * @name Controls/Heading#style
    * @cfg {String} Heading display style.
    * @variant primary Primary display style.
    * @variant secondary Secondary display style.
    * @default primary
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
