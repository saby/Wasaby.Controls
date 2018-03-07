define('Controls-demo/Search/SearchVDom', [
   'Core/Control',
   'tmpl!Controls-demo/Search/SearchVDom',
   'css!Controls-demo/Search/SearchVDom',
   'Controls/Input/Search'
], function (Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template,
         _value: ''
      });
   return ModuleClass;
});