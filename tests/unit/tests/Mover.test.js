/**
 * Created by ganshinyao on 18.11.2016.
 */
/**
 * Created by am.gerasimov on 18.10.2016.
 */
/**
 * Created by am.gerasimov on 12.10.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.ListView.Mover',
   'js!WS.Data/MoveStrategy/IMoveStrategy',
   'Core/Abstract',
   'Core/Deferred',
   'js!WS.Data/Collection/RecordSet',
   'js!WS.Data/Display/Display',
   'js!SBIS3.CONTROLS.DragEntity.List',
   'js!SBIS3.CONTROLS.DragEntity.Row'
], function (Mover, IMoveStrategy, Abstract, Deferred, RecordSet, Display, DragList, DragRow) {

   'use strict';
   var mover,
      MoveStrategy = Abstract.extend([IMoveStrategy], {
         move: function(){
            MoveStrategy.lastCall = {arguments: arguments, order: true};
            return new Deferred().callback(true);
         },
         hierarchyMove: function(){
            MoveStrategy.lastCall = {arguments: arguments, hierarсhy: true};
            return new Deferred().callback(true);
         }
      }),
      items, treeItems, projection, treeMover;

   beforeEach(function () {
      items = new RecordSet({
         rawData: [
            {'id': 1, title: 'Один'},
            {'id': 2, title: 'Два'},
            {'id': 3, title: 'Три'},
            {'id': 4, title: 'Четыре'}
         ],
         idProperty: 'id'
      });
      treeItems = new RecordSet({
         rawData: [
            {'id': 1, title: 'Один', parent: null, 'parent@': true},
            {'id': 2, title: 'Два', parent: null, 'parent@': true},
            {'id': 3, title: 'Три', parent: null, 'parent@': true},
            {'id': 4, title: 'Четыре', parent: 1, 'parent@': true},
            {'id': 5, title: 'Четыре', parent: 1, 'parent@': true},
            {'id': 6, title: 'Четыре', parent: 4, 'parent@': false},
            {'id': 7, title: 'Четыре', parent: 4, 'parent@': true},
            {'id': 8, title: 'Четыре', parent: 7, 'parent@': true}
         ],
         idProperty: 'id'
      });
      projection = Display.getDefaultDisplay(items);
      mover = new Mover({
         moveStrategy: (new MoveStrategy()),
         items: items,
         projection: projection
      });
      treeMover = new Mover({
         moveStrategy: (new MoveStrategy()),
         items: treeItems,
         projection: projection,
         parentProperty: 'parent',
         nodeProperty: 'parent@'
      });
   });
   describe('SBIS3.CONTROLS.ListView.Mover', function () {

      describe('.moveRecordDown', function (){
         it('should move a record to down on one row', function(){
            mover.moveRecordDown(items.at(0));
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [items.at(0)]);
            assert.equal(arg[1], items.at(1));
            assert.isTrue(arg[2]);
         });
      });

      describe('.moveRecordUp', function (){
         it('should move a record to up on one row', function(){
            mover.moveRecordUp(items.at(1));
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [items.at(1)]);
            assert.equal(arg[1], items.at(0));
            assert.isFalse(arg[2]);
         });
      });

      describe('.getItems', function (){
         it('should return the own items', function(){
            assert.equal(mover.getItems(), items);
         });
      });

      describe('.getProjection', function (){
         it('should return the own projection', function(){
            assert.equal(mover.getProjection(), projection);
         });
      });

      describe('.move', function () {
         it('should move a record after another record', function(){
            mover.move([items.at(0)], items.at(2), 'after');
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [items.at(0)]);
            assert.equal(arg[1], items.at(2));
            assert.isTrue(arg[2]);
         });

         it('should move a record before another record', function(){
            mover.move([items.at(2)], items.at(0), 'before');
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [items.at(2)]);
            assert.equal(arg[1], items.at(0));
            assert.isFalse(arg[2]);
         });

         it('should move a record into folder', function(){
            treeMover.move([treeItems.at(1)], treeItems.at(0), 'on');
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [treeItems.at(1)]);
            assert.equal(arg[1], treeItems.at(0));
            assert.isTrue(MoveStrategy.lastCall.hierarсhy);
         });

         it('should return false if move a folder into the own child', function(done){
            treeMover.move([treeItems.at(0)], treeItems.at(4), 'on').addCallback(function(result){
               assert.isFalse(result);
               done();
            });
         });

         it('should return false if move path exists this id', function(done){
            treeItems.setMetaData({path:[{'id': 2}]});
            treeMover.move([treeItems.at(1)], treeItems.at(0), 'on').addCallback(function(result){
               assert.isFalse(result);
               done();
            });
         });
      });
      describe('.moveFromOutside', function(){
         var targetRow ,
            sourceRow,
            list,
            outsideRs,
            sourceRowAction,
            listAction;
         beforeEach(function(){
            outsideRs = new RecordSet({
               rawData: [
                  {'id': 25, title: 'Один', parent: null, 'parent@': true},
                  {'id': 26, title: 'Один', parent: null, 'parent@': true}
               ],
               idProperty: 'id'
            });
            targetRow = new DragRow({
               model: treeItems.at(0)
            });
            sourceRow = new DragRow({
               model: outsideRs.at(0)
            });
            list = new DragList({
               items: [sourceRow]
            });
            sourceRowAction = new DragRow({
               model: outsideRs.at(0)
            });
            listAction = new DragList({
               items: [sourceRowAction],
               action: function(){}
            })
         });
         it('should move the source row after target', function(){
            targetRow.setPosition('after');
            treeMover.moveFromOutside(list, targetRow, outsideRs, true);
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [list.at(0).getModel()]);
            assert.equal(arg[1], targetRow.getModel());
            assert.isTrue(arg[2]);
         });

         it('should move the source row before target', function(){
            targetRow.setPosition('after');
            treeMover.moveFromOutside(list, targetRow, outsideRs, true);
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [list.at(0).getModel()]);
            assert.equal(arg[1], targetRow.getModel());
            assert.isTrue(arg[2]);
         });

         it('should move the source row on target', function(){
            targetRow.setPosition('on');
            treeMover.moveFromOutside(list, targetRow, outsideRs, true);
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [list.at(0).getModel()]);
            assert.equal(arg[1], targetRow.getModel());
            assert.isTrue(MoveStrategy.lastCall.hierarсhy);
         });

         it('should trigger action on source row', function(done){
            listAction = new DragList({
               items: [sourceRowAction],
               action: function(){
                  done();
               }
            });
            treeMover.moveFromOutside(listAction, targetRow, outsideRs, true);
         });

         it('should move the source row with operation is move after target', function(){
            targetRow.setPosition('after');
            listAction.setOperation('move');
            treeMover.moveFromOutside(listAction, targetRow, outsideRs, true);
            var model = listAction.at(0).getModel();
            assert.equal(outsideRs.getIndex(model), -1);
            assert.equal(treeItems.getIndex(treeItems.getRecordById(model.getId())), 1);
         });

         it('should move the source row with operation is move before target', function(){
            targetRow.setPosition('before');
            listAction.setOperation('move');
            treeMover.moveFromOutside(listAction, targetRow, outsideRs, true);
            var model = listAction.at(0).getModel();
            assert.equal(outsideRs.getIndex(model), -1);
            assert.equal(treeItems.getIndex(treeItems.getRecordById(model.getId())), 0);
         });

         it('should move the source row with operation is move before last item', function(){
            listAction.setOperation('move');

            var model = listAction.at(0).getModel(),
               targetRow = new DragRow({
                  model: treeItems.at(treeItems.getCount()-1),
                  position: 'before'
               });
            treeMover.moveFromOutside(listAction, targetRow, outsideRs, true);
            assert.equal(outsideRs.getIndex(model), -1);
            assert.equal(treeItems.getIndex(treeItems.getRecordById(model.getId())), treeItems.getCount()-2);
         });

         it('should move the source row with operation is move to last item', function(){
            listAction.setOperation('move');

            var model = listAction.at(0).getModel(),
               targetRow = new DragRow({
                  model: treeItems.at(treeItems.getCount()-1),
                  position: 'after'
               });
            treeMover.moveFromOutside(listAction, targetRow, outsideRs, true);
            assert.equal(outsideRs.getIndex(model), -1);
            assert.equal(treeItems.getIndex(treeItems.getRecordById(model.getId())), treeItems.getCount()-1);
         });

         it('should not move the source row into target if target doesnt node', function(){
            targetRow.setPosition('on');
            targetRow.setModel(treeItems.getRecordById(6));
            var count = treeItems.getCount();
            treeMover.moveFromOutside(list, targetRow, outsideRs, true);
            assert.equal(count, treeItems.getCount());
         });
      });
   });
});