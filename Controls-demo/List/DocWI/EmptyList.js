define('Controls-demo/List/DocWI/EmptyList', [
   'Core/Control',
   'wml!Controls-demo/List/DocWI/resources/Default',
   'Types/source'
], function (Control, template, sourceLib) {
   'use strict';

   var Module = Control.extend(
      {
         _template: template,
         _viewSource: null,

         _beforeMount: function(newOptions) {
            this._viewSource = new sourceLib.Memory({
               keyProperty: 'id',
               data: []
            });
         }
      });
   return Module;
});
