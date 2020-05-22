import { FlatController, IModel } from "./FlatController";

const DRAG_MAX_OFFSET = 15,
   EXPAND_ON_DRAG_DELAY = 1000;

export default class TreeController extends FlatController {
   private _expandOnDragData;
   private _timeoutForExpandOnDrag;
   private readonly _notifyExpandNode;

   constructor(useNewModel: boolean, model: IModel, notifyExpandNode: Function) {
      super(useNewModel, model);
      this._notifyExpandNode = notifyExpandNode;
   }

   handleMouseMove(itemData, event, notifyChangeDragTarget) {
      if (!itemData.dispItem.isNode()) {
         return;
      }

      var
         position,
         topOffset,
         bottomOffset,
         dragTargetRect,
         dragTargetPosition,
         dragTarget = event.target.closest('.js-controls-TreeView__dragTargetNode');

      if (dragTarget) {
         dragTargetRect = dragTarget.getBoundingClientRect();
         topOffset = event.nativeEvent.pageY - dragTargetRect.top;
         bottomOffset = dragTargetRect.top + dragTargetRect.height - event.nativeEvent.pageY;

         if (topOffset < DRAG_MAX_OFFSET || bottomOffset < DRAG_MAX_OFFSET) {
            if (this._model.getDragItemData()) {
               position = topOffset < DRAG_MAX_OFFSET ? 'before' : 'after';
               dragTargetPosition = this._model.calculateDragTargetPosition(itemData, position);

               if (dragTargetPosition && notifyChangeDragTarget(this._model.getDragEntity(), dragTargetPosition.item, dragTargetPosition.position) !== false) {
                  this._model.setDragTargetPosition(dragTargetPosition);
               }
            }
            if (itemData.item.get(itemData.nodeProperty) !== null && (!this._expandOnDragData || this._expandOnDragData !== itemData) && !itemData.isExpanded) {
               this._clearTimeoutForExpandOnDrag();
               this._expandOnDragData = itemData;
               this._setTimeoutForExpandOnDrag(this._expandOnDragData);
            }
         }
      }
   }

   handleMouseLeave() {
      super.handleMouseLeave();
      this._clearTimeoutForExpandOnDrag();
      this._expandOnDragData = null;
   }

   handleDragEnd(dragObject, notifyDragEnd) {
      super.handleDragEnd(dragObject, notifyDragEnd);
      this._clearTimeoutForExpandOnDrag();
   }

   private _setTimeoutForExpandOnDrag(itemData) {
      this._timeoutForExpandOnDrag = setTimeout(() => {
            this._notifyExpandNode(itemData);
         }, EXPAND_ON_DRAG_DELAY);
   }

   private _clearTimeoutForExpandOnDrag() {
      if (this._timeoutForExpandOnDrag) {
         clearTimeout(this._timeoutForExpandOnDrag);
         this._timeoutForExpandOnDrag = null;
      }
      this._expandOnDragData = null;
   }
}