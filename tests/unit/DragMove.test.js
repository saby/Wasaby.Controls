/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'js!SBIS3.CONTROLS.ListView.DragMove',
   'js!SBIS3.CONTROLS.DragEntity.List',
   'js!SBIS3.CONTROLS.DragObject',
   'js!SBIS3.CONTROLS.ListView',
   'js!WS.Data/Collection/RecordSet'
], function (DragMove, DragList, DragObject, ListView, RecordSet) {
   'use strict';
   describe('DragMove', function () {
      var list, element, view, dragMove, event;
      beforeEach(function () {
         if (typeof $ === 'undefined') {
            this.skip();
            return;
         }
         list = new DragList({});
         element = $(
            '<div class="view">' +
            '</div>'
         );
         view = new ListView({
            element: element,
            items: new RecordSet({
               rawData: [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
               idProperty: 'id'
            }),
            multiselect: true,
            displayProperty: 'id',
            idProperty: 'id'
         });
         dragMove = view._getDragMove();
         event = {
            type: "mouseUp",
            target: view.getContainer().find('[data-id=1]'),
            pageX: 0,
            pageY: 0
         };
      });
      afterEach(function () {
         DragObject.reset();
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
      describe('beginDrag', function () {
         it('should not begin drag', function () {
            var dragMove = new DragMove({
                  view: new ListView()
               });
            DragObject._jsEvent = {
               type: "mouseUp",
               target: $('<div/>'),
               pageX: 0,
               pageY: 0
            };
            assert.isFalse(dragMove.beginDrag());
         });
         it('should begin drag', function () {
            DragObject._jsEvent = event;
            assert.isTrue(dragMove.beginDrag());
         });
         it('should set source 1 element', function () {
            DragObject._jsEvent = event;
            dragMove.beginDrag();
            assert.equal(DragObject.getSource().getCount(), 1);
            assert.equal(DragObject.getSource().at(0).getModel().getId(), 1);
         });
         it('should set source 2 element', function () {
            DragObject._jsEvent = event;
            view.setSelectedKeys([1,2]);
            dragMove.beginDrag();
            assert.equal(DragObject.getSource().getCount(), 2);
            assert.include([1, 2], DragObject.getSource().at(0).getModel().getId());
            assert.include([1, 2], DragObject.getSource().at(1).getModel().getId());
         });
         it('should set source ', function () {
            DragObject._jsEvent = event;
            view.setSelectedKeys([1,2]);
            dragMove.beginDrag();
            assert.equal(DragObject.getSource().getCount(), 2);
            assert.include([1, 2], DragObject.getSource().at(0).getModel().getId());
            assert.include([1, 2], DragObject.getSource().at(1).getModel().getId());
         });
      })
   });
});