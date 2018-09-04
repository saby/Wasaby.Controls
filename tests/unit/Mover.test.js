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
define(['SBIS3.CONTROLS/ListView/resources/Mover',
   'WS.Data/MoveStrategy/IMoveStrategy',
   'Core/Abstract',
   'Core/Deferred',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Display/Display',
   'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/List',
   'SBIS3.CONTROLS/Mixins/DragAndDropMixin/DragEntity/Row',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/List'
], function (Mover, IMoveStrategy, Abstract, Deferred, RecordSet, Display, DragList, DragRow, Model, List) {

   'use strict';
   var moverWithMS,
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
      items,
      treeItems,
      projection,
      treeMoverWithMS,
      mover,
      treeMover;

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
            {'id': 6, title: 'Четыре', parent: 4, 'parent@': null},
            {'id': 7, title: 'Четыре', parent: 4, 'parent@': true},
            {'id': 8, title: 'Четыре', parent: 7, 'parent@': true}
         ],
         idProperty: 'id'
      });
      projection = Display.getDefaultDisplay(items);
      mover = new Mover({
         items: items,
         projection: projection
      });
      treeMover = new Mover({
         items: treeItems,
         projection: projection,
         parentProperty: 'parent',
         nodeProperty: 'parent@'
      });
      treeMoverWithMS = new Mover({
         moveStrategy: (new MoveStrategy()),
         items: treeItems,
         projection: projection,
         parentProperty: 'parent',
         nodeProperty: 'parent@'
      });
      moverWithMS = new Mover({
         moveStrategy: (new MoveStrategy()),
         items: items,
         projection: projection
      });

   });
   describe('SBIS3.CONTROLS/ListView/resources/Mover', function () {

      describe('.moveRecordDown', function (){
         it('should move a record to down on one row with use move strategy', function(){
            moverWithMS.moveRecordDown(items.at(0));
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [items.at(0)]);
            assert.equal(arg[1], items.at(1));
            assert.isTrue(arg[2]);
         });

         it('should move a record to down on one row', function(){
            var item = items.at(0);
            mover.moveRecordDown(items.at(0));
            assert.equal(items.at(1).getId(), item.getId());
         });
      });

      describe('.moveRecordUp', function (){
         it('should move a record to up on one row with use move strategy', function(){
            moverWithMS.moveRecordUp(items.at(1));
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [items.at(1)]);
            assert.equal(arg[1], items.at(0));
            assert.isFalse(arg[2]);
         });

         it('should move a record to up on one row', function(){
            var item = items.at(0);
            mover.moveRecordDown(items.at(0));
            assert.equal(items.at(1).getId(), item.getId());
         });
      });

      describe('.getItems', function (){
         it('should return the own items', function(){
            assert.equal(moverWithMS.getItems(), items);
         });
      });

      describe('.setItems', function (){
         it('should set items', function(){
            var items = [];
            mover.setItems(items);
            assert.equal(mover.getItems(), items);
         });
      });

      describe('.isEnabled', function (){
         it('should return true by default', function(){
            assert.equal(mover.isEnabled(), true);
         });
      });

      describe('.setEnabled', function (){
         it('should set enabled', function(){
            mover.setEnabled(false);
            assert.isFalse(mover.isEnabled());
         });
      });

      describe('.getItemsProjection', function (){
         it('should return the own projection', function(){
            assert.equal(mover.getItemsProjection(), projection);
         });
      });

      describe('.setItemsProjection', function (){
         it('should return the own projection', function(){
            var projection = [];
            mover.setItemsProjection(projection);
            assert.equal(mover.getItemsProjection(), projection);
         });
      });

      describe('.move', function () {
         context('use move strategy',  function () {
            it('should move a record after another record', function(){
               moverWithMS.move([items.at(0)], items.at(2), 'after');
               var arg = MoveStrategy.lastCall.arguments;
               assert.deepEqual(arg[0], [items.at(0)]);
               assert.equal(arg[1], items.at(2));
               assert.isTrue(arg[2]);
            });

            it('should move a record before another record', function(){
               moverWithMS.move([items.at(2)], items.at(0), 'before');
               var arg = MoveStrategy.lastCall.arguments;
               assert.deepEqual(arg[0], [items.at(2)]);
               assert.equal(arg[1], items.at(0));
               assert.isFalse(arg[2]);
            });

            it('should move a record into folder', function(){
               treeMoverWithMS.move([treeItems.at(1)], treeItems.at(0), 'on');
               var arg = MoveStrategy.lastCall.arguments;
               assert.deepEqual(arg[0], [treeItems.at(1)]);
               assert.equal(arg[1], treeItems.at(0));
               assert.isTrue(MoveStrategy.lastCall.hierarсhy);
            });
         });
         context('without move strategy',  function () {
            it('should move a record after another record', function(){
               var id = items.at(0).getId();
               mover.move([items.at(0)], items.at(2), 'after');
               assert.equal(items.at(2).getId(), id);
            });

            it('should move a record before another record', function(){
               var id = items.at(2).getId();
               mover.move([items.at(2)], items.at(0), 'before');
               assert.equal(items.at(0).getId(), id);
            });

            it('should move a record into folder', function(){
               treeMover.move([treeItems.at(1)], treeItems.at(0), 'on');
               assert.equal(treeItems.at(1).get('parent'), treeItems.at(0).getId());
            });

            it('should move a record into folder before another record', function(){
               var id = treeItems.at(1).getId();
               treeMover.move([treeItems.at(1)], treeItems.at(5), 'before');
               assert.equal(treeItems.at(4).getId(), id, 'order');
               assert.equal(treeItems.at(4).get('parent'), treeItems.at(5).get('parent'), 'hier');
            });

            it('should return false if move a folder into the own child', function(done){
               treeMover.move([treeItems.at(0)], treeItems.at(4), 'on').addCallback(function(result){
                  assert.isFalse(result);
                  done();
               });
            });

            it('should return false if move path exists this id', function(done){
               treeItems.setMetaData({
                  path: new RecordSet({
                     rawData: [{'id': 2}],
                     idProperty: 'id'
                  })
               });
               treeMover.move([treeItems.at(1)], treeItems.at(0), 'on').addCallback(function(result){
                  assert.isFalse(result);
                  done();
               });
            });

            it('should move a record before another record if target is id', function(){
               var id = items.at(2).getId();
               mover.move([items.at(2)], items.at(0).getId(), 'before');
               assert.equal(items.at(0).getId(), id);
            });

            it('should not move item if it move in his child', function(done){
               treeMover.move([treeItems.at(0)], treeItems.at(6), 'on').addCallback(function(result){
                  assert.equal(treeItems.at(0).get('parent'), null);
                  done();
               });
            });

            it('should not move if mover is disabled', function(){
               mover.setEnabled(false);
               var id = items.at(2).getId();
               mover.move([items.at(2)], items.at(0).getId(), 'before');
               assert.equal(items.at(2).getId(), id);
            });
         });
      });
      describe('onBeginMove', function () {
         it('should trigger onBeginMove', function(done) {
            mover.subscribe('onBeginMove', function () {
               done();
            });
            mover.move([items.at(0)], items.at(2), 'after');
         });
         it('should cancel move', function() {
            var id = items.at(0).getId();
            mover.subscribe('onBeginMove', function (e) {
               return e.setResult('Custom');
            });
            mover.move([items.at(0)], items.at(2), 'after');
            assert.equal(id, items.at(0).getId());
         });
         it('should cancel move if it return deffered and it return custom', function() {
            var id = items.at(0).getId();
            mover.subscribe('onBeginMove', function (e) {
               e.setResult(new Deferred().callback('Custom'));
            });
            mover.move([items.at(0)], items.at(2), 'after');
            assert.equal(id, items.at(0).getId());
         });
         it('should not call move method if it return MoveInItems', function() {
            var id = items.at(0).getId(),
               mover = new Mover({
                  items: items,
                  projection: projection,
                  dataSource: {
                     move: function () {
                        throw new Error('move must not be called');
                     }
                  }
               });
            mover.subscribe('onBeginMove', function(e) {
               e.setResult('MoveInItems');
            });
            mover.move([items.at(0)], items.at(2), 'after');
            assert.equal(items.at(2).getId(), id);
         });
         it('should not call move method if it returns deffered that returns MoveInItems', function() {
            var id = items.at(0).getId(),
               mover = new Mover({
                  items: items,
                  projection: projection,
                  dataSource: {
                     move: function () {
                        throw new Error('move must not be called');
                     }
                  }
               });
            mover.subscribe('onBeginMove', function(e) {
               e.setResult(new Deferred().callback('MoveInItems'));
            });
            mover.move([items.at(0)], items.at(2), 'after');
            assert.equal(items.at(2).getId(), id);
         });
      });
      describe('_checkRecordForMove', function () {
         it('should return false if target undefined', function(){
            assert.isFalse(mover._checkRecordForMove(items.at(0), undefined, 'before'));
         });
         it('should return false if target doesnt folder', function(){
            assert.isFalse(mover._checkRecordForMove(items.at(0), items.at(1), 'on'));
         });
         it('should return false if move on himself', function(){
            assert.isFalse(treeMover._checkRecordForMove(treeItems.at(0), treeItems.at(0), 'on'));
         });
         it('should return true if move on folder', function(){
            assert.isTrue(treeMover._checkRecordForMove(treeItems.at(0), treeItems.at(1), 'on'));
         });
         it('should return true if move before item', function(){
            assert.isTrue(mover._checkRecordForMove(items.at(1), items.at(0), 'before'));
         });
         it('should return true if move after item', function(){
            assert.isTrue(mover._checkRecordForMove(items.at(0), items.at(1), 'after'));
         });
         it('should return false if record stay in place', function(){
            assert.isFalse(mover._checkRecordForMove(items.at(0), items.at(1), 'before'));
         });
         it('should return true if record has not existed from recordset', function(){
            assert.isTrue(mover._checkRecordForMove(items.at(0), items.at(1).clone(), 'before'));
         });
         it('should return false if it moved record and recordParent', function(){
            assert.isFalse(treeMover._checkRecordForMove(treeItems.at(3), items.at(1), 'before', [treeItems.at(0), treeItems.at(3)]));
         });
      });
      describe('onEndMove', function () {
         it('should trigger onEndMove', function(done) {
            mover.subscribe('onEndMove', function () {
               done();
            });
            mover.move([items.at(0)], items.at(2), 'after');
         });
         it('should trigger onEndMove if move method return error', function(done) {
            var mover = new Mover({
               items: items,
               projection: projection,
               dataSource: {
                  move: function () {
                     return Deferred.fail();
                  }
               }
            });
            mover.subscribe('onEndMove', function (e, result) {
               result.processed = true;//не надо показывать окно с ошибкой в тестах
               done();
            });
            mover.move([items.at(0)], items.at(2), 'after');
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
            treeMoverWithMS.moveFromOutside(list, targetRow, outsideRs, true);
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [list.at(0).getModel()]);
            assert.equal(arg[1], targetRow.getModel());
            assert.isTrue(arg[2]);
         });

         it('should move the source row before target', function(){
            targetRow.setPosition('after');
            treeMoverWithMS.moveFromOutside(list, targetRow, outsideRs, true);
            var arg = MoveStrategy.lastCall.arguments;
            assert.deepEqual(arg[0], [list.at(0).getModel()]);
            assert.equal(arg[1], targetRow.getModel());
            assert.isTrue(arg[2]);
         });

         it('should move the source row on target', function(){
            targetRow.setPosition('on');
            treeMoverWithMS.moveFromOutside(list, targetRow, outsideRs, true);
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
            treeMoverWithMS.moveFromOutside(listAction, targetRow, outsideRs, true);
         });

         it('should move the source row with operation is move after target', function(){
            targetRow.setPosition('after');
            listAction.setOperation('move');
            treeMoverWithMS.moveFromOutside(listAction, targetRow, outsideRs, true);
            var model = listAction.at(0).getModel();
            assert.equal(outsideRs.getIndex(model), -1);
            assert.equal(treeItems.getIndex(treeItems.getRecordById(model.getId())), 1);
         });

         it('should move the source row with operation is move before target', function(){
            targetRow.setPosition('before');
            listAction.setOperation('move');
            treeMoverWithMS.moveFromOutside(listAction, targetRow, outsideRs, true);
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
            treeMoverWithMS.moveFromOutside(listAction, targetRow, outsideRs, true);
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
            treeMoverWithMS.moveFromOutside(listAction, targetRow, outsideRs, true);
            assert.equal(outsideRs.getIndex(model), -1);
            assert.equal(treeItems.getIndex(treeItems.getRecordById(model.getId())), treeItems.getCount()-1);
         });

         it('should not move the source row into target if target doesnt node', function(){
            targetRow.setPosition('on');
            targetRow.setModel(treeItems.getRecordById(6));
            var count = treeItems.getCount();
            treeMoverWithMS.moveFromOutside(list, targetRow, outsideRs, true);
            assert.equal(count, treeItems.getCount());
         });

         it('should add model when collection is list', function(){
            var model = new Model(),
               targetmodel = new Model(),
               targetRow = new DragRow({
                  model: targetmodel,
                  position: 'after'
               }),
               list = new List({
                  items: [model]
               }),
               mover = new Mover({
                  items: list,
                  projection: projection
               });
            listAction.setOperation('add');
            listAction.setAction(function () {
               return true;
            });
            mover.moveFromOutside(listAction, targetRow, undefined, true);
            assert.equal(list.getCount(), 2);
         });

         it('should not move the source row if default move off', function(){
            targetRow.setPosition('after');
            var count = treeItems.getCount();
            treeMover.moveFromOutside(list, targetRow, outsideRs, false);
            assert.equal(count, treeItems.getCount());
         });
         it('should not move the source row if a onbeginmove returns cutsom', function(){
            targetRow.setPosition('after');
            var count = treeItems.getCount();
            treeMover.subscribe('onBeginMove', function (e) {
               e.setResult('Custom');
            });
            treeMover.moveFromOutside(list, targetRow, outsideRs, true);
            assert.equal(count, treeItems.getCount());
         });
      });
      describe('._getDataSource', function () {
         it('should return datasource', function() {
            var dataSource = {},
               mover = new Mover({
                  items: items,
                  projection: projection,
                  dataSource: dataSource
               });
            assert.equal(mover._getDataSource(), dataSource);
         })
      });

      describe('.setMoveStrategy', function () {
         it('should set movestrategy', function() {
            var moveStrategy = {},
               mover = new Mover({
                  items: items,
                  projection: projection
               });
            mover.setMoveStrategy(moveStrategy);
            assert.equal(mover.getMoveStrategy(), moveStrategy);
         })
      });

      describe('._callMoveMethod', function () {
         it('should call return datasource', function(done) {
            var dataSource = {},
               movedItems = [1,2],
               target = null,
               position = 'on',
               mover = new Mover({
                  items: items,
                  projection: projection,
                  dataSource: {
                     move: function (argMovedItems, argTarget, meta) {
                        assert.deepEqual(argMovedItems, movedItems);
                        assert.equal(argTarget, target);
                        assert.equal(meta.position, position);
                        done();
                        return new Deferred().callback();
                     }
                  }
               });
            mover._callMoveMethod(movedItems, target, position);
         })
      });

      describe('._moveInItems', function () {
         it('should add item if it not exist into items', function() {
            var item = new Model({
                  rawData: {'id': 121, title: 'Один'}
               });
            mover._moveInItems([item], items.at(0), 'before');
            assert.equal(items.at(0).getId(), 121);
         });
         it('should add item if it not exist into items and it move on hierarchy', function() {
            var item = new Model({
               rawData: {'id': 121, title: 'Один', parent: null, 'parent@': true}
            });
            treeMover._moveInItems([item], treeItems.at(0), 'on');
            assert.equal(treeItems.getRecordById('121').get('parent'), treeItems.at(0).getId());
         });
      });
      describe('._getParentsMap', function () {
         it('should return map if tree has wrong structure', function () {
            var mover = new Mover({
               parentProperty: 'parent',
               items: new RecordSet({
                  rawData: [
                     {'id': 1, title: 'Один', parent: 1, 'parent@': true},
                     {'id': 2, title: 'Два', parent: 1, 'parent@': true},
                     {'id': 3, title: 'Три', parent: 2, 'parent@': true}
                  ],
                  idProperty: 'id'
               })
            });
            assert.deepEqual(mover._getParentsMap(3), ['3', '2', '1']);
         })
      });
   });
});