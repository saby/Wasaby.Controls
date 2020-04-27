define('Controls-demo/Search/SearchVDom', [
   'Core/Control',
   'wml!Controls-demo/Search/SearchVDom',
   'css!Controls-demo/Search/SearchVDOM',
   'Controls/search'
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