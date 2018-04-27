define('Controls-demo/List/EditInPlace/Hover', [
   'Core/Control',
   'tmpl!Controls-demo/List/EditInPlace/Hover',
   'WS.Data/Source/Memory',
   'Controls/Validate/Validators/IsRequired',
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

   var srcData2 = [
      {
         id: 1,
         title: 'Record3'
      },
      {
         id: 2,
         title: 'Record4'
      }
   ];

   var Hover = Control.extend({
      _template: template,
      editingConfig: null,
      _editOnClick: true,
      _enabled: true,

      _beforeMount: function() {
         this._viewSource = new MemorySource({
            idProperty: 'id',
            data: srcData
         });

         this._viewSource2 = new MemorySource({
            idProperty: 'id',
            data: srcData2
         });
      }
   });
   return Hover;
});
