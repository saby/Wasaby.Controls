define('Controls-demo/List/DocWI/GridHeader', [
   'Core/Control',
   'wml!Controls-demo/List/DocWI/resources/GridHeader',
   'Types/source'
], function (Control, template, sourceLib) {
   'use strict';

   var srcData = [
      {
         id: 1,
         title: 'Prague',
         country: 'Czech Republic'
      },
      {
         id: 2,
         title: 'Moscow',
         country: 'Russia'
      },
      {
         id: 3,
         title: 'London',
         country: 'United Kingdom'
      },
      {
         id: 4,
         title: 'Jakarta',
         country: 'Indonesia'
      }
   ];

   var Module = Control.extend(
      {
         _template: template,
         _viewSource: null,
         _columns: null,

         _beforeMount: function(newOptions) {
            this._viewSource = new sourceLib.Memory({
               keyProperty: 'id',
               data: srcData
            });

            this._columns = [
               {
                  displayProperty: 'country'
               },
               {
                  displayProperty: 'title'
               }
            ];

            this._header = [
               {
                  title: 'Country'
               },
               {
                  title: 'Capital'
               }
            ];
         }
      });
   return Module;
});
