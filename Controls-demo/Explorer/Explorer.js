define('Controls-demo/Explorer/Explorer', [
   'Core/Control',
   'tmpl!Controls-demo/Explorer/Explorer',
   'Controls-demo/Explorer/ExplorerMemory',
   'css!Controls-demo/Explorer/Explorer',
   'Controls/Explorer'
], function(BaseControl, template, MemorySource) {

   'use strict';

   var
      ModuleClass = BaseControl.extend({
         _template: template,
         _viewSource: new MemorySource({
            idProperty: 'id',
            data: [
               {  id: 1,   title: 'Node',         'parent': null, 'parent@': true,  'parent$': null   },
               {  id: 11,  title: 'Node',         'parent': 1,    'parent@': true,  'parent$': null   },
               {  id: 111, title: 'Leaf',         'parent': 11,   'parent@': null,  'parent$': null   },
               {  id: 12,  title: 'Leaf',         'parent': 1,    'parent@': null,  'parent$': null   },
               {  id: 13,  title: 'Hidden node',  'parent': 1,    'parent@': false, 'parent$': true   },
               {  id: 2,   title: 'Empty node',   'parent': null, 'parent@': true,  'parent$': null   },
               {  id: 3,   title: 'Hidden node',  'parent': null, 'parent@': false, 'parent$': true   },
               {  id: 31,  title: 'Leaf',         'parent': 3,    'parent@': null,  'parent$': null   },
               {  id: 4,   title: 'Empty hidden', 'parent': null, 'parent@': false, 'parent$': false  },
               {  id: 5,   title: 'Leaf',         'parent': null, 'parent@': null,  'parent$': null   }
            ]
         }),

         _viewColumns: [
            {
               displayProperty: 'title',
               width: '1fr'
            }
         ]
      });

   return ModuleClass;
});
