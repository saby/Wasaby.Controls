define('Controls-demo/List/Grid/HeaderTransparent', [
   'Core/Control',
   'Controls-demo/List/Grid/GridData',
   'wml!Controls-demo/List/Grid/HeaderTransparent',
   'Types/source'
], function(BaseControl, GridData, template, source) {
   'use strict';
   var
       partialColumns = [
          {
             displayProperty: 'name',
             width: '300px'
          },
          {
             displayProperty: 'price',
             width: 'auto',
             align: 'right'
          }
       ],
       partialHeader = [
          {
             title: ''
          },
          {
             title: 'Цена',
             align: 'right'
          }
       ],

       ModuleClass = BaseControl.extend({
          _template: template,
          _viewSource: null,
          gridColumns: null,
          gridHeader: null,
          _beforeMount: function() {
             this._viewSource = new source.Memory({
                idProperty: 'id',
                data: GridData.catalog
             });
             this.gridColumns = partialColumns;
             this.gridHeader = partialHeader;
          }
       });

   return ModuleClass;
});
