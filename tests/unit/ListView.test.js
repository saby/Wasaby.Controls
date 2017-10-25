/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.ListView',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Source/Memory'
], function (ListView, RecordSet, Memory) {
   'use strict';
   describe('SBIS3.CONTROLS.ListView', function () {
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
   });
});