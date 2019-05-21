import Control = require('Core/Control');
import template = require('wml!Controls/_heading/Heading/Heading');
import entity = require('Types/entity');


   /**
    * Heading with support different display styles and sizes. Can be used independently or as part of complex headings(you can see it in <a href="/materials/demo-ws4-header-separator">Demo-example</a>) consisting of a <a href="/docs/js/Controls/_heading/Counter/?v=3.18.500">counter</a>, a <a href="/docs/js/Controls/_heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Button/Separator/?v=3.18.500">button-separator</a>.
    *
    * <a href="/materials/demo-ws4-header-separator">Demo-example</a>.
    *
    *
    * @class Controls/_heading/Heading
    * @extends Core/Control
    * @control
    * @public
    * @author Михайловский Д.С.
    * @demo Controls-demo/Headers/headerDemo
    *
    * @mixes Controls/_interface/ITooltip
    * @mixes Controls/_interface/ICaption
    * @mixes Controls/_heading/Heading/HeadingStyles
    */

   /**
    * @name Controls/_heading/Heading#size
    * @cfg {String} Heading size.
    * @variant s Small text size.
    * @variant m Medium text size.
    * @variant l Large text size.
    * @variant xl Extralarge text size.
    * @default m
    */

   /**
    * @name Controls/_heading/Heading#style
    * @cfg {String} Heading display style.
    * @variant primary
    * @variant secondary
    * @variant info
    * @default primary
    */

   var Header = Control.extend({
      _template: template
   });

   Header.getOptionTypes =  function getOptionTypes() {
      return {
         caption: entity.descriptor(String),
         style: entity.descriptor(String).oneOf([
            'secondary',
            'primary',
            'info'
         ]),
         size: entity.descriptor(String).oneOf([
            'xl',
            'l',
            'm',
            's'
         ])
      };
   };
   Header._theme = ['Controls/heading'];

   Header.getDefaultOptions = function() {
      return {
         style: 'secondary',
         size: 'm',
         theme: 'default'
      };
   };

   export = Header;

