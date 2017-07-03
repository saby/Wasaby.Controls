/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.ListView.DragMove',
   'js!SBIS3.CONTROLS.DragEntity.List'
], function (DragMove, DragList) {
   describe('DragMove', function () {
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
         }
      });
      describe('_checkHorisontalDragndrop', function () {
         it('should return true if target has display inline-block', function () {
            var target = $('<div style="display:inline-block; float:none">');
            assert.isTrue(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return true if target is a float', function () {
            var target = $('<div style="float:left">');
            assert.isTrue(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return true if parent targets has display flex', function () {
            var target = $('<div style="float:none">');
            parent = $('<div style="display: flex; flex-direction: row">');
            parent.html(target);
            assert.isTrue(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return flase if target has display block', function () {
            var target = $('<div style="float:none; display: block">');
            assert.isFalse(DragMove.prototype._checkHorisontalDragndrop(target));
         });
         it('should return false if parent targets has display flex and flex-direction column', function () {
            var target = $('<div style="float:none">');
            parent = $('<div style="display: flex; flex-direction: column">');
            parent.html(target);
            assert.isFalse(DragMove.prototype._checkHorisontalDragndrop(target));
         });
      });
      describe('_isCorrectSource', function () {
         it('should return true when source is list', function () {
            var list = new DragList({});
            assert.isTrue(DragMove.prototype._isCorrectSource(list));
         });
         it('should return false when source is array', function () {
            assert.isFalse(DragMove.prototype._isCorrectSource([]));
         });
      });
   });
});