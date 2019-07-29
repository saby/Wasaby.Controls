define('Controls-demo/List/Grid/ValignGrid', [
   'Env/Env',
   'Core/Control',
   'Controls-demo/List/Grid/GridData',
   'wml!Controls-demo/List/Grid/ValignGrid',
   'Types/source',
   'wml!Controls-demo/List/Grid/DemoItem',
   'wml!Controls-demo/List/Grid/DemoCostPriceFullHeight',
   'wml!Controls-demo/List/Grid/DemoName',
   'Controls/Render/Money/Money',
   'css!Controls-demo/List/Grid/Grid',
   'Controls/scroll',
   'Controls/grid',
], function(Env, BaseControl, GridData, template, source) {
   'use strict';
   var
      fullColumns = [
         {
            displayProperty: 'name',
            width: '100px',
            template: 'wml!Controls-demo/List/Grid/DemoName'
         },
         {
            displayProperty: 'price',
            width: '100px',
            align: 'center',
            valign: 'bottom',
            template: 'wml!Controls-demo/List/Grid/DemoCostPriceFullHeight'
         },
      ],
   data = {
      catalog: [
         {
            id: '463152',
            name: 'Арахисовые лепестки',
            price: null,
         },
         {
            id: '447037',
            name: 'Вода газированная',
            price: null,
         },
         {
            id: '448390',
            name: 'Вафельная крошка ',
            price: null,
         },
         {
            id: '457328',
            name: 'Вода минеральная газ.',
            price: null,
         },
      ]
   },
      ModuleClass = BaseControl.extend({
         _template: template,
         _viewSource: null,
         _columnSource: null,
         gridColumns: null,
         alignedState: null,
         _beforeMount: function() {
            this._viewSource = new source.Memory({
               idProperty: 'id',
               data: data.catalog
            });
            this.gridColumns = fullColumns;
            this.alignedState = 'bottom';
         },
         _onToggleValign: function() {
            if (this.alignedState === 'bottom') {
               this.gridColumns = [
                  {
                     displayProperty: 'name',
                     width: '100px',
                     template: 'wml!Controls-demo/List/Grid/DemoName'
                  },
                  {
                     displayProperty: 'price',
                     width: '100px',
                     align: 'center',
                     valign: 'top',
                     template: 'wml!Controls-demo/List/Grid/DemoCostPriceFullHeight'
                  },
               ];
               this.alignedState = 'top';
            } else {
               this.gridColumns = fullColumns;
               this.alignedState = 'bottom';
            }
         }
      });

   return ModuleClass;
});
