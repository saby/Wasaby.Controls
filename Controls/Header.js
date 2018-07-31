define('Controls/Header', [
   'Core/Control',
   'tmpl!Controls/Header/Header',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Header'
], function(Control, template, types) {
   'use strict';

   /**
    * Header with support two display styles and four sizes. Can be used to display complex headers
    * along with a counter, a header-separator and a button-separator. A complex header can have modifiers:
    * 1) controls-Header_Counter__clickable Class for highlighting the header and counter on the hover.
    * 2) controls-Header_all__clickable Class for highlighting the header, counter, button-separator and header-separator on the hover.
    * 3) controls-Header_Separator__clickable Class for highlighting the headers and header-separator on the hover.
    *
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    *
    *
    * @class Controls/Header
    * @extends Core/Control
    * @control
    * @public
    * @demo Controls-demo/Headers/headerDemo
    *
    * @mixes Controls/Header/HeaderStyles
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
    * @name Controls/Header#caption
    * @cfg {String} Header text.
    */

   /**
    * @name Controls/Header#style
    * @cfg {String} Header display style.
    * @variant default Default display style. It is default value.
    * @variant primary Primary display style.
    */

   var Header = Control.extend({
      _template: template
   });

   Header.getOptionTypes =  function getOptionTypes() {
      return {
         caption: types(String),
         style: types(String).oneOf([
            'default',
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
         style: 'default',
         size: 'm'
      };
   };

   return Header;
});
