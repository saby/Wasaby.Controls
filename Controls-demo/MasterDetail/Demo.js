define('Controls-demo/MasterDetail/Demo', [
   'Core/Control',
   'tmpl!Controls-demo/MasterDetail/Demo',
   'Controls-demo/MasterDetail/Data',
   'Core/core-clone',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/MasterDetail/itemTemplates/masterItemTemplate',
   'css!Controls-demo/MasterDetail/Demo'
], function(Control, template, data, cClone, Memory, itemTemplate) {
   return Control.extend({
      _template: template,


      _beforeMount: function() {
         this._detail = {};

         this._detail.incoming = new Memory({
            idProperty: 'id',
            data: cClone(data.incoming)
         });
         this._detail.incomingTasks = new Memory({
            idProperty: 'id',
            data: cClone(data.incomingTasks)
         });
         this._detail.instructions = new Memory({
            idProperty: 'id',
            data: cClone(data.instructions)
         });
         this._detail.plans = new Memory({
            idProperty: 'id',
            data: cClone(data.plans)
         });

         this._masterSource = new Memory({
            idProperty: 'id',
            data: cClone(data.master)
         });
      },

      gridColumns: [
         {
            displayProperty: 'name',
            width: '1fr',
            template: itemTemplate
         }
      ]
   });
});
