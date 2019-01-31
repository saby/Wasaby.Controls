define('Controls-demo/List/DocWI/EmptyList', [
   'Core/Control',
   'wml!Controls-demo/List/List/DocWI/resources/EmptyList',
   'Types/source'
], function (Control, template, sourceLib) {
   'use strict';

   var Module = Control.extend(
      {
         _template: template,
         _viewSource: null,

         _beforeMount: function(newOptions) {
            this._viewSource = new sourceLib.Memory({
               idProperty: 'id',
               data: []
            });
         }
      });
   return Module;
});
