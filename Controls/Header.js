define('Controls/Header', [
   'Core/Control',
   'tmpl!Controls/Header/Header',
   'WS.Data/Type/descriptor',
   'css!Controls/Header/Header'
], function(Control, template, types) {
   'use strict';

   /**
    * Control showing the header.
    * <a href="/materials/demo-ws4-header-separator">Демо-пример</a>.
    * <u>Внимание</u>: временно демо-пример размещён на test-wi.sbis.ru.
    * Для авторизации воспользуйтесь связкой логин/пароль как "Демо_тензор"/"Демо123".
    *
    * @class Controls/Header
    * @extends Core/Control
    * @control
    * @public
    * @demo Controls-demo/Headers/headerDemo
    *
    *
    * @css controls-Header_Counter__clickable Class for highlighting the header and counter on the hover.
    * @css controls-Header_all__clickable Class for highlighting the header, counter, button-separator and header-separator on the hover.
    * @css controls-Header_Separator__clickable Class for highlighting the headers and header-separator on the hover.
    *
    * @mixes Controls/Header/HeaderStyles
    */

   /**
    * @name Controls/Header#size
    * @cfg {String} caption size
    * @variant s Caption has small size.
    * @variant m Caption has middle size.
    * @variant l Caption has large size.
    * @variant xl Caption has extralarge size.
    */

   /**
    * @name Controls/Header#caption
    * @cfg {String} caption Caption text.
    */

   /**
    * @name Controls/Header#style
    * @cfg {String} Caption display style.
    * @variant default Caption will be default.
    * @variant primary Caption will be accented.
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
