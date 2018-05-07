/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'SBIS3.CONTROLS/ListView',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Source/Memory'
], function (ListView, RecordSet, Memory) {
   'use strict';
   describe('SBIS3.CONTROLS/ListView', function () {
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });
      describe('move', function () {
         it('should trigger onBeginMove', function (done) {
            var target = $('<div><div></div></div>'),
               rs = new RecordSet({
                  rawData: [{id: 1},{id:2}]
               }),
               view = new ListView({
                  container: target,
                  items: rs,
                  idProperty: 'id'
               });
            rs.setEventRaising(false);
            view.subscribe('onBeginMove', function (e, movedItems, target, position) {
               assert.equal(movedItems[0], rs.at(0));
               assert.equal(target, rs.at(1));
               assert.equal(position, 'after');
               done();
            });
            view.move([rs.at(0)], rs.at(1), 'after');
         });
         it('should destroy mover after change data source', function () {
            var target = $('<div><div></div></div>'),
               rs = new RecordSet({
                  rawData: [{id: 1},{id:2}]
               }),
               view = new ListView({
                  container: target,
                  items: rs,
                  idProperty: 'id'
               }),
               dataSource = new Memory({
                  data: [{id: 1}, {id: 2}]
               }),
               mover = view._getMover();
            view.setDataSource(dataSource);
            assert.notEqual(view._getMover(), mover)
         });
      });
      describe('onEndMove', function () {
         it('should trigger onEndMove', function (done) {
            var target = $('<div><div></div></div>'),
               rs = new RecordSet({
                  rawData: [{id: 1}, {id: 2}]
               }),
               view = new ListView({
                  container: target,
                  items: rs,
                  idProperty: 'id'
               });
            rs.setEventRaising(false);
            view.subscribe('onEndMove', function (e, result, movedItems, target, position) {
               assert.equal(movedItems[0], rs.at(1));
               assert.equal(target, rs.at(0));
               assert.equal(position, 'after');
               done();
            });
            view.move([rs.at(0)], rs.at(1), 'after');
         });
      });
      describe('setItemsDragNDrop', function () {
         it('should set items dragnrop', function () {
            var elem = $('<div></div>'),
               view = new ListView({
                  container: elem,
                  items: []
               });
            view.setItemsDragNDrop(true);
            assert.equal(view.getItemsDragNDrop(), true);
         });
      });
      describe('getItemsDragNDrop', function () {
         it('should return items dragnrop', function () {
            var elem = $('<div></div>'),
               view = new ListView({
                  container: elem,
                  itemsDragNDrop: 'allow',
                  items: []
               });
            assert.equal(view.getItemsDragNDrop(), 'allow');
         })
      });
      describe('updateSelectedIndex', function () {
         it('check selectedIndex after reload', function () {
            var dataSource = new Memory({
                  data: [{id: 1}, {id: 2}]
               }),
               elem = $('<div></div>').appendTo('body'),
               view = new ListView({
                  element:  elem,
                  dataSource: dataSource,
                  idProperty: 'id'
               });
            view.setSelectedIndex(0);
            view.reload();
            assert.equal(view._getItemsProjection().getCurrentPosition(), 0);
            view.destroy();
         })
      });

      describe('setSelectedItemsAll', function () {
         it('same keys', function () {
            var view = new ListView({
               items: [{id: 1}, {id: 1}],
               multiselectable: true,
               idProperty: 'id'
            });
            view.setSelectedItemsAll();
            assert.deepEqual(view.getSelectedKeys(), [1]);
            view.destroy();
         });
      });
   
      describe('change recordset', function () {
         it('change IdProperty', function () {
            var dataSource = new Memory({
                  data: [{id: 1}, {id: 2}]
               }),
               elem = $('<div></div>').appendTo('body'),
               view = new ListView({
                  element:  elem,
                  dataSource: dataSource,
                  idProperty: 'id'
               });
            view.getItems().setIdProperty('test');
            assert.equal(view.getItems().getIdProperty(), 'test');
         })
      });
      describe('_toggleIndicator', function () {
         let _this;

         beforeEach(function () {
            _this = {
               isDestroyed: function () {
                  return false;
               },
               _showLoadingOverlay: sinon.spy(),
               _showIndicator: sinon.spy(),
               _hideLoadingOverlayAndIndicator: sinon.spy()
            };
            // Почему то приводит к падениям других тестов. Мокаем таймеры в каждом тесте по месту
            // clock = sinon.useFakeTimers((new Date()).getTime(), 'setTimeout', 'clearTimeout');
         });

         // afterEach(function () {
         //    clock.restore();
         // });

         it('should call _showIndicator once on multiple execution', function () {
            let clock = sinon.useFakeTimers((new Date()).getTime(), 'setTimeout', 'clearTimeout');
            ListView.prototype._toggleIndicator.call(_this, true);
            assert.isDefined(_this._loadingIndicatorTimer);
            ListView.prototype._toggleIndicator.call(_this, true);
            clock.tick(1000);
            assert(_this._showLoadingOverlay.called);
            assert(_this._showIndicator.calledOnce);
            clock.restore();
         });

         it('should not call _showIndicator if show cancel', function () {
            let clock = sinon.useFakeTimers((new Date()).getTime(), 'setTimeout', 'clearTimeout');
            ListView.prototype._toggleIndicator.call(_this, true);
            assert.isDefined(_this._loadingIndicatorTimer);
            ListView.prototype._toggleIndicator.call(_this, false);
            clock.tick(1000);
            assert.isUndefined(_this._loadingIndicatorTimer);
            assert(_this._showLoadingOverlay.called);
            assert(_this._showIndicator.notCalled);
            clock.restore();
         });
      });
   });
});