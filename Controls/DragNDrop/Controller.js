define('Controls/DragNDrop/Controller',
   [
      'Core/Control',
      'Core/detection',
      'wml!Controls/DragNDrop/Controller/Controller'
   ],

   function(Control, detection, template) {
      var
         SHIFT_LIMIT = 4,
         IE_MOUSEMOVE_FIX_DELAY = 50;

      var _private = {
         getPageXY: function(event) {
            var pageX, pageY;
            if (event.type === 'touchstart' || event.type === 'touchmove') {
               pageX = event.touches[0].pageX;
               pageY = event.touches[0].pageY;
            } else if (event.type === 'touchend') {
               pageX = event.changedTouches[0].pageX;
               pageY = event.changedTouches[0].pageY;
            } else {
               pageX = event.pageX;
               pageY = event.pageY;
            }

            return {
               x: pageX,
               y: pageY
            };
         },
         isDragStarted: function(startEvent, moveEvent) {
            var offset = _private.getDragOffset(moveEvent, startEvent);
            return Math.abs(offset.x) > SHIFT_LIMIT || Math.abs(offset.y) > SHIFT_LIMIT;
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
         getDragOffset: function(moveEvent, startEvent) {
            var
               moveEventXY = _private.getPageXY(moveEvent),
               startEventXY = _private.getPageXY(startEvent);

            return {
               y: moveEventXY.y - startEventXY.y,
               x: moveEventXY.x - startEventXY.x
            };
         },
         onMove: function(self, nativeEvent) {
            var
               dragObject;

            if (self._startEvent) {
               dragObject = self._getDragObject(nativeEvent, self._startEvent);
               if (!self._documentDragging && _private.isDragStarted(self._startEvent, nativeEvent)) {
                  self._insideDragging = true;
                  self._notify('_documentDragStart', [dragObject], {bubbling: true});
               }
               if (self._documentDragging) {
                  self._notify('dragMove', [dragObject]);
                  if (self._options.draggingTemplate) {
                     self._notify('_updateDraggingTemplate', [dragObject, self._options.draggingTemplate], {bubbling: true});
                  }
               }
            }
         }
      };

      var DragNDropController = Control.extend({
         _template: template,
         _dragEntity: undefined,
         _startEvent: undefined,
         _documentDragging: false,
         _insideDragging: false,
         _endDragNDropTimer: null,

         startDragNDrop: function(entity, mouseDownEvent) {
            this._dragEntity = entity;
            this._startEvent = mouseDownEvent.nativeEvent;
            _private.preventClickEvent(this._startEvent);
            this._registerMouseMove();
            this._registerMouseUp();
         },

         _onMouseMove: function(event) {
            if (detection.isIE) {
               this._onMouseMoveIEFix(event);
            } else {
               //Check if the button is pressed while moving.
               if (!event.nativeEvent.buttons) {
                  this._dragNDropEnded(event);
               }
            }

            _private.onMove(this, event.nativeEvent);
         },

         _onMouseMoveIEFix: function(event) {
            var self = this;

            //In IE strange bug, the cause of which could not be found. During redrawing of the table the MouseMove
            //event at which buttons = 0 shoots. In 10 milliseconds we will check that the button is not pressed.
            if (!event.nativeEvent.buttons && !this._endDragNDropTimer) {
               this._endDragNDropTimer = setTimeout(function() {
                  self._dragNDropEnded(event);
               }, IE_MOUSEMOVE_FIX_DELAY);
            } else {
               clearTimeout(this._endDragNDropTimer);
               this._endDragNDropTimer = null;
            }
         },

         _onTouchMove: function(event) {
            _private.onMove(this, event.nativeEvent);
         },

         _onMouseUp: function(event) {
            if (this._startEvent) {
               this._dragNDropEnded(event);
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
            } else {
               this._dragEntity = dragObject.entity;
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
               result.position = _private.getPageXY(mouseEvent);
               result.offset = _private.getDragOffset(mouseEvent, startEvent);
               result.draggingTemplateOffset = this._options.draggingTemplateOffset;
            }
            return result;
         },

         _dragNDropEnded: function(event) {
            if (this._documentDragging) {
               this._notify('_documentDragEnd', [this._getDragObject(event.nativeEvent, this._startEvent)], {bubbling: true});
            }
            this._unregisterMouseMove();
            this._unregisterMouseUp();
            this._dragEntity = null;
            this._startEvent = null;
         },

         _registerMouseMove: function() {
            this._notify('register', ['mousemove', this, this._onMouseMove], {bubbling: true});
            this._notify('register', ['touchmove', this, this._onTouchMove], {bubbling: true});
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

      DragNDropController.getDefaultOptions = function() {
         return {
            draggingTemplateOffset: 10
         };
      };

      return DragNDropController;
   });
