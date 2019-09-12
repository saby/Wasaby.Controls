define('Controls-demo/MasterDetail/Demo', [
   'Core/Control',
   'wml!Controls-demo/MasterDetail/Demo',
   'Controls-demo/MasterDetail/Data',
   'Core/core-clone',
   'Types/source',
   'wml!Controls-demo/MasterDetail/itemTemplates/masterItemTemplate',
   'Controls-demo/MasterDetail/DemoSource',
   'css!Controls-demo/MasterDetail/Demo'
], function(Control, template, data, cClone, source, itemTemplate, DemoSource) {
   return Control.extend({
      _template: template,


      _beforeMount: function() {
         this._detail = {};

         this._detailSource = new DemoSource({keyProperty: 'id'});

         this._masterSource = new source.Memory({
            keyProperty: 'id',
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
