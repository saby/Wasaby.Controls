define('Controls/DragNDrop/Controller',
   [
      'Core/Control',
      'Core/core-instance',
      'tmpl!Controls/DragNDrop/Controller/Controller'
   ],

   function(Control, cInstance, template) {
      var SHIFT_LIMIT = 4;

      var _private = {
         isDragStarted: function(startEvent, moveEvent) {
            var
               moveX = moveEvent.pageX - startEvent.pageX,
               moveY = moveEvent.pageY - startEvent.pageY;

            return Math.abs(moveX) > SHIFT_LIMIT || Math.abs(moveY) > SHIFT_LIMIT;
         },
         preventClickEvent: function(event) {
            if (event.type === 'mousedown') {
               event.preventDefault();

               //снимаем выделение с текста иначе не будут работать клики а выделение не будет сниматься по клику из за preventDefault
               var selection = window.getSelection();
               if (selection.removeAllRanges) {
                  selection.removeAllRanges();
               } else if (selection.empty) {
                  selection.empty();
               }
            }
         },
         getDragPosition: function(moseEvent) {
            return {
               y: moseEvent.pageY,
               x: moseEvent.pageX
            };
         },
         getDragOffset: function(moseEvent, startEvent) {
            return {
               y: moseEvent.pageY - startEvent.pageY,
               x: moseEvent.pageX - startEvent.pageX
            };
         }
      };

      var DragNDropController = Control.extend({
         _template: template,
         _dragEntity: undefined,
         _startEvent: undefined,

         startDragNDrop: function(entity, mouseDownEvent) {
            this._dragEntity = entity;
            this._startEvent = mouseDownEvent.nativeEvent;
         },

         _onMouseMove: function(event) {
            var
               dragObject,
               startEvent = this._startEvent,
               nativeEvent = event.nativeEvent;

            if (this._startEvent) {
               dragObject = this._getDragObject(nativeEvent, startEvent);
               if (!this._isDragging && _private.isDragStarted(startEvent, nativeEvent)) {
                  this._isDragging = true;
                  _private.preventClickEvent(startEvent);
                  this._dragStart(dragObject);
               }
               if (this._isDragging) {
                  this._dragMove(dragObject);
               }
            }
         },

         _onMouseUp: function(event) {
            if (this._startEvent) {
               if (this._isDragging) {
                  this._dragEnd(this._getDragObject(event.nativeEvent, this._startEvent));
                  this._isDragging = false;
               }

               this._dragEntity = null;
               this._startEvent = null;
            }
         },

         _dragStart: function(dragObject) {
            this._notify('dragStart', [dragObject]);
            this._notify('_dragInit', [dragObject], {bubbling: true});
         },

         _onDragInit: function(dragObject) {
            if (!this._isDragging) {
               this._notify('dragInit', [dragObject]);
            }
         },

         _dragMove: function(dragObject) {
            this._notify('dragMove', [dragObject]);
         },

         _mouseEnter: function() {
            if (this._isDragging) {
               this._notify('dragEnter', [this._getDragObject()]);
            }
         },

         _mouseLeave: function() {
            if (this._isDragging) {
               this._notify('dragLeave', [this._getDragObject()]);
            }
         },

         _dragEnd: function(dragObject) {
            this._notify('dragEnd', [dragObject]);
            this._notify('_dragReset', [dragObject], {bubbling: true});
         },

         _onDragReset: function(dragObject) {
            if (!this._isDragging) {
               this._notify('dragReset', [dragObject]);
            }
         },

         _getDragObject: function(mouseEvent, startEvent) {
            var result = {
               entity: this._dragEntity
            };
            if (mouseEvent && startEvent) {
               result.position = _private.getDragPosition(mouseEvent);
               result.offset = _private.getDragOffset(mouseEvent, startEvent);
            }
            return result;
         },

         _afterMount: function() {
            this._notify('register', ['mousemove', this, this._onMouseMove], {bubbling: true});
            this._notify('register', ['mouseup', this, this._onMouseUp], {bubbling: true});
            this._notify('register', ['dragInit', this, this._onDragInit], {bubbling: true});
            this._notify('register', ['dragReset', this, this._onDragReset], {bubbling: true});
         },

         _beforeUnmount: function() {
            this._notify('unregister', ['mousemove', this], {bubbling: true});
            this._notify('unregister', ['mouseup', this], {bubbling: true});
            this._notify('unregister', ['dragInit', this], {bubbling: true});
            this._notify('unregister', ['dragReset', this], {bubbling: true});
         }
      });

      return DragNDropController;
   });
