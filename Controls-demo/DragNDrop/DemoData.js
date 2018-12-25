define('Controls-demo/DragNDrop/DemoData', ['Controls-demo/DragNDrop/Images'],
   function(Images) {
      'use strict';

      return [{
         id: 0,
         title: 'not draggable item ',
         image: Images[0],
         'Раздел@': true,
         'Раздел': null
      }, {
         id: 1,
         title: 'draggable item 1',
         additional: 'Additional text 0',
         image: Images[1],
         'Раздел@': true,
         'Раздел': null
      }, {
         id: 2,
         title: 'draggable item 2',
         image: Images[2],
         'Раздел@': true,
         'Раздел': null
      }, {
         id: 3,
         title: 'draggable item 3',
         additional: 'Additional text 3',
         image: Images[3],
         'Раздел@': null,
         'Раздел': null
      }, {
         id: 4,
         title: 'draggable item 4',
         additional: 'Additional text 4',
         image: Images[4],
         'Раздел@': null,
         'Раздел': null
      }, {
         id: 5,
         title: 'draggable item 5',
         additional: 'Additional text 6',
         image: Images[5],
         'Раздел@': null,
         'Раздел': null
      }, {
         id: 6,
         title: 'draggable item 6',
         additional: 'Additional text 6',
         image: Images[6],
         'Раздел@': true,
         'Раздел': 0
      }, {
         id: 7,
         title: 'draggable item 7',
         additional: 'Additional text 7',
         image: Images[7],
         'Раздел@': true,
         'Раздел': 6
      }, {
         id: '8',
         title: 'draggable item 8',
         additional: 'Additional text 8',
         image: Images[8],
         'Раздел@': null,
         'Раздел': 7
      }, {
         id: 9,
         title: 'draggable item 9',
         additional: 'Additional text 9',
         image: Images[9],
         'Раздел@': null,
         'Раздел': 1
      }];
   });
