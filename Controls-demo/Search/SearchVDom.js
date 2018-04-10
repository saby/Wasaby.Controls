define('Controls-demo/Search/SearchVDom', [
   'Core/Control',
   'tmpl!Controls-demo/Search/SearchVDom',
   'css!Controls-demo/Search/SearchVDOM',
   'Controls/Input/Search'
], function (Control, template) {
   'use strict';

   var ModuleClass = Control.extend(
      {
         _template: template,
         _value: '',
         textValue: '',
         textSearchValue: '',

         _changeValueSearchHandler: function () {
            this.textSearchValue += 'search\n';
         },
         _changeValuesHandler: function () {
            this.textValue += 'valueChanged\n';
         }

      });
   return ModuleClass;
});