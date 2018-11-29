define('Controls-demo/List/List/LoadMore', [
   'Core/Control',
   'wml!Controls-demo/List/List/resources/LoadMore/LoadMore',
   'WS.Data/Source/Memory',
   'Controls-demo/List/List/resources/Data',
   'Controls/List',
   'css!Controls-demo/List/List/resources/LoadMore/LoadMore'
], function (Control, template, MemorySource, ListData) {
   'use strict';

   var
      ModuleClass = Control.extend({
         _template: template,
         _viewSource: null,

         _beforeMount: function() {
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: ListData.generate(50)
            });
         }
      });
   return ModuleClass;
});
