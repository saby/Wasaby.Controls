/**
 * Created by ganshinyao on 05.05.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
      'js!SBIS3.CONTROLS.Action.List.ReorderMove',
      'js!SBIS3.CONTROLS.Data.Source.Memory',
      'js!SBIS3.CONTROLS.Data.Query.Query',
      'js!SBIS3.CONTROLS.Data.Projection.Projection'
   ],
   function (NearestMove, Memory, Query, Projection) {
      'use strict';

      describe('SBIS3.CONTROLS.Action.ListViewMove.OrderMove', function () {
         var moveAction,
            listView,
            dataSource,
            recordSet = {},
            itemsProjection = {};

         beforeEach(function () {
            dataSource = new Memory({
               data: [
                  {
                     id: 1,
                     title: 'Title 1',
                     flag: true,
                     Parent: null,
                     'Parent@': true
                  },
                  {
                     id: 2,
                     title: 'Title 2',
                     flag: false,
                     Parent: null
                  },
                  {
                     id: 3,
                     title: 'Title 3',
                     flag: true,
                     Parent: 1,
                     'Parent@': true
                  },
                  {
                     id: 4,
                     title: 'Title 4',
                     flag: true,
                     Parent: 3
                  },
                  {
                     id: 5,
                     title: 'Title 5',
                     flag: true,
                     Parent: null
                  },
                  {
                     id: 6,
                     title: 'Title 6',
                     flag: true,
                     Parent: null
                  }
               ],
               idProperty: 'id'
            });
            dataSource.query(new Query()).addCallback(function(ds){
               recordSet = ds.getAll();
            });
            itemsProjection = Projection.getDefaultProjection(recordSet);
            listView = {
               getDataSource: function (){
                  return dataSource;
               },
               getItems: function (){
                  return recordSet;
               },
               _itemsProjection: itemsProjection
            };
            moveAction = new NearestMove({
               linkedObject: listView,
               moveDirection: 'up'
            });
         });

         describe('.execute()', function () {
            it('should move row with id 2 to up', function () {
               moveAction = new NearestMove({
                  linkedObject: listView,
                  moveDirection: 'up'
               });
               moveAction.execute({from:listView.getItems().at(1)});
               assert.equal(dataSource._options.data[0].id, 2);
            });

            it('should move row with id 2 to down', function () {
               moveAction = new NearestMove({
                  linkedObject: listView,
                  moveDirection: 'down'
               });
               moveAction.execute({from:listView.getItems().at(1)});
               assert.equal(dataSource._options.data[2].id, 2);
            });
         });

      });
   }
);
