define([
   'Controls/DragNDrop/Controller',
   'Core/vdom/Synchronizer/resources/SyntheticEvent'
], function(Controller, SyntheticEvent) {
   'use strict';


   //mock method, because it works with DOM
   Controller._private.preventClickEvent = function() {};

   function createNativeEvent(type, pageX, pageY) {
      //mock dom event
      var result =  {
         preventDefault: function() {},
         type: type,
         buttons: 1
      };
      if (type === 'touchstart' || type === 'touchmove') {
         result.touches = [{
            pageX: pageX,
            pageY: pageY
         }];
      } else if (type === 'touchend') {
         result.changedTouches = [{
            pageX: pageX,
            pageY: pageY
         }];
      } else {
         result.pageX = pageX;
         result.pageY = pageY;
      }

      return result;
   }

   function createSyntheticEvent(type, pageX, pageY) {
      return new SyntheticEvent(createNativeEvent(type, pageX, pageY));
   }

   var startEvent = createNativeEvent('mousedown', 20, 10);

   describe('Controls.DragNDrop.Controller', function() {
      var events = [];

      it('isDragStarted', function() {
         assert.isTrue(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 25, 10)));
         assert.isTrue(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 20, 15)));
         assert.isTrue(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 20, 5)));
         assert.isTrue(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 15, 10)));
         assert.isFalse(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 24, 10)));
         assert.isFalse(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 20, 14)));
         assert.isFalse(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 16, 10)));
         assert.isFalse(Controller._private.isDragStarted(startEvent, createNativeEvent('mousemove', 20, 6)));
      });
      it('getDragOffset', function() {
         assert.deepEqual(Controller._private.getDragOffset(startEvent, createNativeEvent('mousemove', 40, 20)), {x: -20, y: -10});
         assert.deepEqual(Controller._private.getDragOffset(startEvent, createNativeEvent('mousemove', 0, 0)), {x: 20, y: 10});
         assert.deepEqual(Controller._private.getDragOffset(startEvent, createNativeEvent('mousemove', -10, -10)), {x: 30, y: 20});
      });
      describe('getPageXY', function() {
         it('touchstart and touchmove', function() {
            var
               touchmove = createNativeEvent('touchmove', 40, 10),
               touchstart = createNativeEvent('touchstart', 30, 20),
               touchmoveXY = Controller._private.getPageXY(touchmove),
               touchstartXY = Controller._private.getPageXY(touchstart);

            assert.deepEqual(touchmoveXY, {x: 40, y: 10});
            assert.deepEqual(touchstartXY, {x: 30, y: 20});
         });
         it('touchend', function() {
            var
               touchend = createNativeEvent('touchend', 50, 60),
               touchendXY = Controller._private.getPageXY(touchend);

            assert.deepEqual(touchendXY, {x: 50, y: 60});
         });
         it('mouse events', function() {
            var
               mouseup = createNativeEvent('mouseup', 15, 25),
               mouseupXY = Controller._private.getPageXY(mouseup);

            assert.deepEqual(mouseupXY, {x: 15, y: 25});
         });
      });
      describe('Controls.DragNDrop.Controller phase', function() {
         var
            dragObject,
            entity = {},
            controller = new Controller(),
            startEvent = createSyntheticEvent('mousedown', 20, 10);

         controller._afterMount();

         controller.saveOptions({
            draggingTemplate: 'template'
         });

         controller._notify = function(eventName, args) {
            if (eventName === 'register' || eventName === 'unregister') {
               eventName = eventName + args[0];
            }
            events.push(eventName);
            if (eventName === '_documentDragStart') {
               this._documentDragStart();
            }
            if (eventName === '_documentDragEnd') {
               this._documentDragEnd();
            }
            if (eventName === 'dragMove') {
               dragObject = args[0];
            }
         };

         afterEach(function() {
            events = [];
            dragObject = null;
         });

         describe('mouse', function() {
            it('dragStart', function() {
               events = [];
               controller.startDragNDrop(entity, startEvent);
               assert.equal(startEvent.nativeEvent, controller._startEvent);
               assert.equal(events.join(', '), 'registermousemove, registertouchmove, registermouseup, registertouchend');
            });
            it('mouseMove without start dragMove', function() {
               controller._onMouseMove(createSyntheticEvent('mousemove', 20, 10));
               assert.equal(events.join(', '), '');
               assert.isFalse(controller._documentDragging);
               assert.isFalse(controller._insideDragging);
            });
            it('start dragMove', function() {
               controller._onMouseMove(createSyntheticEvent('mousemove', 25, 10));
               assert.equal(events.join(', '), '_documentDragStart, dragStart, documentDragStart, dragMove, _updateDraggingTemplate');
               assert.isTrue(controller._documentDragging);
               assert.isTrue(controller._insideDragging);
            });
            it('dragMove', function() {
               controller._onMouseMove(createSyntheticEvent('mousemove', 30, 15));
               assert.equal(events.join(', '), 'dragMove, _updateDraggingTemplate');
               assert.deepEqual(dragObject.offset, {x: 10, y: 5});
               assert.deepEqual(dragObject.position, {x: 30, y: 15});
            });
            it('dragLeave', function() {
               controller._mouseLeave();
               assert.equal(events.join(', '), 'dragLeave');
               assert.isFalse(controller._insideDragging);
            });
            it('dragEnter', function() {
               controller._mouseEnter();
               assert.equal(events.join(', '), 'dragEnter');
               assert.isTrue(controller._insideDragging);
            });
            it('dragEnd', function() {
               controller._onMouseUp(createSyntheticEvent('mouseup', 50, 45));
               assert.equal(events.join(', '), '_documentDragEnd, dragEnd, documentDragEnd, unregistermousemove, unregistertouchmove, unregistermouseup, unregistertouchend');
               assert.isFalse(controller._documentDragging);
               assert.isFalse(controller._insideDragging);
               assert.isFalse(!!controller._startEvent);
               assert.isFalse(!!controller._dragEntity);
            });
         });
         describe('touch', function() {
            it('dragStart', function() {
               controller.startDragNDrop(entity, startEvent);
               assert.equal(startEvent.nativeEvent, controller._startEvent);
               assert.equal(events.join(', '), 'registermousemove, registertouchmove, registermouseup, registertouchend');
            });
            it('touchmove without start dragMove', function() {
               controller._onTouchMove(createSyntheticEvent('touchmove', 20, 10));
               assert.equal(events.join(', '), '');
               assert.isFalse(controller._documentDragging);
               assert.isFalse(controller._insideDragging);
            });
            it('start dragMove', function() {
               controller._onTouchMove(createSyntheticEvent('touchmove', 25, 10));
               assert.equal(events.join(', '), '_documentDragStart, dragStart, documentDragStart, dragMove, _updateDraggingTemplate');
               assert.isTrue(controller._documentDragging);
               assert.isTrue(controller._insideDragging);
            });
            it('dragMove', function() {
               controller._onTouchMove(createSyntheticEvent('touchmove', 30, 15));
               assert.equal(events.join(', '), 'dragMove, _updateDraggingTemplate');
               assert.deepEqual(dragObject.offset, {x: 10, y: 5});
               assert.deepEqual(dragObject.position, {x: 30, y: 15});
            });
            it('dragLeave', function() {
               controller._mouseLeave();
               assert.equal(events.join(', '), 'dragLeave');
               assert.isFalse(controller._insideDragging);
            });
            it('dragEnter', function() {
               controller._mouseEnter();
               assert.equal(events.join(', '), 'dragEnter');
               assert.isTrue(controller._insideDragging);
            });
            it('dragEnd', function() {
               controller._onMouseUp(createSyntheticEvent('mouseup', 50, 45));
               assert.equal(events.join(', '), '_documentDragEnd, dragEnd, documentDragEnd, unregistermousemove, unregistertouchmove, unregistermouseup, unregistertouchend');
               assert.isFalse(controller._documentDragging);
               assert.isFalse(controller._insideDragging);
               assert.isFalse(!!controller._startEvent);
               assert.isFalse(!!controller._dragEntity);
            });
         });
      });
   });
});
