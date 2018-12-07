define('Controls-demo/List/Grid/Ladder', [
   'Core/Control',
   'wml!Controls-demo/List/Grid/resources/Ladder/Ladder',
   'Controls-demo/List/Grid/GridData',
   'WS.Data/Source/Memory',

   'css!Controls-demo/List/Grid/resources/Ladder/Ladder',

   'Controls/Container/Scroll',
   'Controls/Grid',
   'Controls/Render/Money/Money',

   'Controls/Container/Data',
   'Controls/Container/MultiSelector',

   'wml!Controls-demo/List/Grid/resources/Ladder/TasksPhoto',
   'wml!Controls-demo/List/Grid/resources/Ladder/TasksDescr',
   'wml!Controls-demo/List/Grid/resources/Ladder/TasksReceived'
], function(BaseControl, template, GridData, MemorySource) {
   'use strict';
   var

      ModuleClass = BaseControl.extend({
         _template: template,
         _viewSource: null,
         _viewColumns: null,
         _selectedKeys: null,
         _stickyColumn: {
            index: 0,
            property: 'photo'
         },
         _ladderProperties: [
            'photo',
            'date'
         ],

         _beforeMount: function() {
            this._selectedKeys = [];

            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: GridData.tasks
            });

            this._viewColumns = [
               {
                  template: 'wml!Controls-demo/List/Grid/resources/Ladder/TasksPhoto',
                  width: '98px'
               },
               {
                  template: 'wml!Controls-demo/List/Grid/resources/Ladder/TasksDescr',
                  width: '1fr'
               },
               {
                  template: 'wml!Controls-demo/List/Grid/resources/Ladder/TasksReceived',
                  width: 'auto'
               }
            ];
         }
      });

   return ModuleClass;
});
