define('Controls/DragNDrop/Controller',
   [
      'Core/Control',
      'tmpl!Controls/DragNDrop/Controller/Controller'
   ],

   function(Control, template) {
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
         _documentDragging: false,
         _insideDragging: false,

         startDragNDrop: function(entity, mouseDownEvent) {
            this._dragEntity = entity;
            this._startEvent = mouseDownEvent.nativeEvent;
            this._registerMouseMove();
            this._registerMouseUp();
         },

         _onMouseMove: function(event) {
            var
               dragObject,
               startEvent = this._startEvent,
               nativeEvent = event.nativeEvent;

            if (this._startEvent) {
               dragObject = this._getDragObject(nativeEvent, startEvent);
               if (!this._documentDragging && _private.isDragStarted(startEvent, nativeEvent)) {
                  _private.preventClickEvent(startEvent);
                  this._insideDragging = true;
                  this._notify('_documentDragStart', [dragObject], {bubbling: true});
               }
               if (this._documentDragging) {
                  this._notify('dragMove', [dragObject]);
                  if (this._options.dragAvatarTemplate) {
                     this._notify('_updateDragAvatar', [dragObject, this._options.dragAvatarTemplate], {bubbling: true});
                  }
               }
            }
         },

         _onMouseUp: function(event) {
            if (this._startEvent) {
               if (this._documentDragging) {
                  this._notify('_documentDragEnd', [this._getDragObject(event.nativeEvent, this._startEvent)], {bubbling: true});
               }
               this._unregisterMouseMove();
               this._unregisterMouseUp();
               this._dragEntity = null;
               this._startEvent = null;
            }
         },

         _mouseEnter: function() {
            if (this._documentDragging) {
               this._insideDragging = true;
               this._notify('dragEnter', [this._getDragObject()]);
            }
         },

         _mouseLeave: function() {
            if (this._documentDragging) {
               this._insideDragging = false;
               this._notify('dragLeave', [this._getDragObject()]);
            }
         },

         _documentDragStart: function(dragObject) {
            if (this._insideDragging) {
               this._notify('dragStart', [dragObject]);
            }
            this._documentDragging = true;
            this._notify('documentDragStart', [dragObject]);
         },

         _documentDragEnd: function(dragObject) {
            if (this._insideDragging) {
               this._notify('dragEnd', [dragObject]);
            }
            this._insideDragging = false;
            this._documentDragging = false;
            this._notify('documentDragEnd', [dragObject]);
         },

         _getDragObject: function(mouseEvent, startEvent) {
            var result = {
               entity: this._dragEntity
            };
            if (mouseEvent && startEvent) {
               result.domEvent = mouseEvent;
               result.position = _private.getDragPosition(mouseEvent);
               result.offset = _private.getDragOffset(mouseEvent, startEvent);
            }
            return result;
         },

         _registerMouseMove: function() {
            this._notify('register', ['mousemove', this, this._onMouseMove], {bubbling: true});
            this._notify('register', ['touchmove', this, this._onMouseMove], {bubbling: true});
         },

         _unregisterMouseMove: function() {
            this._notify('unregister', ['mousemove', this], {bubbling: true});
            this._notify('unregister', ['touchmove', this], {bubbling: true});
         },

         _registerMouseUp: function() {
            this._notify('register', ['mouseup', this, this._onMouseUp], {bubbling: true});
            this._notify('register', ['touchend', this, this._onMouseUp], {bubbling: true});
         },

         _unregisterMouseUp: function() {
            this._notify('unregister', ['mouseup', this], {bubbling: true});
            this._notify('unregister', ['touchend', this], {bubbling: true});
         },

         _afterMount: function() {
            this._notify('register', ['documentDragStart', this, this._documentDragStart], {bubbling: true});
            this._notify('register', ['documentDragEnd', this, this._documentDragEnd], {bubbling: true});
         },

         _beforeUnmount: function() {
            this._unregisterMouseMove();
            this._unregisterMouseUp();
            this._notify('unregister', ['documentDragStart', this], {bubbling: true});
            this._notify('unregister', ['documentDragEnd', this], {bubbling: true});
         }
      });

      DragNDropController._private = _private;

      return DragNDropController;
   });
