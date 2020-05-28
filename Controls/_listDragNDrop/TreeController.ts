import { FlatController, IModel } from "./FlatController";

const DRAG_MAX_OFFSET = 15,
   EXPAND_ON_DRAG_DELAY = 1000;

export default class TreeController extends FlatController {
   private _expandOnDragData;
   private _timeoutForExpandOnDrag;
   private readonly _notifyExpandNode;

   constructor(model: IModel, notifyExpandNode: Function) {
      super(model);
      this._notifyExpandNode = notifyExpandNode;
   }

   calculateDragPosition(itemData, event) {
      if (!itemData.dispItem.isNode()) {
         return;
      }

      let
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
            if (this._avatarItem) {
               position = topOffset < DRAG_MAX_OFFSET ? 'before' : 'after';
               dragTargetPosition = this._calculateDragTargetPosition(itemData, position);
            }
         }
      }

      return dragTargetPosition;
   }

   startCountDownForExpandNode(itemData) {
      // проверяем что навели на узел, что для него уже не запущен timeout, что он не раскрыт
      // и что навели не на перетаскиваемый элемент
      if (itemData.item.get(itemData.nodeProperty) !== null
         && (!this._expandOnDragData || this._expandOnDragData !== itemData)
         && !itemData.isExpanded
         && this._avatarItem.key !== itemData.key) {
         this._clearTimeoutForExpandOnDrag();
         this._expandOnDragData = itemData;
         this._setTimeoutForExpandOnDrag(this._expandOnDragData);
      }
   }

   stopCountDownForExpandNode() {
      this._clearTimeoutForExpandOnDrag();
   }

   protected _calculateDragTargetPosition(targetData, position) {
      var result;

      //If you hover over the dragged item, and the current position is on the folder,
      //then you need to return the position that was before the folder.
      const prevDragTargetPosition = this._model.getPrevDragTargetPosition();
      if (this._avatarItem && this._avatarItem.index === targetData.index) {
         result = prevDragTargetPosition || null;
      } else if (targetData.dispItem.isNode()) {
         if (position === 'after' || position === 'before') {
            let startPosition,
               // TODO dnd было this._expandedItems.indexOf(ItemsUtil.getPropertyValue(itemData.dispItem.getContents(), this._options.keyProperty))
               afterExpandedNode = position === 'after' && this._model.getExpandedItems().indexOf(targetData.dispItem.getContents().getKey()) !== -1;

            //The position should not change if the record is dragged from the
            //bottom/top to up/down and brought to the bottom/top of the folder.
            if (prevDragTargetPosition) {
               if (prevDragTargetPosition.index === targetData.index) {
                  startPosition = prevDragTargetPosition.position;
               } else {
                  startPosition = prevDragTargetPosition.index < targetData.index ? 'before' : 'after';
               }
            }

            if (position !== startPosition && !afterExpandedNode) {
               result = {
                  index: targetData.index,
                  item: targetData.item,
                  data: targetData,
                  position: position
               };
            }
         } else {
            result = {
               index: targetData.index,
               position: 'on',
               item: targetData.item,
               data: targetData
            };
         }
      } else {
         result = super._calculateDragTargetPosition(targetData, position);
      }

      return result;
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