define([
      'js!Controls/List/VirtualScroll'
   ],
   function(
      VirtualScroll
   ) {

      'use strict';

      describe('WSControls.VirtualScroll', function () {

         /**
          * init()
          */
         describe('Initialization', function() {

            it('Projection larger than window', function () {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  pageSize: 5,
                  maxItems: 15
               });

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 0);
               assert.equal(vs._virtualWindow.end, 15);
            });

            it('Projection smaller than window', function () {
               var vs = new VirtualScroll({
                  itemsLength: 15,
                  pageSize: 5,
                  maxItems: 30
               });

               assert.equal(vs._projectionLength, 15);
               assert.equal(vs._virtualWindow.start, 0);
               assert.equal(vs._virtualWindow.end, 15);
            });
         });

         /**
          * getVirtualWindow()
          */
         describe('Get virtual window', function() {
            it('Return initial virtual window', function () {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  pageSize: 5,
                  maxItems: 15
               });

               var virtualWindow = vs.getVirtualWindow();
               assert.equal(virtualWindow.start, 0);
               assert.equal(virtualWindow.end, 15);
            });
         });

         /**
          * removeAt()
          */
         describe('Remove item from the list', function () {

            var resultBounds = [1, 9],
               testCases = [
               {
                  'name': 'Window same size as data',
                  'initialState': {
                     'dataBounds': [1, 10],
                     'virtualWindow': [1, 10]
                  },
                  'removeAt': [1, 5, 10],
                  'resultWindow': [[1, 9], [1, 9], [1, 9]]
               },
               {
                  'name': 'Window at the beginning of data',
                  'initialState': {
                     'dataBounds': [1, 10],
                     'virtualWindow': [1, 5]
                  },
                  'removeAt': [1, 3, 5, 10],
                  'resultWindow': [[1, 4], [1, 4], [1, 4], [1, 5]]
               },
               {
                  'name': 'Window at the end of data',
                  'initialState': {
                     'dataBounds': [1, 10],
                     'virtualWindow': [5, 10]
                  },
                  'removeAt': [3, 5, 8, 10],
                  'resultWindow': [[4, 9], [5, 9], [5, 9], [5, 9]]
               },
               {
                  'name': 'Window in the middle of data',
                  'initialState': {
                     'dataBounds': [1, 10],
                     'virtualWindow': [3, 8]
                  },
                  'removeAt': [1, 3, 5, 8, 10],
                  'resultWindow': [[2, 7], [3, 7], [3, 7], [3, 7], [3, 8]]
               }
            ];

            for (var i = 0; i < testCases.length; i++) {
               (function(i) {
                  it(testCases[i].name, function () {
                     var vs = new VirtualScroll({
                        itemsLength: 30,
                        maxItems: 15,
                        pageSize: 5
                     });
                     for (var j = 0; j < testCases[i].removeAt.length; j++) {
                        // Prepare state
                        vs._virtualWindow.start = testCases[i].initialState.virtualWindow[0];
                        vs._virtualWindow.end = testCases[i].initialState.virtualWindow[1];
                        vs._projectionLength = testCases[i].initialState.dataBounds[1];

                        vs.onItemRemoved(testCases[i].removeAt[j]);

                        assert.equal(vs._projectionLength, resultBounds[1]);
                        assert.equal(vs._virtualWindow.start, testCases[i].resultWindow[j][0]);
                        assert.equal(vs._virtualWindow.end, testCases[i].resultWindow[j][1]);
                     }
                  });
               })(i);
            }
         });

         /**
          * addAt()
          */
         describe('Add item from the list', function () {
            var resultBounds = [1, 11],
               testCases = [
                  {
                     'name': 'Window same size as data',
                     'initialState': {
                        'dataBounds': [1, 10],
                        'virtualWindow': [1, 10]
                     },
                     'addAt': [1, 5, 10],
                     'resultWindow': [[2, 11], [1, 11], [1, 11]]
                  },
                  {
                     'name': 'Window at the beginning of data',
                     'initialState': {
                        'dataBounds': [1, 10],
                        'virtualWindow': [1, 5]
                     },
                     'addAt': [1, 3, 5, 10],
                     'resultWindow': [[2, 6], [1, 6], [1, 6], [1, 5]]
                  },
                  {
                     'name': 'Window at the end of data',
                     'initialState': {
                        'dataBounds': [1, 10],
                        'virtualWindow': [5, 10]
                     },
                     'addAt': [3, 5, 8, 10],
                     'resultWindow': [[6, 11], [6, 11], [5, 11], [5, 11]]
                  },
                  {
                     'name': 'Window in the middle of data',
                     'initialState': {
                        'dataBounds': [1, 10],
                        'virtualWindow': [3, 8]
                     },
                     'addAt': [1, 3, 5, 8, 10],
                     'resultWindow': [[4, 9], [4, 9], [3, 9], [3, 9], [3, 8]]
                  }
               ];

            for (var i = 0; i < testCases.length; i++) {
               (function(i) {
                  it(testCases[i].name, function () {
                     var vs = new VirtualScroll({
                        itemsLength: 30,
                        maxItems: 15,
                        pageSize: 5
                     });
                     for (var j = 0; j < testCases[i].addAt.length; j++) {
                        // Setup state
                        vs._virtualWindow.start = testCases[i].initialState.virtualWindow[0];
                        vs._virtualWindow.end = testCases[i].initialState.virtualWindow[1];
                        vs._projectionLength = testCases[i].initialState.dataBounds[1];

                        vs.onItemAdded(testCases[i].addAt[j]);
                        assert.equal(vs._projectionLength, resultBounds[1]);
                        assert.equal(vs._virtualWindow.start, testCases[i].resultWindow[j][0]);
                        assert.equal(vs._virtualWindow.end, testCases[i].resultWindow[j][1]);
                     }
                  });
               })(i);

            }
         });

         /**
          * _addItemsToWindowStart()
          */
         describe('Add items to window start', function () {
            it('Nothing to add', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  maxItems: 15,
                  pageSize: 5
               });

               vs._addItemsToWindowStart();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 0);
               assert.equal(vs._virtualWindow.end, 15);
            });

            it('Add less than a page without removing items', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  maxItems: 15,
                  pageSize: 5
               });
               vs._virtualWindow.start = 3;
               vs._virtualWindow.end = 15;

               vs._addItemsToWindowStart();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 0);
               assert.equal(vs._virtualWindow.end, 15);
            });

            it('Add less than a page and remove items', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  maxItems: 15,
                  pageSize: 5
               });
               vs._virtualWindow.start = 3;
               vs._virtualWindow.end = 18;

               vs._addItemsToWindowStart();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 0);
               assert.equal(vs._virtualWindow.end, 15);
            });

            it('Add a page', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  maxItems: 15,
                  pageSize: 5
               });
               vs._virtualWindow.start = 10;
               vs._virtualWindow.end = 25;

               vs._addItemsToWindowStart();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 5);
               assert.equal(vs._virtualWindow.end, 20);
            });
         });

         /**
          * _addItemsToWindowEnd()
          */
         describe('Add items to window end', function () {
            it('Nothing to add', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  pageSize: 5,
                  maxItems: 15
               });
               vs._virtualWindow.start = 15;
               vs._virtualWindow.end = 30;

               vs._addItemsToWindowEnd();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 15);
               assert.equal(vs._virtualWindow.end, 30);
            });

            it('Add less than a page without removing items', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  maxItems: 15,
                  pageSize: 5
               });
               vs._virtualWindow.start = 15;
               vs._virtualWindow.end = 27;

               vs._addItemsToWindowEnd();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 15);
               assert.equal(vs._virtualWindow.end, 30);
            });

            it('Add less than a page and remove items', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  maxItems: 15,
                  pageSize: 5
               });
               vs._virtualWindow.start = 13;
               vs._virtualWindow.end = 28;

               vs._addItemsToWindowEnd();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 15);
               assert.equal(vs._virtualWindow.end, 30);
            });

            it('Add a page', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  maxItems: 15,
                  pageSize: 5
               });
               vs._virtualWindow.start = 5;
               vs._virtualWindow.end = 20;

               vs._addItemsToWindowEnd();

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 10);
               assert.equal(vs._virtualWindow.end, 25);
            });
         });

         /**
          * updateWindowOnTrigger()
          */
         describe('Update window on trigger', function () {
            // TODO: change if notify was executed
            it('Nothing to add to start', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  pageSize: 5,
                  maxItems: 15
               });

               vs.updateWindowOnTrigger('top');

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 0);
               assert.equal(vs._virtualWindow.end, 15);
            });

            it('Nothing to add to end', function() {
               var vs = new VirtualScroll({
                  itemsLength: 30,
                  pageSize: 5,
                  maxItems: 15
               });
               vs._virtualWindow.start = 10;
               vs._virtualWindow.end = 25;

               vs.updateWindowOnTrigger('bottom');

               assert.equal(vs._projectionLength, 30);
               assert.equal(vs._virtualWindow.start, 15);
               assert.equal(vs._virtualWindow.end, 30);
            });
         });
      });
   });