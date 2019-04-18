import Control = require('Core/Control');
import Env = require('Env/Env');
import template = require('wml!Controls/_dragnDrop/Controller/Controller');
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

      /**
       * Container allows you to handle drag'n'drop events on the page.
       * The control must be inside Controls/_dragnDrop/Container.
       * More information you can read <a href="/doc/platform/developmentapl/interface-development/controls/drag-n-drop/">here</a>.
       * @class Controls/_dragnDrop/Controller
       * @extends Core/Control
       * @control
       * @public
       * @author Авраменко А.С.
       * @category DragNDrop
       */

      /**
       * @typedef {Object} dragObject
       * @property {Env/Event:Object} domEvent The event descriptor.
       * @property {Object} position The coordinates of the pointer.
       * @property {Object} offset The offset from the starting position drag'n'drop.
       */

      /**
       * @name Controls/_dragnDrop/Controller#draggingTemplate
       * @cfg {Function} Template of the entity to be moved.
       * @remark In the process of moving, a thumbnail of the entity being moved is shown near the cursor.
       * @example
       * The following example shows how to set your dragging template.
       * <pre>
       *    <Controls._dragnDrop.Controller>
       *       <ws:draggingTemplate>
       *          <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *       </ws:draggingTemplate>
       *       <ws:content>
       *          <div>
       *             <ws:for data="item in _items">
       *                <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *             </ws:for>
       *          </div>
       *       </ws:content>
       *    </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *     _items: [...]
       *       ...
       *    });
       * </pre>
       */

      /**
       * Method to initialize the start of drag'n'drop.
       * @function Controls/_dragnDrop/Controller#startDragNDrop
       * @param {Controls/_dragnDrop/Entity} entity Moved entity.
       * @param {Env/Event:Object} event The event that occurred to the handler the mouseDown(touchStart).
       * @example
       * The following example shows how to start dragNDrop.
       * <pre>
       *    <Controls._dragnDrop.Controller name="dragNDropController">
       *       <ws:draggingTemplate>
       *          <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *       </ws:draggingTemplate>
       *       <ws:content>
       *          <div>
       *             <ws:for data="item in _items">
       *                <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *             </ws:for>
       *          </div>
       *       </ws:content>
       *    </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       */

      /**
       * @event Controls/_dragnDrop/Controller#documentDragStart Occurs after the user starts dragging an element in the page.
       * @param {Env/Event:Object} eventObject The event descriptor.
       * @param {dragObject} dragObject Object with meta information.
       * @remark The event fires at all controllers on the page, including the controller in which the move began.
       * @example
       * The following example shows how to change the visual state of a control when you start a dragNDrop in another control.
       * <pre>
       *     <Controls._dragnDrop.Controller name="dragNDropController">
       *        <ws:draggingTemplate>
       *          <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *        </ws:draggingTemplate>
       *        <ws:content>
       *          <div>
       *             <ws:for data="item in _items">
       *                <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *             </ws:for>
       *          </div>
       *        </ws:content>
       *     </Controls._dragnDrop.Controller>
       *     <Controls._dragnDrop.Controller on:documentDragStart="_documentDragStart()">
       *        <div class="demo-Basket {{_documentDrag ? 'demo-Basket_withDragStyle'}}"></div>
       *     </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _documentDrag: false,
       *       _documentDragStart: function(event, dragObject) {
       *          this._documentDrag = true;
       *       },
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       * @see documentDragEnd
       * @see dragStart
       * @see dragEnd
       */

      /**
       * @event Controls/_dragnDrop/Controller#documentDragEnd Occurs after the user has finished dragging an element in the page.
       * @param {Env/Event:Object} eventObject The event descriptor.
       * @param {dragObject} dragObject Object with meta information.
       * @remark The event fires on all controllers on the page, including the controller where the move ended.
       * @example
       * The following example shows how to change the visual state of a control when you end a dragNDrop in another control.
       * <pre>
       *     <Controls._dragnDrop.Controller name="dragNDropController">
       *        <ws:draggingTemplate>
       *          <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *        </ws:draggingTemplate>
       *        <ws:content>
       *           <div>
       *              <ws:for data="item in _items">
       *                 <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *              </ws:for>
       *           </div>
       *        </ws:content>
       *     </Controls._dragnDrop.Controller>
       *     <Controls._dragnDrop.Controller on:documentDragStart="_documentDragStart()" on:documentDragEnd="_documentDragEnd()">
       *        <div class="demo-Basket {{_documentDrag ? 'demo-Basket_withDragStyle'}}"></div>
       *     </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _documentDrag: false,
       *       _documentDragStart: function(event, dragObject) {
       *          this._documentDrag = true;
       *       },
       *       _documentDragEnd: function(event, dragObject) {
       *          this._documentDrag = false;
       *       },
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       * @see documentDragStart
       * @see dragStart
       * @see dragEnd
       */

      /**
       * @event Controls/_dragnDrop/Controller#dragStart Occurs after the user starts dragging an element in the current controller.
       * @param {Env/Event:Object} eventObject The event descriptor.
       * @param {dragObject} dragObject Object with meta information.
       * @remark The event fires only on the controller where the move has started.
       * @example
       * The following example shows how to hide a movable item.
       * <pre>
       *     <Controls._dragnDrop.Controller name="dragNDropController" on:dragStart="_onDragStart()">
       *        <ws:draggingTemplate>
       *           <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *        </ws:draggingTemplate>
       *        <ws:content>
       *           <div>
       *              <ws:for data="item in _items">
       *                 <ws:if data="{{item.key !== _dragItemKey }}">
       *                    <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *                 </ws:if>
       *              </ws:for>
       *           </div>
       *        </ws:content>
       *     </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _dragItemKey: null,
       *       _onDragStart: function(event, dragObject) {
       *          this._dragItemKey = dragObject.entity._options.item.getId();
       *       },
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       * @see documentDragStart
       * @see documentDragEnd
       * @see dragEnd
       */

      /**
       * @event Controls/_dragnDrop/Controller#dragEnd Occurs after the user has finished dragging an item in the current controller.
       * @param {Env/Event:Object} eventObject The event descriptor.
       * @param {dragObject} dragObject Object with meta information.
       * @remark The event fires only on the controller where the move ended.
       * @example
       * The following example shows how to update an item at the source after the move is complete.
       * <pre>
       *     <Controls._dragnDrop.Controller name="dragNDropController" on:dragEnd="_onDragEnd()">
       *        <ws:draggingTemplate>
       *            <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *        </ws:draggingTemplate>
       *        <ws:content>
       *            <div>
       *                <ws:for data="item in _items">
       *                    <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *                </ws:for>
       *            </div>
       *        </ws:content>
       *     </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _onDragEnd: function(event, dragObject) {
       *          var dragItem = dragObject.entity._options.item;
       *          dragItem.set('position', dragObject.position);
       *          this._itemsSource.update(dragItem);
       *       },
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       * @see documentDragStart
       * @see documentDragEnd
       * @see dragStart
       */

      /**
       * @event Controls/_dragnDrop/Controller#dragEnter Occurs after an item is moved inside the controller.
       * @param {Env/Event:Object} eventObject The event descriptor.
       * @param {dragObject} dragObject Object with meta information.
       * @example
       * The following example shows how to change the visual state of a control when you move the cursor over it.
       * <pre>
       *     <Controls._dragnDrop.Controller name="dragNDropController">
       *        <ws:draggingTemplate>
       *           <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *        </ws:draggingTemplate>
       *        <ws:content>
       *           <div>
       *              <ws:for data="item in _items">
       *                 <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *              </ws:for>
       *           </div>
       *        </ws:content>
       *     </Controls._dragnDrop.Controller>
       *     <Controls._dragnDrop.Controller on:dragEnter="_dragEnter()" on:dragLeave="_dragLeave()">
       *        <div class="demo-Basket {{_dragInsideBasket ? 'demo-Basket_dragInside'}}"></div>
       *     </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _documentDrag: false,
       *       _dragEnter: function(event, dragObject) {
       *          this._dragInsideBasket = true;
       *       },
       *       _dragLeave: function(event, dragObject) {
       *          this._dragInsideBasket = false;
       *       },
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       * @see dragLeave
       * @see dragMove
       */

      /**
       * @event Controls/_dragnDrop/Controller#dragLeave Occurs after an item is moved outside the controller.
       * @param {Env/Event:Object} eventObject The event descriptor.
       * @param {dragObject} dragObject Object with meta information.
       * @example
       * The following example shows how to change the visual state of a control when you move the cursor over it.
       * <pre>
       *     <Controls._dragnDrop.Controller name="dragNDropController">
       *        <ws:draggingTemplate>
       *           <div class="demo-DraggingTemplate">CustomDraggingTemplate</div>
       *        </ws:draggingTemplate>
       *        <ws:content>
       *           <div>
       *              <ws:for data="item in _items">
       *                 <ws:partial template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *              </ws:for>
       *           </div>
       *        </ws:content>
       *     </Controls._dragnDrop.Controller>
       *     <Controls._dragnDrop.Controller on:dragEnter="_dragEnter()" on:dragLeave="_dragLeave()">
       *        <div class="demo-Basket {{_dragInsideBasket ? 'demo-Basket_dragInside'}}"></div>
       *     </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _documentDrag: false,
       *       _dragEnter: function(event, dragObject) {
       *          this._dragInsideBasket = true;
       *       },
       *       _dragLeave: function(event, dragObject) {
       *          this._dragInsideBasket = false;
       *       },
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       * @see dragEnter
       * @see dragMove
       */

      /**
       * @event Controls/_dragnDrop/Controller#dragMove Occurs when you move an item on a page.
       * @param {Env/Event:Object} eventObject The event descriptor.
       * @param {dragObject} dragObject Object with meta information.
       * @remark The event fires only on the controller where the move has started. The event fires every time a mousemove(touchmove) event occurs on the page.
       * @example
       * The following example shows how to change the position of an item on a page during a move.
       * <pre>
       *     <Controls._dragnDrop.Controller name="dragNDropController" on:dragMove="_dragMove()">
       *        <ws:content>
       *           <div>
       *              <ws:for data="item in _items">
       *                 <ws:partial style="{{_dragItemStyle}}" template="wml!MyModule/ItemTemplate" item="{{item}}" on:mousedown="_startDragNDrop(item)"/>
       *              </ws:for>
       *           </div>
       *        </ws:content>
       *     </Controls._dragnDrop.Controller>
       * </pre>
       *
       * <pre>
       *    Control.extend({
       *       ...
       *       _items: [...],
       *       _dragMove: function(event, dragObject) {
       *          this._dragItemStyle = this._objectToString({
       *             top: dragObject.position.y + 'px',
       *             left: dragObject.position.x + 'px',
       *             position: 'absolute'
       *          });
       *       },
       *       _objectToString: function() {...},
       *       _startDragNDrop: function(event, item) {
       *          this._children.dragNDropController.startDragNDrop(new Entity({
       *             item: item
       *          }), event);
       *       },
       *       ...
       *    });
       * </pre>
       * @see dragEnter
       * @see dragLeave
       */

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
            if (Env.detection.isIE) {
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

         _mouseEnter: function(event) {
            if (this._documentDragging) {
               this._insideDragging = true;
               this._notify('dragEnter', [this._getDragObject()]);
            }
            event.blockUpdate = true;
         },

         _mouseLeave: function(event) {
            if (this._documentDragging) {
               this._insideDragging = false;
               this._notify('dragLeave', [this._getDragObject()]);
            }
            event.blockUpdate = true;
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

      export = DragNDropController;
   
