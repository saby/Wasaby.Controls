define('Controls-demo/List/TreeGrid/resources/DataDemoPG', [],
   function() {
   var data = {
      headerColumns: [
         {
            title: 'Gadget name',
            width: 'auto'
         }
      ],
      catalog: [
         {
            id: 1,
            parent: null,
            type: null,
            title: 'USB-hub',
            group: 'PC accessories'
         },
         {
            id: 2,
            parent: null,
            type: true,
            title: 'Keyboard',
            group: 'PC accessories'
         },
         {
            id: 3,
            parent: null,
            type: true,
            title: 'Watches',
            group: 'Gadgets'
         },
         {
            id: 4,
            parent: 3,
            type: false,
            title: 'Apple',
            group: 'Gadgets'
         },
         {
            id: 5,
            parent: 4,
            type: null,
            title: 'Apple Watch 1',
            group: 'Gadgets'
         },
         {
            id: 6,
            parent: 4,
            type: null,
            title: 'Apple Watch 2',
            group: 'Gadgets'
         },
         {
            id: 7,
            parent: 3,
            type: null,
            title: 'Samsung Watch',
            group: 'Gadgets'
         },
         {
            id: 8,
            parent: 2,
            type: true,
            title: 'Dell',
            group: 'PC accessories'
         },
         {
            id: 9,
            parent: 8,
            type: false,
            title: 'Wireless',
            group: 'PC accessories'
         },
         {
            id: 10,
            parent: 8,
            type: null,
            title: 'Best KBoard',
            group: 'PC accessories'
         },
         {
            id: 11,
            parent: 9,
            type: null,
            title: 'Best WiFi KBoard',
            group: 'PC accessories'
         }
      ],
      smallCatalog: [
         {
            id: 1,
            parent: null,
            type: true,
            title: 'Apple',
            hasChildren: true
         },
         {
            id: 2,
            parent: 1,
            type: null,
            title: 'iPhone 7',
            hasChildren: false
         },
         {
            id: 3,
            parent: null,
            type: false,
            title: 'Samsung',
            hasChildren: true
         },
         {
            id: 4,
            parent: 3,
            type: null,
            title: 'Galaxy A7',
            hasChildren: false
         }

      ],
      catalogColumns: [
         {
            displayProperty: 'title'
         }
      ]
   };
   return data;
});
