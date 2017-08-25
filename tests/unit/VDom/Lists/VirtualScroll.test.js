define([
      'js!WSControls/Lists/VirtualScroll'
   ],
   function(
      VirtualScroll
   ) {

      'use strict';

      describe('WSControls.VirtualScroll', function () {

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
                        maxItems: 15,
                        pageSize: 5
                     });
                     for (var j = 0; j < testCases[i].removeAt.length; j++) {
                        vs.setState(testCases[i].initialState.dataBounds, testCases[i].initialState.virtualWindow);
                        vs.onItemRemoved(testCases[i].removeAt[j]);
                        assert.equal(vs._dataRange[0], resultBounds[0]);
                        assert.equal(vs._dataRange[1], resultBounds[1]);
                        assert.equal(vs._virtualWindow[0], testCases[i].resultWindow[j][0]);
                        assert.equal(vs._virtualWindow[1], testCases[i].resultWindow[j][1]);
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
                        maxItems: 15,
                        pageSize: 5
                     });
                     for (var j = 0; j < testCases[i].addAt.length; j++) {
                        vs.setState(testCases[i].initialState.dataBounds, testCases[i].initialState.virtualWindow);
                        vs.onItemAdded(testCases[i].addAt[j]);
                        assert.equal(vs._dataRange[0], resultBounds[0]);
                        assert.equal(vs._dataRange[1], resultBounds[1]);
                        assert.equal(vs._virtualWindow[0], testCases[i].resultWindow[j][0]);
                        assert.equal(vs._virtualWindow[1], testCases[i].resultWindow[j][1]);
                     }
                  });
               })(i);

            }
         });

         describe('Window reach bottom', function() {

         });

         describe('Window reach top', function() {

         });

         describe('New data added', function () {

         });

      });
   });