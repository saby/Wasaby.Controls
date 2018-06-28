define('Controls-demo/List/EditInPlace/Hover', [
   'Core/Control',
   'tmpl!Controls-demo/List/EditInPlace/Hover',
   'WS.Data/Source/Memory',
   'css!Controls-demo/List/EditInPlace/EditInPlace'
], function(Control,
   template,
   MemorySource
) {
   'use strict';

   var srcData = [
      {
         id: 1,
         title: 'Record1'
      },
      {
         id: 2,
         title: 'Record2'
      }
   ];

   var Hover = Control.extend({
      _template: template,
      editingConfig: null,
      _enabled: true,

      _beforeMount: function() {
         this._viewSource = new MemorySource({
            idProperty: 'id',
            data: srcData
         });
      }
   });
   return Hover;
});
