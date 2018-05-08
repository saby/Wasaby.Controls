define('Controls/Container/DragNDrop',
   [
      'Core/Control',
      'tmpl!Controls/Container/DragNDrop/DragNDrop'
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

      return Control.extend({
         _template: template,
         _startEvent: undefined,
         _dragEntity: undefined,
         _isDragging: false,

         _startDragNDrop: function(event, entity, domEvent) {
            this._dragEntity = entity;
            this._startEvent = domEvent.nativeEvent;
         },

         _mouseMove: function(event) {
            var
               startEvent = this._startEvent,
               nativeEvent = event.nativeEvent;

            if (this._startEvent) {
               if (!this._isDragging && _private.isDragStarted(startEvent, nativeEvent)) {
                  this._isDragging = true;
                  _private.preventClickEvent(startEvent);
               }
               if (this._isDragging) {
                  this._children.dragMoveDetect.start(this._getDragObject(nativeEvent, this._startEvent));
               }
            }
         },

         _getDragObject: function(mouseEvent, startEvent) {
            return {
               entity: this._dragEntity,
               position: _private.getDragPosition(mouseEvent),
               offset: _private.getDragOffset(mouseEvent, startEvent)
            };
         },

         _mouseUp: function(event) {
            if (this._startEvent) {
               if (this._isDragging) {
                  this._isDragging = false;
                  this._children.dragEndDetect.start(this._getDragObject(event.nativeEvent, this._startEvent));
               }

               this._dragEntity = null;
               this._startEvent = null;
            }
         }
      });
   });
