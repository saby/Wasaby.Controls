/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.ListView',
   'js!WS.Data/Collection/RecordSet'
], function (ListView, RecordSet) {
   'use strict';
   describe('SBIS3.CONTROLS.ListView', function () {
      describe('_checkHorisontalDragndrop', function () {
         it('should return true if target has display inline-block', function () {
            var target = $('<div style="display:inline-block; float:none">');
            assert.isTrue(ListView.prototype._checkHorisontalDragndrop(target));
         });
         it('should return true if target is a float', function () {
            var target = $('<div style="float:left">');
            assert.isTrue(ListView.prototype._checkHorisontalDragndrop(target));
         });
         it('should return true if parent targets has display flex', function () {
            var target = $('<div style="float:none">');
            parent = $('<div style="display: flex; flex-direction: row">');
            parent.html(target);
            assert.isTrue(ListView.prototype._checkHorisontalDragndrop(target));
         });
         it('should return flase if target has display block', function () {
            var target = $('<div style="float:none; display: block">');
            assert.isFalse(ListView.prototype._checkHorisontalDragndrop(target));
         });
         it('should return false if parent targets has display flex and flex-direction column', function () {
            var target = $('<div style="float:none">');
            parent = $('<div style="display: flex; flex-direction: column">');
            parent.html(target);
            assert.isFalse(ListView.prototype._checkHorisontalDragndrop(target));
         });
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
      it('should trigger onEndMove', function (done) {
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
         view.subscribe('onEndMove', function (e, result, movedItems, target, position) {
            assert.equal(movedItems[0], rs.at(1));
            assert.equal(target, rs.at(0));
            assert.equal(position, 'after');
            done();
         });
         view.move([rs.at(0)], rs.at(1), 'after');
      });
   });
});